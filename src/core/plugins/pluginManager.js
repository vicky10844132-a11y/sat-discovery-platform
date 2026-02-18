import { PluginContext } from './pluginContext.js';

export class PluginManager {
  constructor({ registry, eventBus, services = {} }) {
    this.registry = registry;
    this.eventBus = eventBus;
    this.services = services;
    this.activations = new Map();
  }

  activateAll() {
    for (const plugin of this.registry.list()) {
      this.activate(plugin.id);
    }
  }

  activate(pluginId) {
    if (this.activations.has(pluginId)) {
      return this.activations.get(pluginId);
    }

    const plugin = this.registry.list().find((item) => item.id === pluginId);
    if (!plugin) {
      throw new Error(`Plugin "${pluginId}" was not found.`);
    }

    const context = new PluginContext({
      eventBus: this.eventBus,
      services: this.services,
    });

    const activation = plugin.activate(context) ?? {};
    this.activations.set(pluginId, activation);
    this.eventBus.emit('plugin:activated', { pluginId });

    return activation;
  }
}