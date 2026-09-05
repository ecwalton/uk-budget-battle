import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
// Decorative progressive enhancement. Render only while the pointer is moving.
export function mountBox(host) {
  if (
    !host?.isConnected ||
    matchMedia("(prefers-reduced-motion: reduce)").matches ||
    navigator.connection?.saveData
  )
    return () => {};
  const canvas = document.createElement("canvas");
  // Probe before constructing the renderer so unsupported devices keep the CSS fallback.
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
  const scene = new THREE.Scene(),
    camera = new THREE.PerspectiveCamera(28, 1, 0.1, 30);
  camera.position.set(2, 1.7, 6.2);
  camera.lookAt(0, 0.1, 0);
  const group = new THREE.Group();
  scene.add(group);
  group.rotation.set(0, -0.2, -0.06);
  const leather = new THREE.MeshStandardMaterial({
    color: 0x872e3c,
    roughness: 0.65,
    metalness: 0.03,
  });
  const seam = new THREE.MeshStandardMaterial({
    color: 0x4e1c28,
    roughness: 0.9,
  });
  const gold = new THREE.MeshStandardMaterial({
    color: 0xccad72,
    roughness: 0.42,
    metalness: 0.7,
  });
  const parts = [];
  function box(w, h, d, x, y, z, material, r = 0.06) {
    const mesh = new THREE.Mesh(
      new RoundedBoxGeometry(w, h, d, 3, r),
      material,
    );
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    parts.push(mesh);
    return mesh;
  }
  box(2.85, 1.52, 0.68, 0, -0.05, 0, leather);
  box(2.85, 0.055, 0.69, 0, 0.53, 0, seam, 0.015);
  box(2.87, 0.24, 0.7, 0, 0.67, 0, leather, 0.035);
  // Leather handle with brass mounts.
  box(0.11, 0.4, 0.14, -0.42, 1.0, 0, seam, 0.04);
  box(0.11, 0.4, 0.14, 0.42, 1.0, 0, seam, 0.04);
  box(0.85, 0.12, 0.14, 0, 1.16, 0, seam, 0.05);
  [-0.42, 0.42].forEach((x) => box(0.23, 0.06, 0.28, x, 0.82, 0, gold, 0.02));
  box(0.27, 0.29, 0.06, 0, 0.5, 0.375, gold, 0.025);
  box(0.05, 0.09, 0.02, 0, 0.49, 0.413, seam, 0.008);
  // Small feet and protective corners.
  [-1.23, 1.23].forEach((x) => {
    box(0.14, 0.07, 0.15, x, -0.85, 0.16, gold, 0.025);
    box(0.11, 0.16, 0.05, x, -0.66, 0.35, gold, 0.02);
  });
  const label = document.createElement("canvas");
  label.width = 768;
  label.height = 384;
  const cx = label.getContext("2d");
  cx.fillStyle = "#e0c389";
  cx.textAlign = "center";
  cx.font = "30px Georgia";
  cx.fillText("◇", 384, 76);
  cx.font = "23px Georgia";
  cx.fillText("T H E   B U D G E T", 384, 142);
  cx.font = "36px Georgia";
  cx.fillText("YOUR CALL.", 384, 205);
  cx.strokeStyle = "#e0c389";
  cx.lineWidth = 1;
  cx.beginPath();
  cx.moveTo(306, 238);
  cx.lineTo(462, 238);
  cx.stroke();
  const texture = new THREE.CanvasTexture(label);
  texture.colorSpace = THREE.SRGBColorSpace;
  const labelMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
  });
  const labelPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(1.8, 0.9),
    labelMaterial,
  );
  labelPlane.position.set(0, -0.18, 0.347);
  group.add(labelPlane);
  scene.add(new THREE.HemisphereLight(0xfff6df, 0x746b6b, 2.1));
  const key = new THREE.DirectionalLight(0xfff3dd, 3.2);
  key.position.set(-3, 5, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -4;
  key.shadow.camera.right = 4;
  key.shadow.camera.top = 4;
  key.shadow.camera.bottom = -4;
  key.shadow.normalBias = 0.025;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xe5edff, 1.0);
  fill.position.set(4, 2, -2);
  scene.add(fill);
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(15, 15),
    new THREE.ShadowMaterial({ opacity: 0.12 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.9;
  ground.receiveShadow = true;
  scene.add(ground);
  canvas.setAttribute("aria-hidden", "true");
  canvas.className = "box-canvas";
  host.append(canvas);
  host.classList.add("enhanced");
  let disposed = false,
    raf = 0,
    targetY = -0.2,
    targetX = 0;
  const draw = () => {
    raf = 0;
    if (disposed || !host.isConnected || document.hidden) return;
    group.rotation.y += (targetY - group.rotation.y) * 0.16;
    group.rotation.x += (targetX - group.rotation.x) * 0.16;
    renderer.render(scene, camera);
    if (
      Math.abs(targetY - group.rotation.y) +
        Math.abs(targetX - group.rotation.x) >
      0.001
    )
      raf = requestAnimationFrame(draw);
  };
  function resize() {
    const width = host.clientWidth,
      height = host.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    draw();
  }
  function move(e) {
    if (e.pointerType === "touch") return;
    const rect = host.getBoundingClientRect();
    targetY = -0.2 + ((e.clientX - rect.left) / rect.width - 0.5) * 0.5;
    targetX = ((e.clientY - rect.top) / rect.height - 0.5) * 0.2;
    if (!raf) raf = requestAnimationFrame(draw);
  }
  function leave() {
    targetY = -0.2;
    targetX = 0;
    if (!raf) raf = requestAnimationFrame(draw);
  }
  function visibility() {
    if (document.hidden) {
      cancelAnimationFrame(raf);
      raf = 0;
    } else draw();
  }
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  host.addEventListener("pointermove", move);
  host.addEventListener("pointerleave", leave);
  document.addEventListener("visibilitychange", visibility);
  resize();
  return () => {
    disposed = true;
    cancelAnimationFrame(raf);
    observer.disconnect();
    host.removeEventListener("pointermove", move);
    host.removeEventListener("pointerleave", leave);
    document.removeEventListener("visibilitychange", visibility);
    scene.traverse((o) => {
      o.geometry?.dispose();
      if (o.material)
        for (const m of Array.isArray(o.material) ? o.material : [o.material])
          m.dispose();
    });
    texture.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
    host.classList.remove("enhanced");
  };
}
