import test from 'node:test';
import assert from 'node:assert/strict';

import { bootstrapWorkbenchShell } from '../src/bootstrap/workbenchShellBootstrap.js';

function createRootElementStub() {
  const attrs = new Map();
  const children = [];

  const toDataAttr = (key) =>
    `data-${String(key).replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())}`;

  const el = {
    children,

    dataset: new Proxy(
      {},
      {
        get(_t, key) {
          return attrs.get(toDataAttr(key));
        },
        set(_t, key, value) {
          attrs.set(toDataAttr(key), String(value));
          return true;
        },
      }
    ),

    setAttribute(name, value) {
      attrs.set(String(name), String(value));
    },
    getAttribute(name) {
      const k = String(name);
      return attrs.has(k) ? attrs.get(k) : null;
    },
    hasAttribute(name) {
      return attrs.has(String(name));
    },
    removeAttribute(name) {
      attrs.delete(String(name));
    },

    appendChild(node) {
      children.push(node);
      return node;
    },
    removeChild(node) {
      const idx = children.indexOf(node);
      if (idx >= 0) children.splice(idx, 1);
      return node;
    },
    querySelector() {
      return null;
    },
  };

  return el;
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
    assert.equal(rootElement.hasAttribute('data-workbench'), false);
  } finally {
    restoreDocument();
  }
});