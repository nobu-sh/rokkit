# @rokkit/tools

Node.js-only build-time asset pipeline. Never imported by runtime packages. Runs at build
time to process and optimize assets before they reach the browser.

---

## Owns
- GLB post-processing (`@gltf-transform/core`)
- Texture channel packing, mip generation
- KTX2 / BasisU compression
- WGSL shader validation
- CLI entry points

## Does Not Own
- Anything that runs in the browser
- Rendering logic → `@rokkit/render`
- Runtime asset parsing → `@rokkit/loader`

If something in this package could end up in a browser bundle, it's in the wrong place.

---

## Conventions

### Channel Packing
AO/Roughness/Metallic are packed into a single RGBA texture. This convention must match
what `@rokkit/render`'s PBR shader expects:

```
R → Ambient Occlusion
G → Roughness
B → Metallic
A → (reserved)
```

---

## Dependencies
- `@rokkit/loader` (optional)
- Node.js only: `@gltf-transform/core`, `sharp`, `basisu`, etc.