# Code Ref

一个 VS Code 扩展，按 `Option+K` / `Alt+K` 即可将代码引用（绝对路径 + 行号）复制到剪贴板。macOS 上会继续尝试发送到 [Kitty](https://sw.kovidgoyal.net/kitty/) 终端；Windows 和 Linux 上只复制到剪贴板，不尝试 Kitty。适合配合 Claude Code、Codex CLI 或其他支持文件引用的 AI 编程工具使用。

## 工作原理

1. 在编辑器中将光标放到目标行（或选中多行）
2. 按 `Option+K` / `Alt+K`
3. 扩展立即将引用（如 `@/path/to/file.ts#42`）复制到剪贴板
4. macOS 上继续尝试把同一段引用发送到当前 Kitty 活动标签页
5. Windows 和 Linux 上到剪贴板复制即结束，不弹 Kitty 失败提示
6. Kitty 发送成功时自动聚焦 Kitty 窗口；发送失败时，剪贴板内容仍然可用

多行选区使用范围格式：`@/path/to/file.ts#10-25`

支持多光标 — 每个光标/选区生成一条独立引用。

## 环境要求

- **VS Code** 1.85+
- **Windows / Linux / macOS** 均支持复制到剪贴板
- **macOS + [Kitty 终端](https://sw.kovidgoyal.net/kitty/)** 支持发送到终端，需开启[远程控制](https://sw.kovidgoyal.net/kitty/remote-control/)

### 开启 Kitty 远程控制

在 `kitty.conf` 中添加：

```
allow_remote_control yes
listen_on unix:/tmp/kitty-socket
```

然后重启 Kitty。

## 安装

```bash
# 克隆并构建
git clone <repo-url> code-ref
cd code-ref
npm install
npm run compile
npm run package

# 安装 .vsix 文件
code --install-extension code-ref-1.0.1.vsix
```

## 使用

| 操作 | 快捷键 |
|------|--------|
| 复制代码引用并发送到 Kitty | `Option+K` / `Alt+K` |

状态栏显示 Kitty 连接状态：
- `Kitty ✓` — 已连接
- `Kitty ✗` — 未找到 socket

## 许可证

MIT
