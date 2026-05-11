# @rokkit/render

Scene rendering built on `@rokkit/gpu`. Owns all concepts related to describing and drawing
a scene. Does not know how assets got here — it receives plain data and renders it.

---

## Owns
- Mesh and geometry representation
- Material system (PBR)
- Light types: directional, point, spot
- Camera: view/projection, frustum
- Scene graph: node hierarchy, local/world transforms
- Render graph: frame execution, pass management
- Shader management: loading, compiling, caching WGSL

## Does Not Own
- Raw WebGPU resource creation → `@rokkit/gpu`
- GLB/glTF parsing or any file I/O → `@rokkit/loader`
- Game loop, input, entity logic → `@rokkit/engine`

This package never reads files. It never imports from `@rokkit/loader`.

---

## Conventions

### Shaders
Each `.wgsl` file starts with a stage/IO header:

```wgsl
// Stage: vertex + fragment
// Inputs: position (vec3f), normal (vec3f), uv (vec2f), tangent (vec4f)
// Outputs: color attachment (rgba8unorm)
// Uniforms: CameraUniforms (group 0), MaterialUniforms (group 1), LightUniforms (group 2)
```

Shaders live in `shaders/` and are imported as strings at build time. No runtime `fetch` for shaders.

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
- `@rokkit/gpu`