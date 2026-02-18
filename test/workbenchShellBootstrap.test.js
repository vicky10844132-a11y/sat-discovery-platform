import test from 'node:test';
import assert from 'node:assert/strict';

import { bootstrapWorkbenchShell } from '../src/bootstrap/workbenchShellBootstrap.js';

function createRootElementStub() {
  const root = {
    dataset: {},
    attributes: new Map(),
    children: [],
    innerHTML: '',
    appendChild(child) {
      this.children.push(child);
      return child;
    },
    setAttribute(name, value) {
      this.attributes.set(name, value);
    },
    removeAttribute(name) {
      this.attributes.delete(name);
    },
  };

  return root;
}

function installDocumentStub() {
  const createElement = (tagName) => ({
    tagName,
    textContent: '',
    children: [],
    attributes: new Map(),
    appendChild(child) {
      this.children.push(child);
      return child;
    },
    setAttribute(name, value) {
      this.attributes.set(name, value);
    },
  });

  const previousDocument = globalThis.document;
  globalThis.document = { createElement };

  return () => {
    globalThis.document = previousDocument;
  };
}

test('bootstrapWorkbenchShell mounts shell and activates plugins', () => {
  const restoreDocument = installDocumentStub();
  const rootElement = createRootElementStub();
  const activations = [];

  try {
    const plugin = {
      id: 'shell.test.plugin',
      activate() {
        activations.push(this.id);
      },
    };

    const runtime = bootstrapWorkbenchShell({
      rootElement,
      plugins: [plugin],
    });

    assert.equal(rootElement.dataset.workbench, 'ready');
    assert.deepEqual(activations, ['shell.test.plugin']);

    runtime.dispose();
    assert.equal(rootElement.dataset.workbench, undefined);
  } finally {
    restoreDocument();
  }
});