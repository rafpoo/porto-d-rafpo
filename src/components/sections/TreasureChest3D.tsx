import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type {
  AnimationAction,
  AnimationClip,
  AnimationMixer,
  Group,
  Material,
  Mesh,
  Object3D,
  PerspectiveCamera,
  PointLight,
  Scene,
  Texture,
  WebGLRenderer,
} from "three";

export type TreasureChest3DHandle = {
  renderNow: () => void;
  setOpenProgress: (progress: number) => void;
};

type ThreeModule = typeof import("three");
type GltfLoaderModule =
  typeof import("three/examples/jsm/loaders/GLTFLoader.js");

type LoadedGltf = {
  animations: AnimationClip[];
  scene: Group;
};

type ChestRuntime = {
  action: AnimationAction | null;
  animationRoot: Object3D | null;
  camera: PerspectiveCamera;
  clipDuration: number;
  isDisposed: boolean;
  mixer: AnimationMixer | null;
  modelRoot: Group;
  openingEndTime: number;
  openingStartTime: number;
  renderer: WebGLRenderer;
  scene: Scene;
  treasureLight: PointLight;
  render: () => void;
  setProgress: (progress: number) => void;
};

type WebGlState = "idle" | "loading" | "ready" | "fallback";

const CHEST_MODEL_URL = `${import.meta.env.BASE_URL}assets/tools-chest/treasure-chest.glb`;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

function disposeObject3D(root: Object3D) {
  const geometries = new Set<Mesh["geometry"]>();
  const materials = new Set<Material>();
  const textures = new Set<Texture>();

  root.traverse((object) => {
    const mesh = object as Mesh;

    if (mesh.geometry) {
      geometries.add(mesh.geometry);
    }

    const material = mesh.material as Material | Material[] | undefined;

    if (Array.isArray(material)) {
      material.forEach((item) => materials.add(item));
      return;
    }

    if (material) {
      materials.add(material);
    }
  });

  materials.forEach((material) => {
    Object.values(material).forEach((value) => {
      const texture = value as Texture | undefined;

      if (texture?.isTexture) {
        textures.add(texture);
      }
    });
  });

  textures.forEach((texture) => texture.dispose());
  materials.forEach((material) => material.dispose());
  geometries.forEach((geometry) => geometry.dispose());
}

function chooseOpeningClip(animations: AnimationClip[]) {
  return (
    animations.find((clip) => /open|chest|lid/i.test(clip.name)) ??
    animations[0] ??
    null
  );
}

function getOpeningWindow(clip: AnimationClip) {
  if (/loop/i.test(clip.name) && clip.duration >= 3.5) {
    return {
      end: clip.duration * 0.4,
      start: clip.duration * 0.25,
    };
  }

  return {
    end: clip.duration,
    start: 0,
  };
}

function fitModelToStage(
  THREE: ThreeModule,
  model: Object3D,
  modelRoot: Group,
) {
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const horizontalSize = Math.max(size.x, size.z);
  const targetWidth = 2.85; //2.85
  const scale = targetWidth / Math.max(horizontalSize, 1);

  model.position.set(-center.x, -box.min.y, -center.z);
  modelRoot.scale.setScalar(scale);
  modelRoot.position.set(0, -1.3, 0);
  modelRoot.rotation.set(-0.02, -1.6, 0);
}

