# @rokkit/engine

The whole runtime. Owns everything from raw WebGPU wrappers up through scene rendering, asset
loading, and the game loop. The single package a game or app imports and boots.

This is intentionally a single package while the engine is small. If/when areas grow large or
stable enough to benefit from isolation, they can be split out into dedicated packages
(`@rokkit/gpu`, `@rokkit/render`, `@rokkit/loader`).

---

## Owns

### GPU layer
- Device and adapter initialization
- Buffer creation, upload, lifecycle
- Texture and sampler creation
- Render and compute pipeline creation
- Bind group and bind group layout management
- Command encoder and render pass abstractions

### Render layer
- Mesh and geometry representation
- Material system (PBR)
- Light types: directional, point, spot
- Camera: view/projection, frustum
- Scene graph: node hierarchy, local/world transforms
- Render graph: frame execution, pass management
- Shader management: loading, compiling, caching WGSL

### Loader layer
- GLB binary parsing (header, JSON chunk, binary chunk)
- glTF scene hierarchy extraction
- Mesh and primitive data extraction (positions, normals, UVs, tangents, indices)
- Material descriptor extraction
- Texture image decoding and raw pixel data
- Animation and skin data (future)

### Engine layer
- Application bootstrap and canvas setup
- Game loop: fixed-timestep update, variable render tick
- Scene loading, unloading, transitions
- Input: keyboard, mouse, gamepad
- Camera controllers

## Does Not Own
- Asset optimization or build-time conversion → `@rokkit/tools`
- Blender authoring → `@rokkit/blender`

---

## Internal Structure

Even though it's one package, keep the layers cleanly separated in `src/` so a future split is
mechanical:

```
src/
  gpu/        Raw WebGPU wrappers. No scene concepts.
  render/    Scene, mesh, material, camera, render graph. Depends on gpu/.
  loader/    GLB/glTF parsing. Plain data out. No GPU types.
  bridge/    Converts loader output → render scene objects. The only place that knows both.
  engine/    Game loop, input, bootstrap. Top-level wiring.
  index.ts   Public API surface.
```

Dependency direction is strictly downward: `engine → bridge → render → gpu`, and `engine → loader`.
`loader/` must never import from `gpu/` or `render/`. `render/` must never import from `loader/`.

---

## Conventions

### GPU Wrapper Naming
Raw WebGPU types and Rokkit wrappers must be clearly distinguishable. Prefix wrapper types with
`Rokkit`:

```ts
// Raw — never held directly by callers outside gpu/
GPUBuffer, GPUTexture, GPURenderPipeline

// Rokkit wrappers — what callers hold
RokkitBuffer, RokkitTexture, RokkitPipeline
```

### GPU Resource Lifecycle
GPU resources must be explicitly destroyed. Document ownership on any function that creates one:

```ts
/**
 * ...
 * @remarks Caller owns the returned buffer and must call `.destroy()` when done.
 */
```

### Loader Output Types
All loader output types are plain data structs — no classes, no methods. Defined in
`src/loader/types.ts`. Treat changes to these types as breaking changes for the bridge layer.

```ts
interface LoadedScene { ... }
interface LoadedMesh { ... }
interface LoadedPrimitive {
  positions: Float32Array;
  normals: Float32Array | null;
  uvs: Float32Array | null;
  tangents: Float32Array | null;
  indices: Uint16Array | Uint32Array | null;
  materialIndex: number | null;
}
interface LoadedTexture {
  width: number;
  height: number;
  data: Uint8Array; // raw RGBA pixels
  mimeType: string;
}
```

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

### Shaders
Each `.wgsl` file starts with a stage/IO header:

```wgsl
// Stage: vertex + fragment
// Inputs: position (vec3f), normal (vec3f), uv (vec2f), tangent (vec4f)
// Outputs: color attachment (rgba8unorm)
// Uniforms: CameraUniforms (group 0), MaterialUniforms (group 1), LightUniforms (group 2)
```

Shaders live in `src/render/shaders/` and are imported as strings at build time. No runtime
`fetch` for shaders.

### Texture Channel Packing
PBR maps are packed into a single RGBA texture — the shader expects this layout:
```
R → Ambient Occlusion
G → Roughness
B → Metallic
A → (reserved)
```

---

## Dependencies
None at runtime. Self-contained.
