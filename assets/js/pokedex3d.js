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

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight.position.set(5, 8, 5);
    scene.add(dirLight);

    pokedexGroup = new THREE.Group();
    scene.add(pokedexGroup);

    createFallbackModel();
    loadGLTFModel();

    addEventListeners();
    animate();
  }

  function createFallbackModel() {
    const bodyGeo = new THREE.BoxGeometry(2.2, 3.2, 0.4);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xd32f2f, roughness: 0.3, metalness: 0.2 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    pokedexGroup.add(body);

    const screenFrameGeo = new THREE.BoxGeometry(1.6, 1.6, 0.05);
    const screenFrameMat = new THREE.MeshStandardMaterial({ color: 0x141820 });
    const screenFrame = new THREE.Mesh(screenFrameGeo, screenFrameMat);
    screenFrame.position.set(0, 0.3, 0.2);
    pokedexGroup.add(screenFrame);

    const lensGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const lensMat = new THREE.MeshStandardMaterial({ color: 0x4aa8e0, roughness: 0.1, metalness: 0.8 });
    const lens = new THREE.Mesh(lensGeo, lensMat);
    lens.position.set(-0.7, 1.3, 0.22);
    pokedexGroup.add(lens);
  }

  function loadGLTFModel() {
    if (typeof THREE.GLTFLoader === "undefined") return;
    const loader = new THREE.GLTFLoader();
    loader.load(
      "../assets/models/pokedex.glb",
      (gltf) => {
        if (typeof pokedexGroup.clear === "function") {
          pokedexGroup.clear();
        } else {
          while (pokedexGroup.children.length > 0) {
            pokedexGroup.remove(pokedexGroup.children[0]);
          }
        }
        pokedexGroup.add(gltf.scene);
      },
      undefined,
      (err) => {
        console.log("Modelo .glb não encontrado. Usando Pokédex 3D de fallback.");
      }
    );
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