function createChestRuntime(THREE: ThreeModule): ChestRuntime {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 16 / 9, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });

  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = false;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;

  const modelRoot = new THREE.Group();
  scene.add(modelRoot);

  const ambient = new THREE.HemisphereLight(0xfff5d2, 0x2f1c15, 1.55);
  const keyLight = new THREE.DirectionalLight(0xffe2aa, 2.7);
  const fillLight = new THREE.DirectionalLight(0xffc878, 0.65);
  const rimLight = new THREE.DirectionalLight(0x75c9e0, 0.78);
  const treasureLight = new THREE.PointLight(0xffc75a, 0.45, 5.8, 2);

  keyLight.position.set(2.5, 4.2, 4.7);
  fillLight.position.set(-3.2, 2.4, 3.2);
  rimLight.position.set(-3.4, 2.4, -2.8);
  treasureLight.position.set(0, 0.18, 0.5);
  scene.add(ambient, keyLight, fillLight, rimLight, treasureLight);

  camera.position.set(0, 1.68, 6.25);
  camera.lookAt(0, 0.13, 0.02);

  const render = () => {
    renderer.render(scene, camera);
  };

  const runtime: ChestRuntime = {
    action: null,
    animationRoot: null,
    camera,
    clipDuration: 0,
    isDisposed: false,
    mixer: null,
    modelRoot,
    openingEndTime: 0,
    openingStartTime: 0,
    renderer,
    scene,
    treasureLight,
    render,
    setProgress: (progress: number) => {
      if (runtime.isDisposed) {
        return;
      }

      const clamped = clamp01(progress);

      if (runtime.mixer && runtime.action && runtime.clipDuration > 0) {
        const animationTime =
          clamped <= 0
            ? 0
            : THREE.MathUtils.lerp(
                runtime.openingStartTime,
                runtime.openingEndTime,
                clamped,
              );

        runtime.mixer.setTime(animationTime);
      }

      runtime.treasureLight.intensity = 0.45 + clamped * 1.05;
      runtime.render();
    },
  };

  return runtime;
}

function destroyChestRuntime(runtime: ChestRuntime) {
  if (runtime.isDisposed) {
    return;
  }

  runtime.isDisposed = true;
  runtime.action?.stop();
  runtime.mixer?.stopAllAction();

  if (runtime.mixer && runtime.animationRoot) {
    runtime.mixer.uncacheRoot(runtime.animationRoot);
  }

  runtime.action = null;
  runtime.mixer = null;
  runtime.animationRoot = null;
  runtime.renderer.setAnimationLoop(null);
  disposeObject3D(runtime.scene);
  runtime.scene.clear();
  runtime.renderer.dispose();
  runtime.renderer.forceContextLoss();
  runtime.renderer.domElement.remove();
}

async function loadTreasureChestModel(
  THREE: ThreeModule,
  GltfLoader: GltfLoaderModule["GLTFLoader"],
  runtime: ChestRuntime,
  shouldCancel: () => boolean,
) {
  const loader = new GltfLoader();
  const gltf = (await loader.loadAsync(CHEST_MODEL_URL)) as LoadedGltf;

  if (shouldCancel() || runtime.isDisposed) {
    disposeObject3D(gltf.scene);
    return false;
  }

  try {
    fitModelToStage(THREE, gltf.scene, runtime.modelRoot);
    gltf.scene.traverse((object) => {
      const mesh = object as Mesh;

      mesh.frustumCulled = false;
      mesh.castShadow = false;
      mesh.receiveShadow = false;
    });
    runtime.modelRoot.add(gltf.scene);
    runtime.animationRoot = gltf.scene;

    const openingClip = chooseOpeningClip(gltf.animations);

    if (openingClip) {
      const mixer = new THREE.AnimationMixer(gltf.scene);
      const action = mixer.clipAction(openingClip);
      const openingWindow = getOpeningWindow(openingClip);

      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
      action.enabled = true;
      action.play();
      runtime.mixer = mixer;
      runtime.action = action;
      runtime.clipDuration = openingClip.duration;
      runtime.openingStartTime = openingWindow.start;
      runtime.openingEndTime = openingWindow.end;
    }
  } catch (error) {
    if (!gltf.scene.parent) {
      disposeObject3D(gltf.scene);
    }

    throw error;
  }

  return true;
}

