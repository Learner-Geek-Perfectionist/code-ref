# JetBrains Plugin Design

## Goal

Add an Android Studio / JetBrains version of Code Ref in the existing repository, without changing the VS Code extension layout.

The JetBrains plugin must let users copy selected editor text as an absolute-path code reference using the platform copy shortcut when Smart Copy is enabled.

## Repository Layout

Create an independent plugin project under:

```text
jetbrains/
```

The root VS Code extension remains unchanged as the VS Code package. The JetBrains project owns its own Gradle wrapper, build files, Kotlin sources, resources, plugin descriptor, and tests.

## Target Platform

Initial target:

- Android Studio 2025.3
- Local build number observed on the development machine: `AI-253.32098.37.2534.15336583`

The plugin uses general IntelliJ Platform APIs where possible, not Android-specific APIs, so it can also work in other JetBrains IDEs when compatible.

## User Experience

- Show a status bar widget with `Code Ref ON` or `Code Ref OFF`.
- Clicking the widget toggles Smart Copy.
- Store Smart Copy as an application-level setting so all projects/windows in the IDE share the same value.
- When Smart Copy is enabled and the active editor has one or more selected ranges:
  - macOS: `Cmd+C` copies code references.
  - Windows/Linux: `Ctrl+C` copies code references.
- When Smart Copy is disabled, there is no selected editor text, or the active file has no local filesystem path, the normal IDE copy behavior must remain available.

## Reference Format

Use the same format as the VS Code extension:

- Single-line selection: `@/absolute/path/file.kt#10`
- Multi-line selection: `@/absolute/path/file.kt#10-20`
- Multiple selections: join references with a single space.

Line numbers are 1-based. If a selection ends at column 0 of the next line, the range ends at the previous line, matching the VS Code behavior.

## Architecture

Use Kotlin and the IntelliJ Platform Gradle Plugin in `jetbrains/`.

Components:

- `ReferenceBuilder`: pure Kotlin formatter for file path and selected ranges.
- `SmartCopySettings`: application-level persistent setting for the enabled flag.
- `CopyReferenceAction`: copy action registered with the copy shortcut. It handles the event only when Smart Copy can produce a reference; otherwise it allows the IDE's normal copy action to remain usable.
- `CodeRefStatusBarWidgetFactory` and widget implementation: visible ON/OFF indicator and toggle entry point.

## Packaging And Release

The release process produces two artifacts:

- VS Code extension: `code-ref-<version>.vsix`
- JetBrains plugin: `code-ref-jetbrains-<version>.zip`

Both artifacts are uploaded to the same GitHub Release tag.

## Testing

Automated tests cover:

- Reference formatting for single-line, multi-line, column-zero ending, and multiple selections.
- Smart Copy setting toggle behavior.

Build verification includes:

- Existing root `npm test`.
- JetBrains Gradle tests.
- JetBrains plugin ZIP build.

Manual verification before public release:

- Install the JetBrains plugin ZIP into Android Studio.
- Toggle status bar ON/OFF.
- Confirm `Cmd+C` / `Ctrl+C` copies references only when Smart Copy is ON and text is selected.
- Confirm normal copy still works when Smart Copy is OFF or no editor text is selected.
