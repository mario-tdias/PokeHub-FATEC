import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const container = document.getElementById("pokedex3d-container");
const canvas = document.getElementById("pokedex3d-canvas");

if (container && canvas) {
  let scene, camera, renderer, pokedexGroup, controls;
  let isZoomed = false;
  let targetRotationX = 0;
  let targetRotationY = 0;

  const initialCamPos = { x: 0, y: 0, z: 5.5 };

  function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(initialCamPos.x, initialCamPos.y, initialCamPos.z);

    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Color space & Tone Mapping setup matching reference lighting
    if (THREE.SRGBColorSpace) {
      renderer.outputColorSpace = THREE.SRGBColorSpace;
    } else if (THREE.sRGBEncoding) {
      renderer.outputEncoding = THREE.sRGBEncoding;
    }

    if (THREE.ACESFilmicToneMapping) {
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;
    }

    // Studio Lighting matching reference image
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.8);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.2);
    mainLight.position.set(5, 10, 7);
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 1.0);
    fillLight.position.set(-5, 5, 5);
    scene.add(fillLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.6);
    backLight.position.set(0, 5, -7);
    scene.add(backLight);

    pokedexGroup = new THREE.Group();
    scene.add(pokedexGroup);

    // Orbit Controls for interactive navigation
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enableZoom = false;
    controls.maxPolarAngle = Math.PI / 2 + 0.1;

    loadGLTFModel();
    addEventListeners();
    animate();
  }

  function loadGLTFModel() {
    const loader = new GLTFLoader();
    const candidatePaths = [
      "../assets/models/dex-3d/base_basic_pbr.glb",
      "../assets/models/dex-3d/base_basic_shaded.glb",
      "../assets/models/pokedex.glb"
    ];

    function tryLoad(index) {
      if (index >= candidatePaths.length) {
        console.warn("Nenhum modelo .glb encontrado nos caminhos especificados.");
        return;
      }

      loader.load(
        candidatePaths[index],
        (gltf) => {
          while (pokedexGroup.children.length > 0) {
            pokedexGroup.remove(pokedexGroup.children[0]);
          }

          const model = gltf.scene;

          model.traverse((child) => {
            if (child.isMesh && child.material) {
              child.material.needsUpdate = true;
            }
          });

          // Auto center & auto scale
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
          console.log("Modelo 3D GLTF carregado com sucesso:", candidatePaths[index]);
        },
        undefined,
        (err) => {
          console.warn("Falha ao carregar modelo:", candidatePaths[index], err);
          tryLoad(index + 1);
        }
      );
    }

    tryLoad(0);
  }

  function addEventListeners() {
    container.addEventListener("pointermove", (e) => {
      if (isZoomed) return;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      const y = -(((e.clientY - rect.top) / container.clientHeight) * 2 - 1);
      targetRotationY = x * 0.3;
      targetRotationX = -y * 0.2;
    });

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

    window.addEventListener("resize", () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });
  }

  function animate() {
    requestAnimationFrame(animate);

    if (controls) {
      controls.update();
    }

    if (!isZoomed && pokedexGroup) {
      pokedexGroup.rotation.y += (targetRotationY - pokedexGroup.rotation.y) * 0.05;
      pokedexGroup.rotation.x += (targetRotationX - pokedexGroup.rotation.x) * 0.05;
    }

    renderer.render(scene, camera);
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

  init();
}
