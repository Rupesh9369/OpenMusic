package com.k4music.desktop

import java.nio.file.Files
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class AppPathsTest {
    @Test
    fun theOldK4MusicFolderMovesToK4AudioOnce() {
        val base = Files.createTempDirectory("k4paths").toFile()
        base.resolve("OpenMusic").apply { mkdirs(); resolve("data.db").writeText("library") }

        val moved = AppPaths.moved(base.path)
        assertEquals("OpenMusic", moved.name)
        assertEquals("library", moved.resolve("data.db").readText(), "the library came along")
        assertTrue(!base.resolve("OpenMusic").exists())

        // A second start with both present never touches either.
        base.resolve("OpenMusic").mkdirs()
        AppPaths.moved(base.path)
        assertTrue(base.resolve("OpenMusic").exists() && base.resolve("OpenMusic").resolve("data.db").exists())
        base.deleteRecursively()
    }
}
