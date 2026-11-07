package com.k4music.desktop

import com.k4music.providers.utils.useCancellable

import com.k4music.desktop.ui.screens.compareVersions
import com.k4music.providers.github.GitHub
import com.k4music.providers.github.requests.releases
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.File
import java.net.URI
import okhttp3.OkHttpClient
import okhttp3.Request
import java.util.concurrent.TimeUnit
import java.security.MessageDigest
import kotlinx.coroutines.ensureActive

/**
 * In-app updates: finds the newest OpenMusic release, downloads its Windows installer and starts
 * it. The installer then shows "Updating OpenMusic", closes this app properly and starts it again.
 * A release without a Windows installer leads to the website instead.
 */
object Updater {
    /** A newer release; [installerUrl] is null when it has no Windows installer yet. */
    class Update(
        val version: String,
        val notes: String?,
        val installerUrl: String?,
        val installerSize: Long,
        val digest: String? = null,
        val title: String? = null,
        val updateLabel: String? = null,
        val skipLabel: String? = null,
    )

    /** The packaged app's version; a development run reads it from the build (version.properties). */
    val currentVersion: String get() = System.getProperty("jpackage.app-version") ?: builtVersion

    private val builtVersion: String by lazy {
        runCatching {
            java.util.Properties().apply { Updater::class.java.getResourceAsStream("/version.properties")?.use(::load) }
                .getProperty("version")
        }.getOrNull()?.takeIf { it.matches(Regex("[0-9]+(?:\\.[0-9]+){1,3}")) } ?: "0.0.0"
    }

    private const val INFO = "https://raw.githubusercontent.com/Rupesh9369/OpenMusic/main/update-windows.json"
    private const val RELEASES_PAGE = "https://github.com/Rupesh9369/OpenMusic/releases"

    private val client = OkHttpClient.Builder().connectTimeout(20, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS).callTimeout(10, TimeUnit.MINUTES).build()
    private val verified = java.util.concurrent.ConcurrentHashMap<String, String>()
    private val installerName = Regex("K4(Music|Audio)-Setup-.*\\.exe", RegexOption.IGNORE_CASE)

    /** Release notes as plain bullets: the "What's new" list without tables, headings or markdown marks. */
    internal fun cleanNotes(markdown: String?): String? {
        val lines = markdown?.lines().orEmpty()
        val start = lines.indexOfFirst { it.contains("what's new", ignoreCase = true) }
        val bullets = lines.drop(if (start >= 0) start + 1 else 0)
            .map { it.trim() }
            .filter { it.startsWith("- ") || it.startsWith("* ") }
            .map { "• " + it.drop(2).replace("**", "").replace("`", "").trim() }
            .take(8)
        return bullets.joinToString("\n").take(900).ifBlank { null }
    }

    /** The newest release if it is newer than this app; null when up to date. Throws when offline. */
    /** Reads update.json from the repository: the newest version, its message and the Windows download link. Null when this build is current. */
    suspend fun check(): Update? = withContext(Dispatchers.IO) {
        val body = client.newCall(Request.Builder().url(INFO).build()).execute().use { response ->
            check(response.isSuccessful) { "Update info answered ${response.code}" }
            response.body?.string().orEmpty().take(50_000)
        }
        val json = org.json.JSONObject(body)
        val version = json.optString("version").trimStart('v', 'V')
        if (!version.matches(Regex("[0-9]+(?:\\.[0-9]+){1,3}"))) return@withContext null
        if (compareVersions(version, currentVersion) <= 0) return@withContext null
        // Only the project's own releases page may be opened: the JSON comes from the network.
        val url = json.optString("download_url").takeIf { it.startsWith(RELEASES_PAGE) }
        Update(
            version = version,
            notes = json.optString("description").takeIf { it.isNotBlank() },
            installerUrl = url,
            installerSize = -1L,
            title = json.optString("title").takeIf { it.isNotBlank() },
            updateLabel = json.optString("update_label").takeIf { it.isNotBlank() },
            skipLabel = json.optString("skip_label").takeIf { it.isNotBlank() },
        )
    }

