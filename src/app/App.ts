import { ControlsManager, EnvMapsManager, ImportManager, MaterialManager } from './managers';
import { SceneManager } from './singletons';
import { UIManager } from './ui';

/**
 * Main application class that initializes and connects all components
 */
export class App {
  private sceneManager: SceneManager;
  private controlsManager: ControlsManager;
  private envMapsManager: EnvMapsManager;
  private uiManager: UIManager;
  private importManager: ImportManager;
  private materialManager: MaterialManager;

  constructor() {
    this.sceneManager = SceneManager.getInstance();

    this.uiManager = new UIManager();

    this.controlsManager = new ControlsManager();

    this.envMapsManager = new EnvMapsManager();

    this.importManager = new ImportManager();

    this.materialManager = new MaterialManager();

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
    this.materialManager.dispose();
  }
}
