import * as THREE from 'three';

import { ControlsManager } from './managers';
import { EventBus, SceneManager } from './singletons';

/**
 * Main application class that initializes and connects all components
 */
export class App {
  private eventBus: EventBus;
  private sceneManager: SceneManager;
  private controlsManager: ControlsManager;

  constructor() {
    this.eventBus = EventBus.getInstance();

    this.sceneManager = SceneManager.getInstance();

    this.controlsManager = new ControlsManager();

    this.createTestCubes();

    console.log('3D Model Editor initialized');
  }

  /**
   * Clean up all resources
   */
  public dispose(): void {
    this.controlsManager.dispose();
    this.sceneManager.dispose();
  }

  private createTestCubes(): void {
    const group = new THREE.Group();

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x3498db });
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
