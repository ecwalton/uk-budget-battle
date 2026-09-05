# Original artwork

The red box and five envelope illustrations were created for Budget Battle in Blender. The leather texture is generated locally from a fixed random seed. No third-party model, photograph, texture or sound is embedded in these assets.

- `red-box.blend`: editable original, including its lid animation.
- `../public/assets/red-box.glb`: optimized web model with embedded texture and animation (approximately 480 KB).
- `../public/assets/{health,welfare,defence,investment,other}.png`: 256px transparent miniature illustrations.
- `../public/assets/launch-trailer.mp4`: 12-second, 1280×720, silent launch clip. The depicted first-year package is illustrative.

## Rebuild

Blender 5.2.1 was used. From the repository root:

```sh
blender --background --factory-startup --python scripts/create-red-box.py
blender --background --factory-startup --python scripts/create-envelope-icons.py
npm run build
```

The icon script renders with Cycles on the CPU. Optional Blender backup files are ignored. The GLB and PNGs are committed so normal application builds do not require Blender.

With the local app running at port 8787, Playwright/Chromium and FFmpeg installed:

```sh
node scripts/launch-trailer.mjs
```

The trailer records the opening animation and renders three other original browser-composed scenes, joining three seconds from each. It does not load automatically in the game.

The result newspaper is generated from the player's choices in `public/newspaper.js`; it is downloaded as a PNG and does not leave the browser. `src/box.js` progressively enhances the CSS fallback using the original GLB and Three.js. Three.js retains its own MIT license notice.
