import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import SplineLoader from '@splinetool/loader';

const container = document.getElementById("pokedex3d-container");
const canvas = document.getElementById("pokedex3d-canvas");

let isZoomed = false;

if (container && canvas) {
  // camera
  const camera = new THREE.OrthographicCamera(
    container.clientWidth / -2,
    container.clientWidth / 2,
    container.clientHeight / 2,
    container.clientHeight / -2,
    -50000,
    10000
  );
  camera.position.set(0, 0, 0);
  camera.quaternion.setFromEuler(new THREE.Euler(0, 0, 0));

  // scene
  const scene = new THREE.Scene();

  // spline scene
  const loader = new SplineLoader();
  loader.load(
    'https://prod.spline.design/RZuBKTHpfw8KawwV/scene.splinecode',
    (splineScene) => {
      scene.add(splineScene);
    }
  );

  // renderer
  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // scene settings
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  renderer.setClearAlpha(0);

  // orbit controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.125;

  function onWindowResize() {
    if (!container) return;
    camera.left = container.clientWidth / -2;
    camera.right = container.clientWidth / 2;
    camera.top = container.clientHeight / 2;
    camera.bottom = container.clientHeight / -2;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }

  window.addEventListener('resize', onWindowResize);

  function animate(time) {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  animate();

  canvas.addEventListener("click", () => {
    if (!window.Pokedex3D.isZoomed()) {
      window.Pokedex3D.zoomIn();
    }
  });

  const resetBtn = document.getElementById("resetViewBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      window.Pokedex3D.resetView();
    });
  }

  window.Pokedex3D = {
    zoomIn: function () {
      isZoomed = true;
      container.classList.add("zoomed");
      if (canvas) canvas.style.display = "none";
    },
    resetView: function () {
      isZoomed = false;
      container.classList.remove("zoomed");
      if (canvas) canvas.style.display = "block";
    },
    isZoomed: function () {
      return isZoomed;
    }
  };
}
