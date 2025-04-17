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
    ambient: THREE.AmbientLight;
    directional: THREE.DirectionalLight;
    hemisphere: THREE.HemisphereLight;
  };

  private gridHelper: THREE.GridHelper | null = null;
  private axesHelper: THREE.AxesHelper | null = null;

  // Animation state
  private animationFrameId: number | null = null;

  private sceneObjects: Map<string, THREE.Object3D> = new Map();

  private constructor() {
    this.canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement;

    this.eventBus = EventBus.getInstance();

    // Initialize scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1e1f22);

    // Initialize camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
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
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Initialize controls
    this.orbitControls = new OrbitControls(this.camera, this.canvas);
    this.orbitControls.enableDamping = true;

    this.lights = {
      ambient: new THREE.AmbientLight(0xffffff, 0.5),
      directional: new THREE.DirectionalLight(0xffffff, 1),
      hemisphere: new THREE.HemisphereLight(0xffffff, 0x444444, 0.6),
    };

    this.lights.directional.position.set(5, 5, 5);
    this.lights.directional.castShadow = true;

    this.scene.add(this.lights.ambient, this.lights.directional, this.lights.hemisphere);

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
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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
