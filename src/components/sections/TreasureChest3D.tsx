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
  camera: PerspectiveCamera;
  clipDuration: number;
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

const CHEST_MODEL_URL = `${import.meta.env.BASE_URL}assets/tools-chest/treasure-chest.glb`;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

function disposeMaterial(material: Material) {
  Object.values(material).forEach((value) => {
    const texture = value as Texture | undefined;

    if (texture?.isTexture) {
      texture.dispose();
    }
  });

  material.dispose();
}

function disposeScene(scene: Scene) {
  scene.traverse((object) => {
    const mesh = object as Mesh;

    mesh.geometry?.dispose();

    const material = mesh.material as Material | Material[] | undefined;

    if (Array.isArray(material)) {
      material.forEach(disposeMaterial);
      return;
    }

    if (material) {
      disposeMaterial(material);
    }
  });
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
    camera,
    clipDuration: 0,
    mixer: null,
    modelRoot,
    openingEndTime: 0,
    openingStartTime: 0,
    renderer,
    scene,
    treasureLight,
    render,
    setProgress: (progress: number) => {
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

async function loadTreasureChestModel(
  THREE: ThreeModule,
  GltfLoader: GltfLoaderModule["GLTFLoader"],
  runtime: ChestRuntime,
) {
  const loader = new GltfLoader();
  const gltf = (await loader.loadAsync(CHEST_MODEL_URL)) as LoadedGltf;

  fitModelToStage(THREE, gltf.scene, runtime.modelRoot);
  gltf.scene.traverse((object) => {
    const mesh = object as Mesh;

    mesh.frustumCulled = false;
    mesh.castShadow = false;
    mesh.receiveShadow = false;
  });
  runtime.modelRoot.add(gltf.scene);

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
}

export const TreasureChest3D = forwardRef<TreasureChest3DHandle>(
  function TreasureChest3D(_, ref) {
    const mountRef = useRef<HTMLDivElement>(null);
    const runtimeRef = useRef<ChestRuntime | null>(null);
    const desiredProgressRef = useRef(0);
    const frameRef = useRef<number | null>(null);
    const [hasWebGlFallback, setHasWebGlFallback] = useState(false);

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
      let resizeObserver: ResizeObserver | null = null;

      if (!mount) {
        return undefined;
      }

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      desiredProgressRef.current = reduceMotion
        ? 1
        : desiredProgressRef.current;

      const scheduleRender = () => {
        if (frameRef.current !== null) {
          return;
        }

        frameRef.current = requestAnimationFrame(() => {
          frameRef.current = null;
          runtimeRef.current?.render();
        });
      };

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

          canvas.className = "tools-chest-webgl-canvas";
          canvas.setAttribute("aria-hidden", "true");
          mount.appendChild(canvas);
          runtimeRef.current = runtime;

          const resize = () => {
            const bounds = mount.getBoundingClientRect();
            const width = Math.max(1, bounds.width);
            const height = Math.max(1, bounds.height);
            const maxPixelRatio =
              width <= 380 ? 1.25 : width <= 720 ? 1.5 : 1.75;

            runtime.renderer.setPixelRatio(
              Math.min(window.devicePixelRatio || 1, maxPixelRatio),
            );
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
            scheduleRender();
          };

          resizeObserver = new ResizeObserver(resize);
          resizeObserver.observe(mount);
          resize();

          await loadTreasureChestModel(THREE, GLTFLoader, runtime);

          if (isDisposed) {
            return;
          }

          runtime.setProgress(desiredProgressRef.current);
          scheduleRender();
        })
        .catch(() => {
          if (!isDisposed) {
            setHasWebGlFallback(true);
          }
        });

      return () => {
        isDisposed = true;

        if (frameRef.current !== null) {
          cancelAnimationFrame(frameRef.current);
          frameRef.current = null;
        }

        resizeObserver?.disconnect();

        const runtime = runtimeRef.current;

        if (runtime) {
          disposeScene(runtime.scene);
          runtime.renderer.dispose();
          runtime.renderer.domElement.remove();
          runtimeRef.current = null;
        }
      };
    }, []);

    return (
      <div
        className={`tools-chest-three${
          hasWebGlFallback ? " is-webgl-fallback" : ""
        }`}
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
