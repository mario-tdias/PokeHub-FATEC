import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const container = document.getElementById("pokedex3d-container");
const canvas = document.getElementById("pokedex3d-canvas");

let isZoomed = false;
let scene, camera, renderer, pokedexGroup, controls;
let targetRotationX = 0;
let targetRotationY = 0;

if (container && canvas) {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 5.5);

  renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Color & Shadow Settings matching reference studio lighting
  if (THREE.sRGBEncoding) {
    renderer.outputEncoding = THREE.sRGBEncoding;
  }
  if (THREE.ACESFilmicToneMapping) {
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
  }
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Configuração do mapa de ambiente sintético (RoomEnvironment)
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();
  scene.environment = pmremGenerator.fromScene(new RoomEnvironment(renderer), 0.04).texture;

  // As luzes direcionais entram para dar destaques e sombras
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
  mainLight.position.set(5, 10, 7);
  mainLight.castShadow = true;
  scene.add(mainLight);

  pokedexGroup = new THREE.Group();
  scene.add(pokedexGroup);

  // Load 3D model from assets/models/dex-3d/
  const loader = new GLTFLoader();
  const candidatePaths = [
    "../assets/models/dex-3d/base_basic_pbr.glb",
    "../assets/models/dex-3d/base_basic_shaded.glb",
    "../assets/models/pokedex.glb"
  ];

  function tryLoad(index) {
    if (index >= candidatePaths.length) return;
    loader.load(
      candidatePaths[index],
      (gltf) => {
        if (typeof pokedexGroup.clear === "function") {
          pokedexGroup.clear();
        } else {
          while (pokedexGroup.children.length > 0) {
            pokedexGroup.remove(pokedexGroup.children[0]);
          }
        }

        const model = gltf.scene;

        model.traverse((child) => {
          if (child.isMesh && child.material) {
            child.castShadow = true;
            child.receiveShadow = true;
            // Se o modelo veio com metalicidade alta demais no plástico, reduzimos:
            if (child.material.metalness !== undefined && child.material.metalness > 0.3) {
              child.material.metalness = 0.1;
            }
            // Garante que o material tenha um mínimo de rugosidade para espalhar a luz
            if (child.material.roughness !== undefined && child.material.roughness < 0.2) {
              child.material.roughness = 0.35;
            }
            child.material.needsUpdate = true;
          }
        });

        // Center and scale model dynamically
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        model.position.x -= center.x;
        model.position.y -= center.y;
        model.position.z -= center.z;

        const maxDimension = Math.max(size.x, size.y, size.z);
        if (maxDimension > 0) {
          const desiredScale = 3.2 / maxDimension;
          model.scale.set(desiredScale, desiredScale, desiredScale);
        }

        pokedexGroup.add(model);
      },
      undefined,
      (err) => {
        console.warn("Falha ao carregar modelo:", candidatePaths[index], err);
        tryLoad(index + 1);
      }
    );
  }

  tryLoad(0);

  // Controls & Parallax Interaction
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enableZoom = false;
  controls.enableRotate = false;

  container.addEventListener("pointermove", (e) => {
    if (isZoomed) return;
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
    const y = -(((e.clientY - rect.top) / container.clientHeight) * 2 - 1);
    targetRotationY = x * 0.35;
    targetRotationX = -y * 0.25;
  });

  window.addEventListener("resize", () => {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  function animate() {
    requestAnimationFrame(animate);

    if (!isZoomed) {
      pokedexGroup.rotation.y += (targetRotationY - pokedexGroup.rotation.y) * 0.08;
      pokedexGroup.rotation.x += (targetRotationX - pokedexGroup.rotation.x) * 0.08;
    }

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
      if (pokedexGroup) pokedexGroup.visible = false;
      if (canvas) canvas.style.display = "none";
    },
    resetView: function () {
      isZoomed = false;
      container.classList.remove("zoomed");
      if (pokedexGroup) pokedexGroup.visible = true;
      if (canvas) canvas.style.display = "block";
    },
    isZoomed: function () {
      return isZoomed;
    }
  };
}
