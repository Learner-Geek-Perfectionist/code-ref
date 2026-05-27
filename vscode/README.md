# Code Ref for VS Code

Copy selected VS Code text as absolute-path code references with an opt-in Smart Copy shortcut.

## Usage

1. Click `Code Ref OFF` in the status bar to enable Smart Copy.
2. Select text in a VS Code editor.
3. Press the platform copy shortcut:
   - macOS: `Cmd+C`
   - Windows / Linux: `Ctrl+C`
4. Paste normally in the target app.

Smart Copy only overrides copy when a VS Code editor has a text selection. When the switch is off, no editor text is selected, or focus is outside VS Code, the default copy behavior remains unchanged.

## Build

```bash
npm install
npm test
npm run package
```

The package command creates `code-ref-<version>.vsix` in this directory.
