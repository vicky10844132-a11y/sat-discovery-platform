export class WorkbenchShell {
  constructor({ rootElement, eventBus }) {
    if (!rootElement) {
      throw new Error('WorkbenchShell requires a rootElement.');
    }

    this.rootElement = rootElement;
    this.eventBus = eventBus;
    this.disposables = [];
  }

  mount() {
    this.rootElement.dataset.workbench = 'ready';
    this.rootElement.innerHTML = '';

    const container = document.createElement('section');
    container.setAttribute('aria-label', 'Workbench Shell');

    const title = document.createElement('h1');
    title.textContent = 'SAT Discovery Workbench';
    container.appendChild(title);

    const status = document.createElement('p');
    status.textContent = 'Shell initialized';
    container.appendChild(status);

    this.rootElement.appendChild(container);

    if (this.eventBus) {
      const unsubscribe = this.eventBus.on('plugin:activated', ({ pluginId }) => {
        status.textContent = `Plugin activated: ${pluginId}`;
      });

      this.disposables.push(unsubscribe);
    }
  }

  unmount() {
    for (const dispose of this.disposables.splice(0)) {
      dispose();
    }

    this.rootElement.removeAttribute('data-workbench');
    this.rootElement.innerHTML = '';
  }
}