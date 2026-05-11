# @rokkit/blender

Python Blender addon. Extends Blender with custom panels for Rokkit scene concepts that don't
exist natively — sound sources, trigger volumes, colliders, spawn points.

Python only. Completely isolated from the TypeScript packages.

---

## Owns
- Custom object panels for Rokkit scene concepts
- GLB export integration (embeds Rokkit props into `extras.rokkit` on each node)
- WebSocket HMR server for pushing scene deltas to the runtime

## Object Types

```
Blender Representation      Rokkit Concept
────────────────────────────────────────────────────
Light (native)              DirectionalLight / PointLight / SpotLight
Empty + SOUND panel         SoundSource (asset ref, radius, volume, falloff)
Empty + TRIGGER panel       TriggerVolume (shape, on_enter, on_exit events)
Mesh + COLLIDER panel       ColliderShape (box / sphere / mesh, layer mask)
Empty + SPAWN panel         SpawnPoint (entity type, facing direction)
```

---

## Conventions

### GLB Extras Schema
Rokkit properties are embedded under `extras.rokkit` on each glTF node:

```json
{
  "name": "AudioSource_Ambient",
  "extras": {
    "rokkit": {
      "type": "sound_source",
      "asset": "audio/ambient.ogg",
      "radius": 12.0,
      "volume": 0.8
    }
  }
}
```

`@rokkit/loader` passes these through as opaque metadata. `@rokkit/engine` interprets them.
Do not change this schema without updating both the addon and the engine.

---

## Dependencies
Python 3.x (Blender's embedded interpreter). No TypeScript dependencies.