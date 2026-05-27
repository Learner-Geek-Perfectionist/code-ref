package com.github.learnergeekperfectionist.coderef

import com.intellij.openapi.project.Project
import com.intellij.openapi.wm.StatusBarWidget
import com.intellij.openapi.wm.StatusBarWidgetFactory

class CodeRefStatusBarWidgetFactory : StatusBarWidgetFactory {
    override fun getId(): String = ID

    override fun getDisplayName(): String = "Code Ref"

    override fun isAvailable(project: Project): Boolean = true

    override fun createWidget(project: Project): StatusBarWidget = CodeRefStatusBarWidget()

    override fun disposeWidget(widget: StatusBarWidget) {
        widget.dispose()
    }

    override fun isEnabledByDefault(): Boolean = true

    companion object {
        const val ID = "CodeRefStatusBarWidget"
    }
}
