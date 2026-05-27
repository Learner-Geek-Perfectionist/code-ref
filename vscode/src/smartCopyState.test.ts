import { strict as assert } from 'node:assert';
import { test } from 'node:test';

import {
  createSmartCopyStateController,
  SMART_COPY_CONTEXT_KEY,
} from './smartCopyState';

test('smart copy state syncs context and status from configuration', async () => {
  const events: string[] = [];
  const controller = createSmartCopyStateController({
    getEnabled: () => true,
    updateEnabled: async enabled => {
      events.push(`update:${enabled}`);
    },
    setContext: async (key, enabled) => {
      events.push(`context:${key}:${enabled}`);
    },
    updateStatus: enabled => {
      events.push(`status:${enabled}`);
    },
  });

  const enabled = await controller.syncFromConfiguration();

  assert.equal(enabled, true);
  assert.deepEqual(events, [
    `context:${SMART_COPY_CONTEXT_KEY}:true`,
    'status:true',
  ]);
});

test('smart copy state toggle writes the opposite configuration value globally', async () => {
  const events: string[] = [];
  let configured = false;
  const controller = createSmartCopyStateController({
    getEnabled: () => configured,
    updateEnabled: async enabled => {
      configured = enabled;
      events.push(`update:${enabled}`);
    },
    setContext: async (key, enabled) => {
      events.push(`context:${key}:${enabled}`);
    },
    updateStatus: enabled => {
      events.push(`status:${enabled}`);
    },
  });

  const enabled = await controller.toggle();

  assert.equal(enabled, true);
  assert.deepEqual(events, [
    'update:true',
    `context:${SMART_COPY_CONTEXT_KEY}:true`,
    'status:true',
  ]);
});
