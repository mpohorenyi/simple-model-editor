import * as THREE from 'three';

import { EventBus } from './EventBus';

/**
 * LoadingManager - Singleton class for managing resource loading
 */
export class LoadingManager {
  private static instance: LoadingManager | null = null;
  private eventBus: EventBus;

  private loadingManager: THREE.LoadingManager;

  private isLoading: boolean = false;

  private constructor() {
    this.eventBus = EventBus.getInstance();
    this.loadingManager = new THREE.LoadingManager();

    this.setupLoadingManager();
  }

  /**
   * Get the singleton instance of LoadingManager
   */
  public static getInstance(): LoadingManager {
    if (!LoadingManager.instance) {
      LoadingManager.instance = new LoadingManager();
    }

    return LoadingManager.instance;
  }

  public getThreeLoadingManager(): THREE.LoadingManager {
    return this.loadingManager;
  }

  /**
   * Check if a loading operation is currently in progress
   */
  public isLoadingInProgress(): boolean {
    return this.isLoading;
  }

  private setupLoadingManager(): void {
    this.loadingManager.onStart = () => {
      this.isLoading = true;

      this.eventBus.emit('loadingManager.load.start');
    };

    this.loadingManager.onLoad = () => {
      this.isLoading = false;

      this.eventBus.emit('loadingManager.load.complete');
    };

    this.loadingManager.onError = url => {
      const error = new Error(`Failed to load resource from: ${url}`);

      this.eventBus.emit('loadingManager.load.error', error);
    };
  }
}
