export class PluginRegistry {
  constructor() {
    this.plugins = new Map();
  }

  register(definition) {
    if (!definition || !definition.id) {
      throw new Error('Plugin definition must include a non-empty id.');
    }

    if (this.plugins.has(definition.id)) {
      throw new Error(`Plugin with id "${definition.id}" is already registered.`);
    }

    if (typeof definition.activate !== 'function') {
      throw new Error(`Plugin "${definition.id}" must define an activate(context) function.`);
    }

    this.plugins.set(definition.id, definition);
  }

  list() {
    return [...this.plugins.values()];
  }
}