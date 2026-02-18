# PR1: Plugin Foundation

## Scope

- Introduces plugin runtime primitives (registry, manager, context, event bus).
- Adds plugin foundation bootstrap creation utility.
- Adds a minimal example plugin and focused unit test.

## Architecture invariants preserved

- Plugin runtime is independent from workbench shell/UI composition.
- No edits to `app.js` or `index.html`.
- Workbench-level rendering responsibilities are deferred to PR2.