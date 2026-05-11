# Rokkit

WebGPU rendering library and game engine. TypeScript monorepo managed with pnpm workspaces.

Blender is the primary authoring tool. Scenes are built in Blender, exported as GLB, and consumed
by the Rokkit runtime. The runtime has zero knowledge of Blender — it only sees the canonical scene
format that the pipeline produces.

---

## Monorepo Structure

Flat monorepo — all packages and games live at the root, no subdirectory nesting. Following the
pattern defined in `pnpm-workspace.yaml`.

Each directory has its own `CLAUDE.md` with package-specific context. Read the relevant one
before working inside that package.

---

## Coding Conventions

### TypeScript
- Strict mode enabled everywhere (`"strict": true`)
- Explicit return types on all public functions and methods
- No `any` — use `unknown` and narrow, or define proper types
- Prefer `interface` for object shapes, `type` for unions and aliases
- Avoid enums — use `const` objects with `as const` and derive the union type

### JSDoc
Every exported symbol must have a JSDoc comment. Non-negotiable.

```ts
/**
 * Creates a GPU buffer with the specified usage flags and optionally uploads initial data.
 *
 * @param device - The active WebGPU device.
 * @param descriptor - Buffer size, usage flags, and optional label.
 * @param data - Optional typed array to upload immediately after creation.
 * @returns A mapped-and-ready GPUBuffer.
 */
export function createBuffer(
  device: GPUDevice,
  descriptor: BufferDescriptor,
  data?: TypedArray
): GPUBuffer { ... }
```

- Describe **what** it does and **why** a caller would use it, not how it works internally
- Document all parameters and return types even if TypeScript types make them obvious
- Note side effects, ownership semantics, or lifecycle expectations where relevant
- Non-exported functions should still have a brief comment if non-obvious

### File Structure
- One primary export per file where reasonable
- `index.ts` re-exports the public API of each package — keep it clean and intentional
- Group related files into subdirectories (`/geometry`, `/material`, `/pipeline`, etc.)

### Naming
- Classes and interfaces: `PascalCase`
- Functions, variables, properties: `camelCase`
- Constants: `SCREAMING_SNAKE_CASE` for true constants, `camelCase` for config objects
- Types that wrap WebGPU primitives are prefixed: `RokkitBuffer` vs `GPUBuffer`

### Shaders
- Written in WGSL (not GLSL)
- Stored as `.wgsl` files, imported as strings via bundler plugin
- Each shader file has a header comment describing its stage, inputs, and outputs