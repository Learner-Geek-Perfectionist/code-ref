package com.github.learnergeekperfectionist.coderef

import org.junit.Assert.assertEquals
import org.junit.Test

class ReferenceBuilderTest {
    @Test
    fun `builds a single-line reference`() {
        val reference = ReferenceBuilder.build(
            filePath = "/tmp/project/app/src/main/java/App.kt",
            selections = listOf(
                ReferenceSelection(startLine = 9, endLine = 9, endColumn = 12),
            ),
        )

        assertEquals("@/tmp/project/app/src/main/java/App.kt#10", reference)
    }

    @Test
    fun `builds a multi-line reference`() {
        val reference = ReferenceBuilder.build(
            filePath = "/tmp/project/app/src/main/java/App.kt",
            selections = listOf(
                ReferenceSelection(startLine = 9, endLine = 12, endColumn = 5),
            ),
        )

        assertEquals("@/tmp/project/app/src/main/java/App.kt#10-13", reference)
    }

    @Test
    fun `uses the previous line when selection ends at column zero`() {
        val reference = ReferenceBuilder.build(
            filePath = "/tmp/project/app/src/main/java/App.kt",
            selections = listOf(
                ReferenceSelection(startLine = 9, endLine = 12, endColumn = 0),
            ),
        )

        assertEquals("@/tmp/project/app/src/main/java/App.kt#10-12", reference)
    }

    @Test
    fun `joins multiple selected ranges with spaces`() {
        val reference = ReferenceBuilder.build(
            filePath = "/tmp/project/app/src/main/java/App.kt",
            selections = listOf(
                ReferenceSelection(startLine = 4, endLine = 4, endColumn = 8),
                ReferenceSelection(startLine = 9, endLine = 12, endColumn = 0),
            ),
        )

        assertEquals(
            "@/tmp/project/app/src/main/java/App.kt#5 @/tmp/project/app/src/main/java/App.kt#10-12",
            reference,
        )
    }
}
