package com.github.learnergeekperfectionist.coderef

import com.intellij.openapi.wm.StatusBar
import com.intellij.openapi.wm.StatusBarWidget
import com.intellij.util.Consumer
import java.awt.event.MouseEvent

class CodeRefStatusBarWidget : StatusBarWidget, StatusBarWidget.TextPresentation {
    private var statusBar: StatusBar? = null

    override fun ID(): String = CodeRefStatusBarWidgetFactory.ID

    override fun install(statusBar: StatusBar) {
        this.statusBar = statusBar
    }

    override fun getPresentation(): StatusBarWidget.WidgetPresentation = this

    override fun getText(): String {
        return if (SmartCopySettings.getInstance().enabled) {
            "Code Ref ON"
        } else {
            "Code Ref OFF"
        }
    }

    override fun getTooltipText(): String {
        return if (SmartCopySettings.getInstance().enabled) {
            "Smart Copy is enabled. Selected editor text copies as a code reference."
        } else {
            "Smart Copy is disabled. Click to enable code-reference copying."
        }
    }

    override fun getAlignment(): Float = 0.5f

    override fun getClickConsumer(): Consumer<MouseEvent> {
        return Consumer {
            SmartCopySettings.getInstance().toggle()
            statusBar?.updateWidget(ID())
            StatusBarUpdater.updateAll()
        }
    }

    override fun dispose() {
        statusBar = null
    }
}
