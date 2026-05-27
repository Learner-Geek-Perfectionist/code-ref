package com.github.learnergeekperfectionist.coderef

import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent

class ToggleSmartCopyAction : AnAction("Toggle Code Ref Smart Copy") {
    override fun actionPerformed(event: AnActionEvent) {
        SmartCopySettings.getInstance().toggle()
        StatusBarUpdater.updateAll()
    }
}
