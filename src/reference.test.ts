import { strict as assert } from 'node:assert';
import { test } from 'node:test';

import {
  buildReference,
  createReferenceSender,
  type ReferenceEditor,
  type SendResult,
} from './reference';

function editor(documentPath: string, selections: ReferenceEditor['selections']): ReferenceEditor {
  return { documentPath, selections };
}

test('buildReference creates absolute file references for cursors and ranges', () => {
  const ref = buildReference(editor('/tmp/project/src/app.ts', [
    {
      isEmpty: true,
      activeLine: 4,
      startLine: 4,
      endLine: 4,
      endCharacter: 9,
    },
    {
      isEmpty: false,
      activeLine: 9,
      startLine: 9,
      endLine: 12,
      endCharacter: 5,
    },
  ]));

  assert.equal(ref, '@/tmp/project/src/app.ts#5 @/tmp/project/src/app.ts#10-13 ');
});

test('sendReference copies to clipboard before sending to Kitty when Kitty fails', async () => {
  const events: string[] = [];
  const sendReference = createReferenceSender({
    getEditor: () => editor('/tmp/project/src/app.ts', [
      {
        isEmpty: true,
        activeLine: 4,
        startLine: 4,
        endLine: 4,
        endCharacter: 9,
      },
    ]),
    writeClipboard: async (text: string) => {
      events.push(`clipboard:${text}`);
    },
    sendToKitty: async (text: string) => {
      events.push(`kitty:${text}`);
      return { success: false, error: 'Kitty socket not found' };
    },
    onNoEditor: () => {
      events.push('no-editor');
    },
    onClipboardFailure: () => {
      events.push('clipboard-failed');
    },
    onKittyFailure: (error: string) => {
      events.push(`kitty-failed:${error}`);
    },
    onSuccess: (_result: SendResult) => {
      events.push('success');
    },
    focusKitty: () => {
      events.push('focus-kitty');
    },
  });

  await sendReference();

  assert.deepEqual(events, [
    'clipboard:@/tmp/project/src/app.ts#5',
    'kitty:@/tmp/project/src/app.ts#5 ',
    'kitty-failed:Kitty socket not found',
  ]);
});

test('sendReference only copies to clipboard when Kitty sending is disabled', async () => {
  const events: string[] = [];
  const sendReference = createReferenceSender({
    getEditor: () => editor('/tmp/project/src/app.ts', [
      {
        isEmpty: true,
        activeLine: 4,
        startLine: 4,
        endLine: 4,
        endCharacter: 9,
      },
    ]),
    writeClipboard: async (text: string) => {
      events.push(`clipboard:${text}`);
    },
    shouldSendToKitty: () => false,
    sendToKitty: async (text: string) => {
      events.push(`kitty:${text}`);
      return { success: false, error: 'Kitty should not be called' };
    },
    onNoEditor: () => {
      events.push('no-editor');
    },
    onClipboardFailure: () => {
      events.push('clipboard-failed');
    },
    onKittyFailure: (error: string) => {
      events.push(`kitty-failed:${error}`);
    },
    onSuccess: (_result: SendResult) => {
      events.push('success');
    },
    onClipboardOnlySuccess: () => {
      events.push('clipboard-only-success');
    },
    focusKitty: () => {
      events.push('focus-kitty');
    },
  });

  await sendReference();

  assert.deepEqual(events, [
    'clipboard:@/tmp/project/src/app.ts#5',
    'clipboard-only-success',
  ]);
});
