import * as vscode from 'vscode';
import { readdir } from 'fs/promises';
import { execFile as execFileCb } from 'child_process';
import { promisify } from 'util';
import {
  createReferenceSender,
  type ReferenceEditor,
  type SendResult,
} from './reference';
import { getNotificationTitle } from './notifications';

const execFileAsync = promisify(execFileCb);

let statusBarItem: vscode.StatusBarItem;

// ── Kitty socket discovery ──────────────────────────────────

async function findKittySocket(): Promise<string | undefined> {
  try {
    const files = await readdir('/tmp');
    const socket = files.find(f => f.startsWith('kitty-socket'));
    return socket ? `/tmp/${socket}` : undefined;
  } catch {
    return undefined;
  }
}

// ── Kitty tab info ──────────────────────────────────────────

interface TabInfo {
  position: number; // 1-based
  title: string;
}

async function getActiveTabInfo(socketPath: string): Promise<TabInfo | undefined> {
  try {
    const { stdout } = await execFileAsync('kitty', [
      '@', '--to', `unix:${socketPath}`, 'ls',
    ]);
    const osWindows: Array<{
      is_active: boolean;
      tabs: Array<{ is_active: boolean; title: string }>;
    }> = JSON.parse(stdout);

    // Find the active OS window, then the active tab within it
    for (const win of osWindows) {
      if (!win.is_active) { continue; }
      for (let i = 0; i < win.tabs.length; i++) {
        if (win.tabs[i].is_active) {
          return { position: i + 1, title: win.tabs[i].title };
        }
      }
    }
    return undefined;
  } catch {
    return undefined;
  }
}

// ── Send text to Kitty ──────────────────────────────────────

async function sendToKitty(text: string): Promise<SendResult> {
  const socketPath = await findKittySocket();
  if (!socketPath) {
    return {
      success: false,
      error: 'Cannot find Kitty socket in /tmp. Is Kitty running with remote control enabled?',
    };
  }

  try {
    await execFileAsync('kitty', [
      '@', '--to', `unix:${socketPath}`,
      'send-text', '--match', 'recent:0', '--', text,
    ]);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: `Kitty send-text failed: ${msg}` };
  }

  // Get tab info (best-effort)
  const tabInfo = await getActiveTabInfo(socketPath);

  return {
    success: true,
    tabPosition: tabInfo?.position,
    tabTitle: tabInfo?.title,
  };
}

// ── VS Code editor adapter ─────────────────────────────────

function toReferenceEditor(editor: vscode.TextEditor): ReferenceEditor {
  return {
    documentPath: editor.document.uri.fsPath,
    selections: editor.selections.map(sel => ({
      isEmpty: sel.isEmpty,
      activeLine: sel.active.line,
      startLine: sel.start.line,
      endLine: sel.end.line,
      endCharacter: sel.end.character,
    })),
  };
}

// ── Command handler ─────────────────────────────────────────

const sendReference = createReferenceSender({
  getEditor: () => {
    const editor = vscode.window.activeTextEditor;
    return editor ? toReferenceEditor(editor) : undefined;
  },
  writeClipboard: text => vscode.env.clipboard.writeText(text),
  shouldSendToKitty: () => process.platform === 'darwin',
  sendToKitty,
  onNoEditor: () => {
    void vscode.window.showErrorMessage('No active editor. Open a file first.');
  },
  onClipboardFailure: () => {
    void vscode.window.showErrorMessage('Failed to copy code reference to clipboard.');
  },
  onKittyFailure: async error => {
    const actions = error.includes('socket')
      ? ['Open Setup Guide']
      : [];
    const choice = await vscode.window.showWarningMessage(
      getNotificationTitle('kittyUnavailable'),
      ...actions,
    );
    if (choice === 'Open Setup Guide') {
      await vscode.env.openExternal(vscode.Uri.parse(
        'https://sw.kovidgoyal.net/kitty/remote-control/'
      ));
    }
  },
  onSuccess: async result => {
    await vscode.window.withProgress(
      { location: vscode.ProgressLocation.Notification, title: getNotificationTitle('kittySuccess') },
      () => new Promise(resolve => setTimeout(resolve, 3000)),
    );
  },
  onClipboardOnlySuccess: async () => {
    await vscode.window.withProgress(
      { location: vscode.ProgressLocation.Notification, title: getNotificationTitle('clipboardOnly') },
      () => new Promise(resolve => setTimeout(resolve, 1500)),
    );
  },
  focusKitty: () => {
    execFileAsync('open', ['-a', 'kitty']).catch(() => {});
  },
});

// ── Status bar: Kitty connection indicator ──────────────────

async function updateKittyStatus(): Promise<void> {
  if (process.platform !== 'darwin') {
    statusBarItem.text = '$(clippy) Code Ref';
    statusBarItem.tooltip = 'Code references copy to clipboard on this platform.';
    return;
  }

  const socket = await findKittySocket();
  if (socket) {
    statusBarItem.text = '$(terminal) Kitty ✓';
    statusBarItem.tooltip = `Kitty socket: ${socket}`;
  } else {
    statusBarItem.text = '$(warning) Kitty ✗';
    statusBarItem.tooltip = 'Kitty socket not found — is remote control enabled?';
  }
}

// ── Lifecycle ───────────────────────────────────────────────

export function activate(context: vscode.ExtensionContext): void {
  // Status bar
  statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right, 100,
  );
  statusBarItem.show();
  updateKittyStatus();

  // Check Kitty connection every 10 seconds
  const timer = setInterval(updateKittyStatus, 10_000);

  // Register command
  const cmd = vscode.commands.registerCommand(
    'code-ref.sendReference',
    sendReference,
  );

  context.subscriptions.push(cmd, statusBarItem, { dispose: () => clearInterval(timer) });
}

export function deactivate(): void {}
