# Code Ref VS Code 插件

Code Ref 可以把 VS Code 编辑器里选中的代码复制成绝对路径代码引用，例如：

```text
@/path/to/file.ts#10-15
```

开启 Smart Copy 后，可以直接用系统复制快捷键生成引用。

## 使用方式

1. 点击状态栏的 `Code Ref OFF`，开启 Smart Copy。
2. 在 VS Code 编辑器中选中代码。
3. 按系统复制快捷键：
   - macOS: `Cmd+C`
   - Windows / Linux: `Ctrl+C`
4. 在目标位置正常粘贴。

Smart Copy 只在 VS Code 编辑器有选区时覆盖复制行为。开关关闭、没有选中文本、或焦点不在 VS Code 编辑器中时，默认复制行为不受影响。

## 构建

```bash
npm install
npm test
npm run package
```

打包产物会生成在当前目录：

```text
code-ref-<version>.vsix
```

## 安装

```bash
code --install-extension code-ref-<version>.vsix --force
```
