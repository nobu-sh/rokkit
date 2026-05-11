# @rokkit/loader

Parses GLB/glTF files and produces plain TypeScript data structures. No GPU, no rendering.

Output is pure data — no GPU handles, no WebGPU types, no render concepts. Ever.

---

## Owns
- GLB binary parsing (header, JSON chunk, binary chunk)
- glTF scene hierarchy extraction
- Mesh and primitive data extraction (positions, normals, UVs, tangents, indices)
- Material descriptor extraction
- Texture image decoding and raw pixel data
- Animation and skin data (future)

## Does Not Own
- GPU resource creation → `@rokkit/gpu`
- Render concepts of any kind → `@rokkit/render`
- Game loop or entity logic → `@rokkit/engine`
- Asset optimization or conversion → `@rokkit/tools`

If a WebGPU type appears in this package, it's wrong.

---

## Conventions

### Output Types
All output types are plain data structs — no classes, no methods. Defined in `types.ts`,
exported from `index.ts`. Treat changes to these types as breaking changes.

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

---

## Dependencies
None.