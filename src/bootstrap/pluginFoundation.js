import { EventBus } from '../core/events/eventBus.js';
import { PluginRegistry } from '../core/plugins/pluginRegistry.js';
import { PluginManager } from '../core/plugins/pluginManager.js';

export function createPluginFoundation({ plugins = [], services = {} } = {}) {
  const eventBus = new EventBus();
  const registry = new PluginRegistry();

  for (const plugin of plugins) {
    registry.register(plugin);
  }

  const manager = new PluginManager({
    registry,
    eventBus,
    services,
  });

  return {
    eventBus,
    registry,
    manager,
  };
}