package com.github.learnergeekperfectionist.coderef

import com.intellij.openapi.Disposable
import com.intellij.openapi.actionSystem.IdeActions
import com.intellij.openapi.application.ApplicationManager
import com.intellij.openapi.components.Service
import com.intellij.openapi.editor.actionSystem.EditorActionHandler
import com.intellij.openapi.editor.actionSystem.EditorActionManager

@Service(Service.Level.APP)
class CodeRefCopyHandlerInstaller : Disposable {
    private var originalHandler: EditorActionHandler? = null
    private var installed = false

    @Synchronized
    fun install() {
        if (installed) {
            return
        }

        val actionManager = EditorActionManager.getInstance()
        val original = actionManager.getActionHandler(IdeActions.ACTION_EDITOR_COPY)
        originalHandler = original
        actionManager.setActionHandler(
            IdeActions.ACTION_EDITOR_COPY,
            CopyReferenceEditorActionHandler(original),
        )
        installed = true
    }

    @Synchronized
    override fun dispose() {
        val original = originalHandler ?: return
        EditorActionManager.getInstance().setActionHandler(IdeActions.ACTION_EDITOR_COPY, original)
        originalHandler = null
        installed = false
    }

    companion object {
        fun getInstance(): CodeRefCopyHandlerInstaller =
            ApplicationManager.getApplication().getService(CodeRefCopyHandlerInstaller::class.java)
    }
}
