# @rokkit/engine

Top-level wiring. Owns the game loop, bridges loader output into the render scene, and manages
input. The package a game or app actually imports and boots.

---

## Owns
- Application bootstrap and canvas setup
- Game loop: fixed-timestep update, variable render tick
- Bridging `@rokkit/loader` output → `@rokkit/render` scene graph
- Scene loading, unloading, transitions
- Input: keyboard, mouse, gamepad
- Camera controllers

## Does Not Own
- Raw WebGPU resource creation → `@rokkit/gpu`
- Rendering implementation → `@rokkit/render`
- Asset file parsing → `@rokkit/loader`

The engine coordinates. It does not implement rendering or parsing itself.

---

## Conventions

### The Bridge Layer
`src/bridge/` converts `LoadedScene` (plain loader data) into live render objects. This is the
only place in the codebase that knows about both loader output types and render input types.
If loader output types change, only the bridge needs to update.

### Game Loop
Fixed-timestep update decoupled from render tick:

```
requestAnimationFrame
  → accumulate delta
  → while accumulated >= FIXED_STEP: update(FIXED_STEP)
  → render(interpolation alpha)
```

Default fixed step: `1/60s`.

---

## Dependencies
- `@rokkit/gpu`
- `@rokkit/render`
- `@rokkit/loader`