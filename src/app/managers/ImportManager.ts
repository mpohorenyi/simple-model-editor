import * as THREE from 'three';
import { DRACOLoader, FBXLoader, GLTFLoader } from 'three/examples/jsm/Addons.js';

import { EventBus, LoadingManager, SceneManager } from '../singletons';

/**
 * ImportManager - Class for loading and managing 3D models
 */
export class ImportManager {
  private eventBus: EventBus;
  private sceneManager: SceneManager;
  private loadingManager: LoadingManager;

  private gltfLoader: GLTFLoader;
  private DRACOLoader: DRACOLoader;
  private fbxLoader: FBXLoader;

  constructor() {
    this.eventBus = EventBus.getInstance();
    this.sceneManager = SceneManager.getInstance();
    this.loadingManager = LoadingManager.getInstance();

    const threeLoadingManager = this.loadingManager.getThreeLoadingManager();

    this.DRACOLoader = new DRACOLoader(threeLoadingManager);
    this.DRACOLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');

    this.gltfLoader = new GLTFLoader(threeLoadingManager);
    this.gltfLoader.setDRACOLoader(this.DRACOLoader);

    this.fbxLoader = new FBXLoader(threeLoadingManager);

    this.setupEventBusListeners();
  }

  private setupEventBusListeners(): void {
    this.eventBus.on('ui.model.import', this.handleModelImport.bind(this));
  }

  private handleModelImport(file: File): void {
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';

    const fileURL = URL.createObjectURL(file);

    switch (fileExtension) {
      case 'gltf':
      case 'glb':
        this.loadGLTFModel(fileURL);
        break;
      case 'fbx':
        this.loadFBXModel(fileURL);
        break;
      default:
        console.error(`Unsupported file format: ${fileExtension}`);
    }
  }

  private loadGLTFModel(url: string): void {
    this.gltfLoader.load(url, gltf => {
      const model = gltf.scene;
      this.processLoadedModel(model);
    });
  }

  private loadFBXModel(url: string): void {
    this.fbxLoader.load(url, model => {
      this.processLoadedModel(model);
    });
  }

  private processLoadedModel(model: THREE.Object3D): void {
    model.traverse(child => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    this.scaleModel(model);

    this.sceneManager.addObject(model);
  }

  private scaleModel(model: THREE.Object3D): void {
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    if (maxDim > 10) {
      const scale = 10 / maxDim;
      model.scale.multiplyScalar(scale);
    }
  }

  public dispose(): void {
    this.eventBus.off('ui.model.import', this.handleModelImport.bind(this));
  }
}
