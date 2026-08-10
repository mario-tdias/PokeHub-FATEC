(function () {
  const container = document.getElementById("pokedex3d-container");
  const canvas = document.getElementById("pokedex3d-canvas");

  if (!container || !canvas) return;

  let scene, camera, renderer, pokedexGroup;
  let isZoomed = false;
  let targetRotationX = 0;
  let targetRotationY = 0;

  const initialCamPos = { x: 0, y: 0, z: 5.5 };
  const zoomedCamPos = { x: 0, y: 0, z: 2.8 };

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
    if (THREE.sRGBEncoding) {
      renderer.outputEncoding = THREE.sRGBEncoding;
    }
    if (THREE.ACESFilmicToneMapping) {
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
    }

    // High quality studio lighting setup for GLTF models
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.2);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x333344, 1.5);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 3.2);
    mainLight.position.set(5, 12, 8);
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0x90c0ff, 2.0);
    fillLight.position.set(-6, 6, 6);
    scene.add(fillLight);

    const backLight = new THREE.DirectionalLight(0xffd54f, 1.5);
    backLight.position.set(0, 6, -8);
    scene.add(backLight);

    pokedexGroup = new THREE.Group();
    scene.add(pokedexGroup);

    loadEmissiveTexture();
    loadGLTFModel();

    addEventListeners();
    animate();
  }

  let emissiveTextureMap = null;

  function loadEmissiveTexture() {
    if (typeof THREE.TextureLoader === "undefined") return;
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      "../assets/models/dex-3d/texture_emissive_00.png",
      (texture) => {
        texture.flipY = false;
        if (THREE.sRGBEncoding) {
          texture.encoding = THREE.sRGBEncoding;
        }
        emissiveTextureMap = texture;
        applyEmissiveMap();
      },
      undefined,
      (err) => {
        console.warn("Textura emissiva dex-3d não carregada:", err);
      }
    );
  }

  function applyEmissiveMap() {
    if (!pokedexGroup || !emissiveTextureMap) return;
    pokedexGroup.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.emissiveMap = emissiveTextureMap;
        child.material.emissive = new THREE.Color(0xffffff);
        child.material.emissiveIntensity = 1.0;
        child.material.needsUpdate = true;
      }
    });
  }

  function loadGLTFModel() {
    if (typeof THREE.GLTFLoader === "undefined") return;
    const loader = new THREE.GLTFLoader();
    const candidatePaths = [
      "../assets/models/dex-3d/base_basic_pbr.glb",
      "../assets/base_basic_pbr.glb",
      "../assets/models/pokedex.glb",
      "../assets/models/dex-3d/base_basic_shaded.glb"
    ];

    function tryLoad(index) {
      if (index >= candidatePaths.length) {
        console.log("Nenhum modelo .glb encontrado nos caminhos.");
        return;
      }

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
              child.material.needsUpdate = true;
            }
          });

          // Auto center and auto scale model
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
          applyEmissiveMap();
          console.log("Modelo 3D GLTF carregado com sucesso:", candidatePaths[index]);
        },
        undefined,
        (err) => {
          console.warn("Falha ao carregar:", candidatePaths[index], err);
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
      targetRotationY = x * 0.35;
      targetRotationX = -y * 0.25;
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
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });
  }

  function animate() {
    requestAnimationFrame(animate);

    if (!isZoomed) {
      pokedexGroup.rotation.y += (targetRotationY - pokedexGroup.rotation.y) * 0.08;
      pokedexGroup.rotation.x += (targetRotationX - pokedexGroup.rotation.x) * 0.08;

      camera.position.x += (initialCamPos.x - camera.position.x) * 0.08;
      camera.position.y += (initialCamPos.y - camera.position.y) * 0.08;
      camera.position.z += (initialCamPos.z - camera.position.z) * 0.08;
    } else {
      pokedexGroup.rotation.y += (0 - pokedexGroup.rotation.y) * 0.08;
      pokedexGroup.rotation.x += (0 - pokedexGroup.rotation.x) * 0.08;

      camera.position.x += (zoomedCamPos.x - camera.position.x) * 0.08;
      camera.position.y += (zoomedCamPos.y - camera.position.y) * 0.08;
      camera.position.z += (zoomedCamPos.z - camera.position.z) * 0.08;
    }

    renderer.render(scene, camera);
  }

  window.Pokedex3D = {
    zoomIn: function () {
      isZoomed = true;
      container.classList.add("zoomed");
    },
    resetView: function () {
      isZoomed = false;
      container.classList.remove("zoomed");
    },
    isZoomed: function () {
      return isZoomed;
    }
  };

  init();
})();
