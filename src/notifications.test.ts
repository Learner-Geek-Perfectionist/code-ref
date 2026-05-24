import { strict as assert } from 'node:assert';
import { test } from 'node:test';

import { getNotificationTitle } from './notifications';

test('getNotificationTitle returns link-style code reference messages', () => {
  assert.equal(getNotificationTitle('clipboardOnly'), '🔗 Code reference copied');
  assert.equal(getNotificationTitle('kittySuccess'), '🔗 Code reference copied · Sent to Kitty');
  assert.equal(getNotificationTitle('kittyUnavailable'), '🔗 Code reference copied · Kitty unavailable');
});
