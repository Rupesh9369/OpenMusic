package com.k4music.android.utils

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

class AppUpdateTest {
    @Test fun `newer means a bigger number part by part`() {
        assertTrue(AppUpdate.isNewer("1.0.1", "1.0.0"))
        assertTrue(AppUpdate.isNewer("1.1.0", "1.0.9"))
        assertFalse(AppUpdate.isNewer("1.0.0", "1.0.0"))
        assertFalse(AppUpdate.isNewer("1.0.0", "1.0.1"))
    }

    @Test fun `reads the title, version, description and buttons`() {
        val release = AppUpdate.parse(
            """{"title":"Update available","version":"1.0.1","description":"Small fixes",
               "download_url":"https://github.com/Rupesh9369/OpenMusic/releases","update_label":"Update","skip_label":"Skip"}"""
        )!!
        assertEquals("1.0.1", release.version)
        assertEquals("Update available", release.title)
        assertEquals("Small fixes", release.description)
        assertEquals("Update", release.updateLabel)
        assertEquals("Skip", release.skipLabel)
    }

    @Test fun `a file without a version or a link is ignored`() {
        assertNull(AppUpdate.parse("""{"version":"1.0.1"}"""))
        assertNull(AppUpdate.parse("""{"download_url":"https://github.com/x/releases"}"""))
    }
}
