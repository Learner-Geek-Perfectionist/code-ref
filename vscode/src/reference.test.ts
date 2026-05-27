import { strict as assert } from 'node:assert';
import { test } from 'node:test';

import {
  buildReference,
  createClipboardReferenceCopier,
  type ReferenceEditor,
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

test('buildReference creates line-only references for single-line selections', () => {
  const ref = buildReference(editor('/tmp/project/src/app.ts', [
    {
      isEmpty: false,
      activeLine: 4,
      startLine: 4,
      endLine: 4,
      endCharacter: 9,
    },
  ]));

  assert.equal(ref, '@/tmp/project/src/app.ts#5 ');
});

test('copyReference copies the built reference to clipboard only', async () => {
  const events: string[] = [];
  const copyReference = createClipboardReferenceCopier({
    getEditor: () => editor('/tmp/project/src/app.ts', [
      {
        isEmpty: false,
        activeLine: 9,
        startLine: 9,
        endLine: 12,
        endCharacter: 0,
      },
    ]),
    writeClipboard: async (text: string) => {
      events.push(`clipboard:${text}`);
    },
    onNoEditor: () => {
      events.push('no-editor');
    },
    onClipboardFailure: () => {
      events.push('clipboard-failed');
    },
    onSuccess: () => {
      events.push('success');
    },
  });

  await copyReference();

  assert.deepEqual(events, [
    'clipboard:@/tmp/project/src/app.ts#10-12',
    'success',
  ]);
});
