<script lang="ts">
 import { onMount } from 'svelte';
 import * as THREE from 'three';
 import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
 let container: HTMLDivElement;
 onMount(() => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 1.5, 15);
  let renderer: THREE.WebGLRenderer;
  try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); }
  catch { return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  const group = new THREE.Group();
  group.rotation.set(Math.PI, 0, -Math.PI / 2);
  scene.add(group);
  const shapes = [
   [[0,0],[0,6],[1,5],[1,1],[5,1],[5,5],[6,6],[6,0],[0,0]],
   [[2,2],[2,4],[3,3],[4,4],[4,2],[2,2]],
   [[1,6],[3,4],[5,6],[1,6]]
  ];
  const meshes = shapes.map((points, i) => {
   const shape = new THREE.Shape();
   points.forEach(([x,y], j) => j ? shape.lineTo(x,y) : shape.moveTo(x,y));
   const geometry = new THREE.ExtrudeGeometry(shape, { depth: 1.2, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.1, bevelThickness: 0.1 });
   const material = new THREE.MeshStandardMaterial({ color: i === 1 ? '#06b6d4' : '#10b981', metalness: 0.8, roughness: 0.25 });
   const mesh = new THREE.Mesh(geometry, material);
   mesh.position.set(-3,-3,-0.6);
   group.add(mesh);
   return mesh;
  });
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const light = new THREE.DirectionalLight(0xffffff, 1.5);
  light.position.set(10,20,15);
  scene.add(light);
  const resize = () => {
   const { width, height } = container.getBoundingClientRect();
   if (!width || !height) return;
   renderer.setSize(width, height);
   camera.aspect = width / height;
   camera.updateProjectionMatrix();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(container);
  resize();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame: number;
  const animate = () => {
   if (!reducedMotion.matches) group.rotation.y += 0.006;
   controls.update();
   renderer.render(scene, camera);
   frame = requestAnimationFrame(animate);
  };
  animate();
  return () => {
   cancelAnimationFrame(frame);
   observer.disconnect();
   controls.dispose();
   meshes.forEach(mesh => { mesh.geometry.dispose(); mesh.material.dispose(); });
   renderer.dispose();
   renderer.domElement.remove();
  };
 });
</script>

<div bind:this={container} class="w-full h-full min-h-[260px] relative overflow-hidden" aria-hidden="true"></div>
