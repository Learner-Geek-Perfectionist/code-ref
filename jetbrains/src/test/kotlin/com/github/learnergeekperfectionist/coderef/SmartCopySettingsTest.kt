package com.github.learnergeekperfectionist.coderef

import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class SmartCopySettingsTest {
    @Test
    fun `is disabled by default`() {
        val settings = SmartCopySettings()

        assertFalse(settings.enabled)
    }

    @Test
    fun `toggle flips enabled state`() {
        val settings = SmartCopySettings()

        settings.toggle()
        assertTrue(settings.enabled)

        settings.toggle()
        assertFalse(settings.enabled)
    }
}
