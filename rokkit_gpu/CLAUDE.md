# @rokkit/gpu

Thin TypeScript wrappers around the raw WebGPU API. Lowest layer in the stack.

No scene concepts live here. No meshes, no materials, no cameras, no lights. Only GPU primitives.

---

## Owns
- Device and adapter initialization
- Buffer creation, upload, lifecycle
- Texture and sampler creation
- Render and compute pipeline creation
- Bind group and bind group layout management
- Command encoder and render pass abstractions

## Does Not Own
- Meshes, materials, scenes, cameras → `@rokkit/render`
- Asset loading or parsing → `@rokkit/loader`
- Game loop or entity management → `@rokkit/engine`

---

## Conventions

### Wrapper Naming
Raw WebGPU types and Rokkit wrappers must be clearly distinguishable. Prefix all wrapper types
with `Rokkit`:

```ts
// Raw — never held directly by callers
GPUBuffer, GPUTexture, GPURenderPipeline

// Rokkit wrappers — what callers hold
RokkitBuffer, RokkitTexture, RokkitPipeline
```

### Lifecycle
GPU resources must be explicitly destroyed. Document ownership on any function that creates one:

```ts
/**
 * ...
 * @remarks Caller owns the returned buffer and must call `.destroy()` when done.
 */
```

---

## Dependencies
None.