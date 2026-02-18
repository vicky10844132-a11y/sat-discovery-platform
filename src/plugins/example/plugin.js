export const examplePlugin = {
  id: 'example.plugin',
  activate(context) {
    context.emit('example:ready', { id: this.id });

    return {
      name: 'Example Plugin',
      dispose() {},
    };
  },
};