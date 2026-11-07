package com.k4music.android.utils

import android.content.Context
import android.content.Intent
import android.net.Uri
import com.k4music.android.preferences.PlayerPreferences
import com.k4music.app.BuildConfig
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL

/**
 * Update check: one small request to update-android.json in the repository (raw GitHub). The file holds
 * the newest version, a title, a description, the download link and the button labels. A newer version
 * shows a popup with Update and Skip. Checked at most once every six hours while the app is on screen.
 */
object AppUpdate {
    class Release(
        val version: String,
        val title: String,
        val description: String,
        val url: String,
        val updateLabel: String,
        val skipLabel: String
    )

    private const val INFO = "https://raw.githubusercontent.com/Rupesh9369/OpenMusic/main/update-android.json"
    private const val EVERY_MS = 6 * 60 * 60 * 1000L
    private val versionPattern = Regex("[0-9]+(\\.[0-9]+){1,3}")
    private val _available = MutableStateFlow<Release?>(null)
    val available: StateFlow<Release?> = _available.asStateFlow()
    @Volatile private var checkedAt = 0L

    val currentVersion: String get() = BuildConfig.VERSION_NAME.substringBefore('-')

    /** Newer when some numeric part is bigger, comparing "1.0.1" with "1.0.0" part by part. */
    internal fun isNewer(candidate: String, current: String): Boolean {
        val a = candidate.split('.').map { it.toIntOrNull() ?: 0 }
        val b = current.split('.').map { it.toIntOrNull() ?: 0 }
        for (i in 0 until maxOf(a.size, b.size)) {
            val c = a.getOrElse(i) { 0 }.compareTo(b.getOrElse(i) { 0 })
            if (c != 0) return c > 0
        }
        return false
    }

    /** Reads update-android.json; null when the file is incomplete. */
    internal fun parse(json: String): Release? {
        val o = JSONObject(json)
        val version = o.optString("version").takeIf { it.matches(versionPattern) } ?: return null
        val url = o.optString("download_url").takeIf { it.startsWith("https://") } ?: return null
        return Release(
            version = version,
            title = o.optString("title").ifBlank { "Update available" },
            description = o.optString("description"),
            url = url,
            updateLabel = o.optString("update_label").ifBlank { "Update" },
            skipLabel = o.optString("skip_label").ifBlank { "Skip" }
        )
    }

    /** Reads update-android.json (when due, or [force]d); [available] holds a newer version, or null. Throws when offline. */
    suspend fun refresh(force: Boolean = false): Release? = withContext(Dispatchers.IO) {
        if (!force && System.currentTimeMillis() - checkedAt < EVERY_MS) return@withContext _available.value
        val connection = (URL(INFO).openConnection() as HttpURLConnection).apply {
            connectTimeout = 8_000
            readTimeout = 8_000
        }
        try {
            check(connection.responseCode == 200) { "Update info answered ${connection.responseCode}" }
            val text = connection.inputStream.bufferedReader().use { it.readText().take(50_000) }
            checkedAt = System.currentTimeMillis()
            val release = parse(text)?.takeIf { isNewer(it.version, currentVersion) }
            _available.value = release
            release
        } finally {
            connection.disconnect()
        }
    }

    /** Skip: this version's popup is not shown again. */
    fun skip(release: Release) {
        PlayerPreferences.skippedUpdateVersion = release.version
        _available.value = null
    }

    /** Opens the download (releases) link in the browser. */
    fun open(context: Context, release: Release) {
        runCatching {
            context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(release.url)).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
        }
    }
}
