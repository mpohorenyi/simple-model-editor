import * as THREE from 'three';

import { ControlsManager, EnvMapsManager } from './managers';
import { EventBus, SceneManager } from './singletons';
import { UIManager } from './ui';

/**
 * Main application class that initializes and connects all components
 */
export class App {
  private eventBus: EventBus;
  private sceneManager: SceneManager;
  private controlsManager: ControlsManager;
  private envMapsManager: EnvMapsManager;
  private uiManager: UIManager;

  constructor() {
    this.eventBus = EventBus.getInstance();

    this.sceneManager = SceneManager.getInstance();

    this.uiManager = new UIManager();

    this.controlsManager = new ControlsManager();

    this.envMapsManager = new EnvMapsManager();

    this.createTestCubes();

    console.log('3D Model Editor initialized');
  }

  /**
   * Clean up all resources
   */
  public dispose(): void {
    this.uiManager.dispose();
    this.controlsManager.dispose();
    this.sceneManager.dispose();
    this.envMapsManager.dispose();
  }

  private createTestCubes(): void {
    const group = new THREE.Group();

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x5865f2 });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 0.5, 0);
    cube.castShadow = true;
    cube.receiveShadow = true;
    cube.name = 'TestCube_1';

    const cube2 = cube.clone();
    cube2.name = 'TestCube_2';
    cube2.position.set(2, 0.5, 0);

    const cube3 = cube.clone();
    cube3.name = 'TestCube_3';
    cube3.position.set(0, 0.5, 2);

    group.add(cube, cube2, cube3);

    this.sceneManager.addObject(group);
  }
}
