# PR2: Workbench Shell

## Scope

- Adds a shell composition layer that mounts/unmounts UI shell state.
- Adds bootstrap function that composes shell + plugin foundation runtime.
- Adds a focused shell bootstrap test.

## Architecture invariants preserved

- Shell depends on plugin foundation, but plugin foundation has no shell dependency.
- No edits to `app.js` or `index.html`.
- Plugin contracts and activation flow remain unchanged from PR1.