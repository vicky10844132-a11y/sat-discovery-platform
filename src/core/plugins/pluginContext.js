export class PluginContext {
  constructor({ eventBus, services = {} }) {
    this.eventBus = eventBus;
    this.services = services;
  }

  emit(eventName, payload) {
    this.eventBus.emit(eventName, payload);
  }

  on(eventName, handler) {
    return this.eventBus.on(eventName, handler);
  }

  getService(name) {
    return this.services[name];
  }
}