export const TreasureChest3D = forwardRef<TreasureChest3DHandle>(
  function TreasureChest3D(_, ref) {
    const mountRef = useRef<HTMLDivElement>(null);
    const runtimeRef = useRef<ChestRuntime | null>(null);
    const desiredProgressRef = useRef(0);
    const [webGlState, setWebGlState] = useState<WebGlState>("idle");

    useImperativeHandle(
      ref,
      () => ({
        renderNow: () => runtimeRef.current?.render(),
        setOpenProgress: (progress: number) => {
          const clamped = clamp01(progress);

          desiredProgressRef.current = clamped;
          runtimeRef.current?.setProgress(clamped);
        },
      }),
      [],
    );

    useEffect(() => {
      const mount = mountRef.current;
      let isDisposed = false;
      let hasStarted = false;
      let intersectionObserver: IntersectionObserver | null = null;
      let resizeObserver: ResizeObserver | null = null;
      let activeRuntime: ChestRuntime | null = null;

      if (!mount) {
        return undefined;
      }

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      desiredProgressRef.current = reduceMotion
        ? 1
        : desiredProgressRef.current;

      const destroyActiveRuntime = () => {
        resizeObserver?.disconnect();
        resizeObserver = null;

        const runtime = activeRuntime ?? runtimeRef.current;

        activeRuntime = null;

        if (!runtime) {
          return;
        }

        if (runtimeRef.current === runtime) {
          runtimeRef.current = null;
        }

        destroyChestRuntime(runtime);
      };

      const initialize = () => {
        if (hasStarted || isDisposed) {
          return;
        }

        hasStarted = true;
        intersectionObserver?.disconnect();
        intersectionObserver = null;
        setWebGlState("loading");

        void Promise.all([
          import("three"),
          import("three/examples/jsm/loaders/GLTFLoader.js"),
        ])
          .then(async ([THREE, { GLTFLoader }]) => {
            if (isDisposed) {
              return;
            }

            const runtime = createChestRuntime(THREE);
            const canvas = runtime.renderer.domElement;

            activeRuntime = runtime;
            runtimeRef.current = runtime;
            canvas.className = "tools-chest-webgl-canvas";
            canvas.setAttribute("aria-hidden", "true");
            mount.appendChild(canvas);

            let lastHeight = 0;
            let lastPixelRatio = 0;
            let lastWidth = 0;
            const resize = () => {
              if (runtime.isDisposed) {
                return;
              }

              const bounds = mount.getBoundingClientRect();
              const width = Math.max(1, bounds.width);
              const height = Math.max(1, bounds.height);
              const maxPixelRatio =
                width <= 380 ? 1.25 : width <= 720 ? 1.5 : 1.75;
              const pixelRatio = Math.min(
                window.devicePixelRatio || 1,
                maxPixelRatio,
              );

              if (
                width === lastWidth &&
                height === lastHeight &&
                pixelRatio === lastPixelRatio
              ) {
                return;
              }

              lastWidth = width;
              lastHeight = height;
              lastPixelRatio = pixelRatio;
              runtime.renderer.setPixelRatio(pixelRatio);
              runtime.renderer.setSize(width, height, false);
              runtime.camera.aspect = width / height;
              runtime.camera.position.set(
                0,
                width <= 420 ? 1.78 : width <= 760 ? 1.72 : 1.68,
                width <= 420 ? 6.85 : width <= 760 ? 6.55 : 6.25,
              );
              runtime.camera.lookAt(0, width <= 420 ? 0.12 : 0.13, 0.02);
              runtime.camera.updateProjectionMatrix();
              runtime.setProgress(desiredProgressRef.current);
            };

            resizeObserver = new ResizeObserver(resize);
            resizeObserver.observe(mount);
            resize();

            const didAttach = await loadTreasureChestModel(
              THREE,
              GLTFLoader,
              runtime,
              () => isDisposed,
            );

            if (!didAttach || isDisposed || runtime.isDisposed) {
              return;
            }

            runtime.setProgress(desiredProgressRef.current);
            setWebGlState("ready");
          })
          .catch(() => {
            destroyActiveRuntime();

            if (!isDisposed) {
              setWebGlState("fallback");
            }
          });
      };

      if ("IntersectionObserver" in window) {
        try {
          const verticalMargin = Math.max(
            1,
            Math.round(window.innerHeight * 1.5),
          );

          intersectionObserver = new IntersectionObserver(
            (entries) => {
              if (entries.some((entry) => entry.isIntersecting)) {
                initialize();
              }
            },
            {
              rootMargin: `${verticalMargin}px 0px`,
              threshold: 0,
            },
          );
          intersectionObserver.observe(mount);
        } catch {
          initialize();
        }
      } else {
        initialize();
      }

      return () => {
        isDisposed = true;
        intersectionObserver?.disconnect();
        intersectionObserver = null;
        destroyActiveRuntime();
      };
    }, []);

    return (
      <div
        className={`tools-chest-three is-webgl-${webGlState}`}
        data-webgl-state={webGlState}
      >
        <div className="tools-chest-webgl-mount" ref={mountRef} />
        <div className="tools-chest-css-fallback" aria-hidden="true">
          <span className="tools-chest-css-lid" />
          <span className="tools-chest-css-base" />
          <span className="tools-chest-css-lock" />
        </div>
      </div>
    );
  },
);
