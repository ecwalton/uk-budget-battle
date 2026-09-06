import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
// Original Blender asset, progressively enhanced; no continuous idle animation.
export function mountBox(host, { open = false, tableau = false } = {}) {
  if (
    !host?.isConnected ||
    matchMedia("(prefers-reduced-motion: reduce)").matches ||
    navigator.connection?.saveData
  )
    return () => {};
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("webgl2", { alpha: true, antialias: true });
  if (!context) return () => {};
  const renderer = new THREE.WebGLRenderer({
    canvas,
    context,
    alpha: true,
    antialias: true,
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const scene = new THREE.Scene(),
    camera = new THREE.PerspectiveCamera(29, 1, 0.1, 30);
  camera.position.set(...(tableau ? [3.5, 5.1, 9.4] : [2, 1.7, 6.5]));
  camera.lookAt(0, tableau ? -0.25 : 0.2, 0);
  const group = new THREE.Group();
  scene.add(group);
  group.rotation.set(0, -0.2, -0.035);
  scene.add(new THREE.HemisphereLight(0xfff6df, 0x746b6b, 2.5));
  const key = new THREE.DirectionalLight(0xfff3dd, 4);
  key.position.set(-3, 5, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.normalBias = 0.025;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xe5edff, 2);
  fill.position.set(4, 2, -2);
  scene.add(fill);
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(15, 15),
    new THREE.ShadowMaterial({ opacity: 0.13 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.9;
  ground.receiveShadow = true;
  scene.add(ground);
  canvas.className = "box-canvas";
  canvas.setAttribute("aria-hidden", "true");
  let disposed = false,
    raf = 0,
    targetY = -0.2,
    targetX = 0,
    mixer = null,
    animating = false,
    last = 0;
  function release(root) {
    const materials = new Set(),
      textures = new Set();
    root.traverse((o) => {
      o.geometry?.dispose();
      for (const m of o.material
        ? Array.isArray(o.material)
          ? o.material
          : [o.material]
        : [])
        materials.add(m);
    });
    for (const m of materials) {
      for (const v of Object.values(m)) if (v?.isTexture) textures.add(v);
      m.dispose();
    }
    for (const t of textures) {
      t.source?.data?.close?.();
      t.dispose();
    }
  }
  function schedule() {
    if (!raf && !disposed && !document.hidden)
      raf = requestAnimationFrame(draw);
  }
  function draw(time) {
    raf = 0;
    if (disposed || !host.isConnected || document.hidden) return;
    const dt = last ? Math.min((time - last) / 1000, 0.05) : 0;
    last = time;
    if (animating) mixer.update(dt);
    group.rotation.y += (targetY - group.rotation.y) * 0.16;
    group.rotation.x += (targetX - group.rotation.x) * 0.16;
    renderer.render(scene, camera);
    if (
      animating ||
      Math.abs(targetY - group.rotation.y) +
        Math.abs(targetX - group.rotation.x) >
        0.001
    )
      schedule();
  }
  function resize() {
    const w = host.clientWidth,
      h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    schedule();
  }
  function move(e) {
    if (e.pointerType === "touch") return;
    const r = host.getBoundingClientRect();
    targetY = -0.2 + ((e.clientX - r.left) / r.width - 0.5) * 0.45;
    targetX = ((e.clientY - r.top) / r.height - 0.5) * 0.15;
    schedule();
  }
  function leave() {
    targetY = -0.2;
    targetX = 0;
    schedule();
  }
  function visibility() {
    cancelAnimationFrame(raf);
    raf = 0;
    last = 0;
    if (!document.hidden) schedule();
  }
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  host.addEventListener("pointermove", move);
  host.addEventListener("pointerleave", leave);
  document.addEventListener("visibilitychange", visibility);
  new GLTFLoader().load(
    tableau ? "/assets/treasury-desk.glb" : "/assets/red-box.glb",
    (gltf) => {
      if (disposed || !host.isConnected) {
        release(gltf.scene);
        return;
      }
      gltf.scene.position.y = -0.9;
      gltf.scene.traverse((o) => {
        if (o.isMesh) {
          o.castShadow = true;
          o.receiveShadow = true;
        }
      });
      group.add(gltf.scene);
      if (open && gltf.animations.length) {
        mixer = new THREE.AnimationMixer(gltf.scene);
        const action = mixer.clipAction(gltf.animations[0]);
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
        action.play();
        animating = true;
        mixer.addEventListener("finished", () => {
          animating = false;
          canvas.dataset.animation = "complete";
        });
        canvas.dataset.animation = "opening";
      }
      host.append(canvas);
      host.classList.add("enhanced");
      canvas.dataset.asset = tableau ? "treasury-desk" : "red-box";
      resize();
    },
    undefined,
    () => {
      /* Static red box remains available when the optional asset fails. */
    },
  );
  resize();
  return () => {
    disposed = true;
    cancelAnimationFrame(raf);
    observer.disconnect();
    host.removeEventListener("pointermove", move);
    host.removeEventListener("pointerleave", leave);
    document.removeEventListener("visibilitychange", visibility);
    mixer?.stopAllAction();
    release(scene);
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
    host.classList.remove("enhanced");
  };
}
