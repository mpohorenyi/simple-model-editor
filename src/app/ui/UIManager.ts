import { EnvironmentMapsManager } from './EnvironmentMapsManager';
import { ImportManager } from './ImportManager';
import { LoadingScreenManager } from './LoadingScreenManager';
import { MaterialPanelManager } from './MaterialPanelManager';
import { ObjectPanelManager } from './ObjectPanelManager';
import { TabManager } from './TabManager';

/**
 * UIManager - Coordinates all UI components and their interactions
 */
export class UIManager {
  private loadingScreenManager: LoadingScreenManager;
  private objectPanel: ObjectPanelManager;
  private materialPanel: MaterialPanelManager;
  private tabManager: TabManager;
  private importManager: ImportManager;
  private environmentMapsManager: EnvironmentMapsManager;

  constructor() {
    // Initialize all UI components
    this.loadingScreenManager = new LoadingScreenManager();
    this.objectPanel = new ObjectPanelManager();
    this.materialPanel = new MaterialPanelManager();
    this.tabManager = new TabManager();
    this.importManager = new ImportManager();
    this.environmentMapsManager = new EnvironmentMapsManager();
  }

  /**
   * Clean up resources
   */
  public dispose(): void {
    this.loadingScreenManager.dispose();
    this.objectPanel.dispose();
    this.materialPanel.dispose();
    this.tabManager.dispose();
    this.importManager.dispose();
    this.environmentMapsManager.dispose();
  }
}
