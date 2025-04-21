import { EnvMapsPanel } from './EnvMapsPanel';
import { Import } from './Import';
import { LoadingScreen } from './LoadingScreen';
import { MaterialPanel } from './MaterialPanel';
import { ObjectPanel } from './ObjectPanel';
import { Tabs } from './Tabs';

/**
 * UIManager - Coordinates all UI components and their interactions
 */
export class UIManager {
  private loadingScreen: LoadingScreen;
  private objectPanel: ObjectPanel;
  private materialPanel: MaterialPanel;
  private tabs: Tabs;
  private import: Import;
  private envMapsPanel: EnvMapsPanel;

  constructor() {
    // Initialize all UI components
    this.loadingScreen = new LoadingScreen();
    this.objectPanel = new ObjectPanel();
    this.materialPanel = new MaterialPanel();
    this.tabs = new Tabs();
    this.import = new Import();
    this.envMapsPanel = new EnvMapsPanel();
  }

  /**
   * Clean up resources
   */
  public dispose(): void {
    this.loadingScreen.dispose();
    this.objectPanel.dispose();
    this.materialPanel.dispose();
    this.tabs.dispose();
    this.import.dispose();
    this.envMapsPanel.dispose();
  }
}