    /** Downloads the installer (resuming nothing, overwriting a stale copy), reporting 0..1 progress. */
    suspend fun download(update: Update, onProgress: (Float) -> Unit): File = withContext(Dispatchers.IO) {
        val url = URI(requireNotNull(update.installerUrl))
        require(url.scheme == "https" && url.host.equals("github.com", true) &&
            url.path.startsWith("/Rupesh9369/OpenMusic/releases/download/", true)) { "Unexpected update source" }
        require(update.version.matches(Regex("[0-9]+(?:\\.[0-9]+){1,3}"))) { "Invalid update version" }
        val expected = requireNotNull(update.digest).removePrefix("sha256:")
        require(expected.matches(Regex("[0-9a-fA-F]{64}"))) { "Missing update checksum" }
        val dir = AppPaths.local.resolve("updates").apply { mkdirs() }
        val target = dir.resolve("OpenMusic-Setup-${update.version}.exe")
        val part = File.createTempFile("installer-", ".part", dir)
        try {
            client.newCall(Request.Builder().url(url.toString()).build()).useCancellable { response ->
                check(response.isSuccessful) { "Download failed (HTTP ${response.code})" }
                val total = update.installerSize.takeIf { it > 0 } ?: response.body.contentLength()
                val hash = MessageDigest.getInstance("SHA-256")
                var done = 0L
                response.body.byteStream().use { input ->
                    java.io.FileOutputStream(part).use { out ->
                        val buffer = ByteArray(256 * 1024)
                        while (true) {
                            kotlin.coroutines.coroutineContext.ensureActive()
                            val count = input.read(buffer)
                            if (count < 0) break
                            out.write(buffer, 0, count)
                            hash.update(buffer, 0, count)
                            done += count
                            check(total <= 0 || done <= total) { "Unexpected update size" }
                            if (total > 0) onProgress((done.toFloat() / total).coerceIn(0f, 1f))
                        }
                        out.fd.sync()
                    }
                }
                check(done > 0 && (total <= 0 || done == total)) { "Download was cut off" }
                val actual = hash.digest().joinToString("") { "%02x".format(it.toInt() and 0xff) }
                check(actual.equals(expected, true)) { "Update checksum mismatch" }
            }
            kotlin.coroutines.coroutineContext.ensureActive()
            java.nio.file.Files.move(part.toPath(), target.toPath(), java.nio.file.StandardCopyOption.REPLACE_EXISTING)
            verified[target.canonicalPath] = expected
            target
        } finally { part.delete() }
    }

    /** Removes installers of versions already installed and interrupted downloads (~115 MB each). */
    fun cleanup() {
        val dir = AppPaths.local.resolve("updates")
        dir.listFiles()?.forEach { file ->
            val version = file.name.removePrefix("OpenMusic-Setup-").removePrefix("K4Audio-Setup-").removePrefix("K4Music-Setup-").removeSuffix(".exe")
            val stale = file.name.endsWith(".part") ||
                (installerName.matches(file.name) && compareVersions(version, currentVersion) <= 0)
            if (stale) runCatching { file.delete() }
        }
    }

    /** Thumbprint of the Authenticode signer of [file]; null when unsigned or the file was altered. */
    internal suspend fun signer(file: File): String? {
        val path = file.absolutePath.replace("'", "''")
        val script = "\$s = Get-AuthenticodeSignature -LiteralPath '$path'; " +
            "if (\$s.Status -eq 'HashMismatch' -or -not \$s.SignerCertificate) { '' } else { \$s.SignerCertificate.Thumbprint }"
        return com.k4music.desktop.data.Maintenance.runTool(
            listOf("powershell.exe", "-NoProfile", "-NonInteractive", "-Command", script), 30
        ).lines().map { it.trim() }.lastOrNull { it.isNotBlank() }
            // Only a thumbprint counts: a warning or banner line from PowerShell must never pass as a signer.
            ?.takeIf { it.matches(Regex("[0-9A-Fa-f]{40}")) }
    }

    /** The signer of the installed app's own launcher; null in dev runs or when it is unsigned. */
    private suspend fun installedSigner(): String? {
        if (System.getProperty("jpackage.app-version") == null) return null
        val exe = ProcessHandle.current().info().command().orElse(null)?.let(::File) ?: return null
        return runCatching { signer(exe) }.getOrNull()
    }

    /** Starts the installer; it closes this app itself (see the installer's PrepareToInstall). */
    suspend fun install(installer: File) = withContext(Dispatchers.IO) {
        // /FROMAPP=1: the user already chose "Update now", so Setup closes the app without asking.
        val expected = requireNotNull(verified[installer.canonicalPath]) { "Download and verify the update first" }
        val hash = MessageDigest.getInstance("SHA-256")
        installer.inputStream().use { input ->
            val buffer = ByteArray(256 * 1024)
            while (true) { val count = input.read(buffer); if (count < 0) break; hash.update(buffer, 0, count) }
        }
        val actual = hash.digest().joinToString("") { "%02x".format(it.toInt() and 0xff) }
        check(actual.equals(expected, true)) { "Update changed after verification" }
        // A signed install only accepts an installer from the same publisher, so a swapped release
        // asset cannot pass on its checksum alone. Unsigned installs have nothing to pin to.
        val own = installedSigner()
        if (own != null) check(signer(installer) == own) { "Update is not signed by the same publisher" }
        else AppLog.w("Updater", "This install is unsigned: publisher check skipped")
        ProcessBuilder(installer.absolutePath, "/FROMAPP=1").start()
        AppLog.i("Updater", "Started ${installer.name}")
    }
}
