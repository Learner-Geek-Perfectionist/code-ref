package com.github.learnergeekperfectionist.coderef

import com.intellij.openapi.actionSystem.DataContext
import com.intellij.openapi.editor.Caret
import com.intellij.openapi.editor.Editor
import com.intellij.openapi.editor.actionSystem.EditorActionHandler
import com.intellij.openapi.fileEditor.FileDocumentManager
import com.intellij.openapi.ide.CopyPasteManager
import java.awt.datatransfer.StringSelection

class CopyReferenceEditorActionHandler(
    private val delegate: EditorActionHandler,
) : EditorActionHandler() {
    @Suppress("OVERRIDE_DEPRECATION", "DEPRECATION")
    override fun isEnabled(editor: Editor, dataContext: DataContext): Boolean {
        return canCopyReference(editor) || delegate.isEnabled(editor, dataContext)
    }

    override fun doExecute(editor: Editor, caret: Caret?, dataContext: DataContext) {
        if (!copyReference(editor)) {
            delegate.execute(editor, caret, dataContext)
        }
    }

    private fun copyReference(editor: Editor): Boolean {
        if (!canCopyReference(editor)) {
            return false
        }

        val filePath = FileDocumentManager.getInstance().getFile(editor.document)?.path ?: return false
        val selections = selectedRanges(editor)

        CopyPasteManager.getInstance().setContents(
            StringSelection(ReferenceBuilder.build(filePath, selections)),
        )
        return true
    }

    private fun canCopyReference(editor: Editor): Boolean {
        return SmartCopySettings.getInstance().enabled &&
            FileDocumentManager.getInstance().getFile(editor.document)?.path != null &&
            selectedRanges(editor).isNotEmpty()
    }

    private fun selectedRanges(editor: Editor): List<ReferenceSelection> {
        return editor.caretModel.allCarets
            .filter { it.hasSelection() }
            .map { caret ->
                val startPosition = editor.offsetToLogicalPosition(caret.selectionStart)
                val endPosition = editor.offsetToLogicalPosition(caret.selectionEnd)

                ReferenceSelection(
                    startLine = startPosition.line,
                    endLine = endPosition.line,
                    endColumn = endPosition.column,
                )
            }
    }
}
