export interface ReferenceSelection {
  isEmpty: boolean;
  activeLine: number;
  startLine: number;
  endLine: number;
  endCharacter: number;
}

export interface ReferenceEditor {
  documentPath: string;
  selections: ReferenceSelection[];
}

export interface SendResult {
  success: boolean;
  tabPosition?: number;
  tabTitle?: string;
  error?: string;
}

type MaybePromise<T> = T | PromiseLike<T>;

export interface ReferenceSenderDependencies {
  getEditor: () => ReferenceEditor | undefined;
  writeClipboard: (text: string) => MaybePromise<void>;
  shouldSendToKitty?: () => boolean;
  sendToKitty: (text: string) => MaybePromise<SendResult>;
  onNoEditor: () => MaybePromise<void>;
  onClipboardFailure: (error: unknown) => MaybePromise<void>;
  onKittyFailure: (error: string) => MaybePromise<void>;
  onSuccess: (result: SendResult) => MaybePromise<void>;
  onClipboardOnlySuccess?: () => MaybePromise<void>;
  focusKitty: () => MaybePromise<void>;
}

export function buildReference(editor: ReferenceEditor): string {
  const refs: string[] = [];

  for (const sel of editor.selections) {
    if (sel.isEmpty) {
      refs.push(`@${editor.documentPath}#${sel.activeLine + 1}`);
    } else {
      let endLine = sel.endLine + 1;
      if (sel.endCharacter === 0 && sel.endLine > sel.startLine) {
        endLine = sel.endLine;
      }
      refs.push(`@${editor.documentPath}#${sel.startLine + 1}-${endLine}`);
    }
  }

  return refs.join(' ') + ' ';
}

export function createReferenceSender(
  deps: ReferenceSenderDependencies,
): () => Promise<void> {
  return async () => {
    const editor = deps.getEditor();
    if (!editor) {
      await deps.onNoEditor();
      return;
    }

    const refText = buildReference(editor);

    try {
      await deps.writeClipboard(refText.trimEnd());
    } catch (error: unknown) {
      await deps.onClipboardFailure(error);
      return;
    }

    if (deps.shouldSendToKitty?.() === false) {
      await deps.onClipboardOnlySuccess?.();
      return;
    }

    const result = await deps.sendToKitty(refText);
    if (!result.success) {
      await deps.onKittyFailure(result.error ?? 'Unknown error sending to Kitty');
      return;
    }

    await deps.onSuccess(result);
    await deps.focusKitty();
  };
}
