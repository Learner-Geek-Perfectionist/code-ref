package com.github.learnergeekperfectionist.coderef

import com.intellij.openapi.project.ProjectManager
import com.intellij.openapi.wm.WindowManager

object StatusBarUpdater {
    fun updateAll() {
        val windowManager = WindowManager.getInstance()

        ProjectManager.getInstance().openProjects.forEach { project ->
            windowManager.getStatusBar(project)?.updateWidget(CodeRefStatusBarWidgetFactory.ID)
        }
    }
}
