import test from 'node:test';
import assert from 'node:assert/strict';

import { createPluginFoundation } from '../src/bootstrap/pluginFoundation.js';

test('plugin foundation activates registered plugins', () => {
  const seen = [];
  const plugin = {
    id: 'test.plugin',
    activate(context) {
      context.emit('plugin:booted', { id: this.id });
      return { id: this.id };
    },
  };

  const foundation = createPluginFoundation({ plugins: [plugin] });
  foundation.eventBus.on('plugin:booted', (payload) => {
    seen.push(payload.id);
  });

  foundation.manager.activateAll();

  assert.deepEqual(seen, ['test.plugin']);
});