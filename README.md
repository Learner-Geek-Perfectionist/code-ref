# Code Ref

一个 VS Code 扩展，开启 Smart Copy 后，可以直接用系统复制快捷键把选中的代码复制为代码引用（绝对路径 + 行号）。macOS 使用 `Cmd+C`，Windows / Linux 使用 `Ctrl+C`。适合配合 Claude Code、Codex CLI 或其他支持文件引用的 AI 编程工具使用。

## 工作原理

1. 点击状态栏的 `Code Ref OFF`，开启 Smart Copy
2. 在 VS Code 编辑器中选中一段代码
3. 按系统复制快捷键：
   - macOS: `Cmd+C`
   - Windows / Linux: `Ctrl+C`
4. 扩展将引用（如 `@/path/to/file.ts#42-45`）复制到剪贴板
5. 在目标位置正常粘贴：
   - macOS: `Cmd+V`
   - Windows / Linux: `Ctrl+V`

Smart Copy 只在 VS Code 编辑器有选区时覆盖复制行为。未选中文本、开关关闭、或焦点不在 VS Code 时，系统和 VS Code 的默认复制行为不受影响。

Smart Copy 开关保存为全局用户设置 `code-ref.smartCopy.enabled`，多个 VS Code 窗口会使用同一个开关状态。

多行选区使用范围格式：`@/path/to/file.ts#10-25`

支持多个选区 — 每个选区生成一条独立引用。

## 环境要求

- **VS Code** 1.85+
- **Windows / Linux / macOS** 均支持复制到剪贴板

## 安装

```bash
# 克隆并构建
git clone <repo-url> code-ref
cd code-ref
npm install
npm run compile
npm run package

# 安装 .vsix 文件
code --install-extension code-ref-1.0.2.vsix
```

## 使用

| 操作 | 快捷键 |
|------|--------|
| 开关 Smart Copy | 点击状态栏 `Code Ref ON/OFF` |
| macOS 复制代码引用 | `Cmd+C` |
| Windows / Linux 复制代码引用 | `Ctrl+C` |

状态栏显示 Smart Copy 状态：
- `Code Ref ON` — 选中文本后复制快捷键会复制代码引用
- `Code Ref OFF` — 使用 VS Code 默认复制行为

## 许可证

MIT
