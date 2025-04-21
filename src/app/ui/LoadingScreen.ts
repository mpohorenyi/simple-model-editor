import { UIComponent } from './UIComponent';

/**
 * LoadingScreen - UI component for managing the loading screen
 */
export class LoadingScreen extends UIComponent {
  private loadingOverlay: HTMLElement;

  constructor() {
    super();

    this.loadingOverlay = document.querySelector('.loading-overlay') as HTMLElement;

    this.setupEventBusListeners();
  }

  private setupEventBusListeners(): void {
    this.eventBus.on('loadingManager.load.start', this.handleLoadingStart.bind(this));
    this.eventBus.on('loadingManager.load.complete', this.handleLoadingComplete.bind(this));
  }

  private handleLoadingStart(): void {
    this.loadingOverlay.style.display = 'flex';
  }

  private handleLoadingComplete(): void {
    this.loadingOverlay.style.display = 'none';
  }

  protected removeEventBusListeners(): void {
    this.eventBus.off('loadingManager.load.start', this.handleLoadingStart.bind(this));
    this.eventBus.off('loadingManager.load.complete', this.handleLoadingComplete.bind(this));
  }
}
