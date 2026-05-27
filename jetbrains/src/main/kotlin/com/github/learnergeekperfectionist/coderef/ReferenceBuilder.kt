package com.github.learnergeekperfectionist.coderef

data class ReferenceSelection(
    val startLine: Int,
    val endLine: Int,
    val endColumn: Int,
)

object ReferenceBuilder {
    fun build(filePath: String, selections: List<ReferenceSelection>): String =
        selections.joinToString(" ") { selection ->
            val startLine = selection.startLine + 1
            val endLine = adjustedEndLine(selection)

            if (startLine == endLine) {
                "@$filePath#$startLine"
            } else {
                "@$filePath#$startLine-$endLine"
            }
        }

    private fun adjustedEndLine(selection: ReferenceSelection): Int {
        if (selection.endColumn == 0 && selection.endLine > selection.startLine) {
            return selection.endLine
        }

        return selection.endLine + 1
    }
}
