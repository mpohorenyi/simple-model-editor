import { EnvironmentMapsManager } from './EnvironmentMapsManager';
import { ImportManager } from './ImportManager';
import { MaterialPanelManager } from './MaterialPanelManager';
import { ObjectPanelManager } from './ObjectPanelManager';
import { TabManager } from './TabManager';

/**
 * UIManager - Coordinates all UI components and their interactions
 */
export class UIManager {
  private objectPanel: ObjectPanelManager;
  private materialPanel: MaterialPanelManager;
  private tabManager: TabManager;
  private importManager: ImportManager;
  private environmentMapsManager: EnvironmentMapsManager;

  constructor() {
    // Initialize all UI components
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
    this.objectPanel.dispose();
    this.materialPanel.dispose();
    this.tabManager.dispose();
    this.importManager.dispose();
    this.environmentMapsManager.dispose();
  }
}
