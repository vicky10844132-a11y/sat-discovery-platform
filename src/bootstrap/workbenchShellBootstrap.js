import { createPluginFoundation } from './pluginFoundation.js';
import { WorkbenchShell } from '../workbench/shell/workbenchShell.js';

export function bootstrapWorkbenchShell({
  rootElement,
  plugins = [],
  services = {},
}) {
  const foundation = createPluginFoundation({
    plugins,
    services,
  });

  const shell = new WorkbenchShell({
    rootElement,
    eventBus: foundation.eventBus,
  });

  shell.mount();
  foundation.manager.activateAll();

  return {
    shell,
    foundation,
    dispose() {
      shell.unmount();
    },
  };
}