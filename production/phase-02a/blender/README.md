# Blender proof scene

`build_proof_scene.py` is a reproducible Blender Python script for a low-resolution conceptual proof of the Phase 02A storyboard. It creates one commercial room, stages additive construction from shell to finished workspace, adds desktop and mobile cameras, saves a `.blend`, and renders representative WebP frames when Blender is available.

The repository currently has no Blender installation, so this script has not been executed here and no proof frames are claimed as generated.

## Usage when Blender is available

From the repository root:

```text
blender -b --python production/phase-02a/blender/build_proof_scene.py
```

The script writes to `production/phase-02a/proof/`:

- `ar-interior-group-phase-02a-proof.blend`
- `desktop/frame-####.webp`
- `mobile/frame-####.webp`

The default proof renders 16 representative frames per composition. It uses Eevee, 640×360 desktop, 360×640 mobile, and moderate samples to stay reviewable. Increase the constants at the top of the script only after the scene and camera path are approved.
