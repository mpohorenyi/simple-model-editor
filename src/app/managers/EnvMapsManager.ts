import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/Addons.js';

import { EventBus, LoadingManager, SceneManager } from '../singletons';
import { EnvironmentMapEvent } from '../ui';

export class EnvMapsManager {
  private eventBus: EventBus;
  private sceneManager: SceneManager;
  private loadingManager: LoadingManager;

  private rgbeLoader: RGBELoader;

  private envMaps: Map<string, THREE.Texture> = new Map();
  private selectedEnvMap: string | null = null;

  private defaultEnvMaps = [
    { name: 'studio_small_09', src: './envmaps/studio_small_09.hdr' },
    { name: 'rainforest_trail', src: './envmaps/rainforest_trail.hdr' },
    { name: 'rogland_clear_night', src: './envmaps/rogland_clear_night.hdr' },
  ];

  constructor() {
    this.eventBus = EventBus.getInstance();
    this.sceneManager = SceneManager.getInstance();
    this.loadingManager = LoadingManager.getInstance();

    this.rgbeLoader = new RGBELoader(this.loadingManager.getThreeLoadingManager());

    this.loadDefaultEnvironmentMaps();

    this.setupEventBusListeners();
  }

  private setupEventBusListeners(): void {
    this.eventBus.on('ui.environment.map.selected', this.handleEnvironmentMapSelected.bind(this));
    this.eventBus.on(
      'ui.environment.map.background.toggle',
      this.handleEnvironmentBackgroundToggle.bind(this)
    );
  }

  private handleEnvironmentMapSelected(event: EnvironmentMapEvent): void {
    const { name, isBackgroundVisible } = event;

    if (!name) {
      console.error('Environment map name or source not found');
      return;
    }

    this.setEnvironmentMap(name, isBackgroundVisible);
  }

  private handleEnvironmentBackgroundToggle(visible: boolean): void {
    if (!this.selectedEnvMap) {
      console.error('No environment map selected');
      return;
    }

    const scene = this.sceneManager.getScene();

    if (visible) {
      scene.background = this.envMaps.get(this.selectedEnvMap)!;
    } else {
      scene.background = new THREE.Color(0x2b2d31);
    }
  }

  private loadEnvironmentMap(
    name: string,
    src: string,
    onLoad?: (texture: THREE.Texture) => void
  ): void {
    this.rgbeLoader.load(src, texture => {
      texture.mapping = THREE.EquirectangularReflectionMapping;

      this.envMaps.set(name, texture);

      if (onLoad) {
        onLoad(texture);
      }
    });
  }

  private loadDefaultEnvironmentMaps(): void {
    this.defaultEnvMaps.forEach(({ name, src }) => {
      if (name === 'studio_small_09') {
        this.loadEnvironmentMap(name, src, () => {
          this.selectedEnvMap = name;
          this.setEnvironmentMap(name);
        });
      } else {
        this.loadEnvironmentMap(name, src);
      }
    });
  }

  private setEnvironmentMap(name: string, isBackgroundVisible?: boolean): void {
    if (!this.envMaps.has(name)) {
      console.error(`Environment map "${name}" not found`);
      return;
    }

    const scene = this.sceneManager.getScene();
    const envMap = this.envMaps.get(name)!;

    scene.environment = envMap;
    this.selectedEnvMap = name;

    if (isBackgroundVisible) {
      scene.background = envMap;
    }
  }

  public dispose(): void {
    this.eventBus.off('ui.environment.map.selected', this.handleEnvironmentMapSelected.bind(this));

    this.envMaps.forEach(texture => texture.dispose());
    this.envMaps.clear();
  }
}
