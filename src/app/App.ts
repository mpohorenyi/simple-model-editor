import * as THREE from 'three';

import { ControlsManager, EnvMapsManager, ImportManager } from './managers';
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
  private importManager: ImportManager;

  constructor() {
    this.eventBus = EventBus.getInstance();

    this.sceneManager = SceneManager.getInstance();

    this.uiManager = new UIManager();

    this.controlsManager = new ControlsManager();

    this.envMapsManager = new EnvMapsManager();

    this.importManager = new ImportManager();

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
    this.importManager.dispose();
  }
}
