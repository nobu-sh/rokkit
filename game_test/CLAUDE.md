# game_test

Vite dev project for testing and validating the Rokkit engine. Not a game — a sandbox.
This is the primary place to bootstrap `@rokkit/engine` and verify that the full stack works
end to end: asset loading, scene rendering, input, etc.

Not published. Not imported by any other package.

---

## Owns
- Vite config and dev server setup
- Entry point that boots `@rokkit/engine`
- Test assets (GLB scenes, textures)
- Scratch code for exercising engine features

## Does Not Own
- Any reusable engine or rendering logic — that belongs in the relevant package
- Anything that should be upstreamed into a package should be moved, not left here

---

## Conventions

- Keep `main.ts` minimal — just bootstrap and go
- If something written here feels reusable, move it upstream to the right package
- Test assets live in `public/assets/` and are served statically by Vite

---

## Dependencies
- `@rokkit/engine` (primary)
- Vite