# JetBrains Plugin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an independently built JetBrains / Android Studio Code Ref plugin under `jetbrains/` and release it with the existing VS Code extension.

**Architecture:** The root project remains the VS Code extension. The `jetbrains/` directory is a separate Gradle Kotlin plugin project with pure reference-formatting code, application-level Smart Copy settings, a status bar widget, and copy/toggle actions registered through IntelliJ Platform extension points.

**Tech Stack:** Kotlin, Gradle Wrapper, IntelliJ Platform Gradle Plugin 2.x, IntelliJ Platform SDK, Node/npm for the existing VS Code extension.

---

### Task 1: Scaffold JetBrains Project

**Files:**
- Create: `jetbrains/settings.gradle.kts`
- Create: `jetbrains/build.gradle.kts`
- Create: `jetbrains/gradle.properties`
- Create: `jetbrains/src/main/resources/META-INF/plugin.xml`
- Create: `jetbrains/src/main/resources/messages/CodeRefBundle.properties`

- [ ] **Step 1: Create Gradle project files**

Create a standalone Gradle Kotlin project in `jetbrains/` using IntelliJ Platform Gradle Plugin 2.x. Configure repositories with `intellijPlatform { defaultRepositories() }`. Target the locally observed Android Studio 2025.3 platform first.

- [ ] **Step 2: Create plugin descriptor**

Register plugin ID `com.github.learnergeekperfectionist.coderef.jetbrains`, name `Code Ref`, version matching the repository release, dependency `com.intellij.modules.platform`, and the initial extension/action registrations used by later tasks.

- [ ] **Step 3: Add Gradle Wrapper**

Run from `jetbrains/`:

```bash
gradle wrapper --gradle-version 9.0.0
```

If global `gradle` is unavailable, generate the wrapper through an installed Gradle distribution or download path, then run:

```bash
./gradlew --version
```

Expected: Gradle 9.x starts successfully.

### Task 2: Pure Reference Formatting

**Files:**
- Create: `jetbrains/src/main/kotlin/com/github/learnergeekperfectionist/coderef/ReferenceBuilder.kt`
- Create: `jetbrains/src/test/kotlin/com/github/learnergeekperfectionist/coderef/ReferenceBuilderTest.kt`

- [ ] **Step 1: Write failing formatter tests**

Cover single-line, multi-line, column-zero ending, and multiple selections with 1-based line output matching the VS Code extension.

- [ ] **Step 2: Run formatter test**

Run:

```bash
cd jetbrains
./gradlew test --tests '*ReferenceBuilderTest'
```

Expected: FAIL because `ReferenceBuilder` does not exist yet.

- [ ] **Step 3: Implement formatter**

Add small Kotlin data types for selection ranges and a formatter that returns trimmed references joined by spaces.

- [ ] **Step 4: Run formatter test**

Run:

```bash
cd jetbrains
./gradlew test --tests '*ReferenceBuilderTest'
```

Expected: PASS.

### Task 3: Smart Copy Settings

**Files:**
- Create: `jetbrains/src/main/kotlin/com/github/learnergeekperfectionist/coderef/SmartCopySettings.kt`
- Create: `jetbrains/src/test/kotlin/com/github/learnergeekperfectionist/coderef/SmartCopySettingsTest.kt`
- Modify: `jetbrains/src/main/resources/META-INF/plugin.xml`

- [ ] **Step 1: Write failing settings tests**

Test default disabled state and toggling behavior.

- [ ] **Step 2: Implement application service**

Implement `PersistentStateComponent` service with an `enabled` boolean defaulting to false.

- [ ] **Step 3: Register service**

Add an `applicationService` entry to `plugin.xml`.

- [ ] **Step 4: Run tests**

Run:

```bash
cd jetbrains
./gradlew test
```

Expected: PASS.

### Task 4: Copy And Toggle Actions

**Files:**
- Create: `jetbrains/src/main/kotlin/com/github/learnergeekperfectionist/coderef/CopyReferenceAction.kt`
- Create: `jetbrains/src/main/kotlin/com/github/learnergeekperfectionist/coderef/ToggleSmartCopyAction.kt`
- Modify: `jetbrains/src/main/resources/META-INF/plugin.xml`

- [ ] **Step 1: Implement toggle action**

The toggle action flips `SmartCopySettings.enabled` and refreshes status bars.

- [ ] **Step 2: Implement copy reference action**

Read the active `Editor`, `VirtualFile`, and selection model. If Smart Copy is disabled, no project/editor exists, no selected ranges exist, or the file path is unavailable, delegate to the IDE's normal copy action. Otherwise, build references and write them to the system clipboard.

- [ ] **Step 3: Register actions and shortcuts**

Register the copy action with platform copy shortcuts. Register the toggle action as a named action for users who want to bind their own shortcut.

- [ ] **Step 4: Verify compile**

Run:

```bash
cd jetbrains
./gradlew test
```

Expected: PASS.

### Task 5: Status Bar Widget

**Files:**
- Create: `jetbrains/src/main/kotlin/com/github/learnergeekperfectionist/coderef/CodeRefStatusBarWidgetFactory.kt`
- Create: `jetbrains/src/main/kotlin/com/github/learnergeekperfectionist/coderef/CodeRefStatusBarWidget.kt`
- Modify: `jetbrains/src/main/resources/META-INF/plugin.xml`

- [ ] **Step 1: Implement widget factory**

Register `com.intellij.statusBarWidgetFactory` with ID `CodeRefStatusBarWidget`.

- [ ] **Step 2: Implement widget**

Display `Code Ref ON` or `Code Ref OFF`. On click, toggle `SmartCopySettings.enabled` and update the widget.

- [ ] **Step 3: Verify build**

Run:

```bash
cd jetbrains
./gradlew buildPlugin
```

Expected: plugin ZIP appears in `jetbrains/build/distributions/`.

### Task 6: Docs, Packaging, And Release

**Files:**
- Modify: `README.md`
- Modify: `.gitignore`
- Modify: `.vscodeignore`
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: Update docs**

Document that the repository now ships VS Code and JetBrains builds, including Android Studio installation from the plugin ZIP.

- [ ] **Step 2: Bump version**

Run:

```bash
npm version 1.1.0 --no-git-tag-version
```

Update JetBrains plugin version to `1.1.0`.

- [ ] **Step 3: Run full verification**

Run:

```bash
npm test
cd jetbrains && ./gradlew test buildPlugin
npm run package
```

Expected: all commands exit 0.

- [ ] **Step 4: Install locally**

Install the VS Code `.vsix` with `code --install-extension --force`. Install the JetBrains plugin ZIP into Android Studio manually or with the IDE plugin install command if available.

- [ ] **Step 5: Commit, tag, push, and release**

Commit all changes, create an annotated tag, push `main` and the tag, and create a GitHub Release containing both generated artifacts.
