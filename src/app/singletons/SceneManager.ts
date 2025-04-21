import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

import { EventBus } from './EventBus';

/**
 * SceneManager - Singleton class for managing the 3D scene
 */
export class SceneManager {
  private static instance: SceneManager | null = null;
  private eventBus: EventBus;

  // Three.js components
  private canvas: HTMLCanvasElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private orbitControls: OrbitControls;

  // Scene elements
  private lights: {
    directional: THREE.DirectionalLight;
  };

  private gridHelper: THREE.GridHelper | null = null;
  private axesHelper: THREE.AxesHelper | null = null;

  // Animation state
  private animationFrameId: number | null = null;

  private sceneObjects: Map<string, THREE.Object3D> = new Map();

  private constructor() {
    this.canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement;
    const canvasContainer = document.querySelector('.canvas-container') as HTMLDivElement;

    this.eventBus = EventBus.getInstance();

    // Initialize scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x2b2d31);

    // Initialize camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      canvasContainer.clientWidth / canvasContainer.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(5, 5, 5);
    this.camera.lookAt(0, 0, 0);

    // Initialize renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Initialize controls
    this.orbitControls = new OrbitControls(this.camera, this.canvas);
    this.orbitControls.enableDamping = true;

    this.lights = {
      directional: new THREE.DirectionalLight(0xffffff, 1),
    };

    this.lights.directional.position.set(10, 10, 10);
    this.lights.directional.shadow.mapSize.set(1024, 1024);
    this.lights.directional.shadow.camera.near = 0.5;
    this.lights.directional.shadow.camera.far = 35;
    this.lights.directional.shadow.camera.left = -15;
    this.lights.directional.shadow.camera.right = 15;
    this.lights.directional.shadow.camera.top = 15;
    this.lights.directional.shadow.camera.bottom = -15;
    this.lights.directional.castShadow = true;

    this.scene.add(this.lights.directional);

    this.setupHelpers();

    this.setupEventListeners();

    this.animate();
  }

  /**
   * Get the singleton instance of SceneManager
   */
  public static getInstance(): SceneManager {
    if (!SceneManager.instance) {
      SceneManager.instance = new SceneManager();
    }
    return SceneManager.instance;
  }

  public getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  public getScene(): THREE.Scene {
    return this.scene;
  }

  public getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  public getRenderer(): THREE.WebGLRenderer {
    return this.renderer;
  }

  /**
   * Add object to scene
   */
  public addObject(object: THREE.Object3D): void {
    this.scene.add(object);
    this.sceneObjects.set(object.uuid, object);
    this.eventBus.emit('scene.object.added', object);
  }

  /**
   * Remove object from scene
   */
  public removeObject(object: THREE.Object3D): void {
    this.scene.remove(object);
    this.sceneObjects.delete(object.uuid);
    this.eventBus.emit('scene.object.removed', object);
  }

  public getObjects(): THREE.Object3D[] {
    return Array.from(this.sceneObjects.values());
  }

  /**
   * Dispose scene resources
   */
  public dispose(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }

    window.removeEventListener('resize', this.handleResize.bind(this));

    this.eventBus.off('controls.orbit.enabled', this.handleOrbitControlsToggle.bind(this));

    this.orbitControls.dispose();
    this.renderer.dispose();

    // Clear references
    SceneManager.instance = null;
  }

  private setupEventListeners(): void {
    window.addEventListener('resize', this.handleResize.bind(this));

    this.eventBus.on('controls.orbit.enabled', this.handleOrbitControlsToggle.bind(this));
  }

  private handleResize(): void {
    const canvasContainer = this.canvas.parentElement;

    if (canvasContainer) {
      this.camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
  }

  private handleOrbitControlsToggle(enabled: boolean): void {
    this.orbitControls.enabled = enabled;
  }

  /**
   * Setup scene helpers (grid, axes)
   */
  private setupHelpers(): void {
    this.gridHelper = new THREE.GridHelper();
    this.scene.add(this.gridHelper);

    this.axesHelper = new THREE.AxesHelper();
    this.scene.add(this.axesHelper);
  }

  private animate(): void {
    this.orbitControls.update();

    this.renderer.render(this.scene, this.camera);

    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
  }
}
