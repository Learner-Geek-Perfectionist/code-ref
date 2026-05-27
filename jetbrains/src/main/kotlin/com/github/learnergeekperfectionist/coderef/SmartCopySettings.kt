package com.github.learnergeekperfectionist.coderef

import com.intellij.openapi.application.ApplicationManager
import com.intellij.openapi.components.PersistentStateComponent
import com.intellij.openapi.components.Service
import com.intellij.openapi.components.State
import com.intellij.openapi.components.Storage

@Service(Service.Level.APP)
@State(name = "CodeRefSettings", storages = [Storage("codeRef.xml")])
class SmartCopySettings : PersistentStateComponent<SmartCopySettings.State> {
    data class State(var enabled: Boolean = false)

    private var state = State()

    var enabled: Boolean
        get() = state.enabled
        set(value) {
            state.enabled = value
        }

    override fun getState(): State = state

    override fun loadState(state: State) {
        this.state = state
    }

    fun toggle(): Boolean {
        enabled = !enabled
        return enabled
    }

    companion object {
        fun getInstance(): SmartCopySettings =
            ApplicationManager.getApplication().getService(SmartCopySettings::class.java)
    }
}
