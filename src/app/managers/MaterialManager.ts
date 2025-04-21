import * as THREE from 'three';

import { EventBus, LoadingManager } from '../singletons';

interface MaterialTextures {
  diffuse: THREE.Texture | null;
  normal: THREE.Texture | null;
}

/**
 * MaterialManager - A class for managing object materials
 */
export class MaterialManager {
  private eventBus: EventBus;
  private loadingManager: LoadingManager;
  private textureLoader: THREE.TextureLoader;

  private selectedMaterial: THREE.Material | null = null;

  // Store textures for each material by UUID
  private materialTextures: Map<string, MaterialTextures> = new Map();

  constructor() {
    this.eventBus = EventBus.getInstance();
    this.loadingManager = LoadingManager.getInstance();
    this.textureLoader = new THREE.TextureLoader(this.loadingManager.getThreeLoadingManager());

    this.setupEventBusListeners();
  }

  private setupEventBusListeners(): void {
    this.eventBus.on('object.selected', this.handleObjectSelected.bind(this));
    this.eventBus.on('object.deselected', this.handleObjectDeselected.bind(this));

    this.eventBus.on('ui.material.color.change', this.handleMaterialColorChange.bind(this));
    this.eventBus.on('ui.material.opacity.change', this.handleMaterialOpacityChange.bind(this));
    this.eventBus.on(
      'ui.material.transparent.change',
      this.handleMaterialTransparentChange.bind(this)
    );
    this.eventBus.on('ui.material.diffuse.toggle', this.handleDiffuseMapToggle.bind(this));
    this.eventBus.on('ui.material.normal.toggle', this.handleNormalMapToggle.bind(this));
    this.eventBus.on('ui.material.diffuse.file', this.handleDiffuseFileChange.bind(this));
    this.eventBus.on('ui.material.normal.file', this.handleNormalFileChange.bind(this));
  }

  /**
   * Gets or creates a texture record for a material
   */
  private getTexturesForMaterial(material: THREE.Material): {
    diffuse: THREE.Texture | null;
    normal: THREE.Texture | null;
  } {
    const uuid = material.uuid;

    if (!this.materialTextures.has(uuid)) {
      const textures: MaterialTextures = { diffuse: null, normal: null };

      if (this.isMaterialWithMap(material) && material.map) {
        textures.diffuse = material.map;
      }

      if (this.isMaterialWithNormalMap(material) && material.normalMap) {
        textures.normal = material.normalMap;
      }

      this.materialTextures.set(uuid, textures);
    }

    return this.materialTextures.get(uuid)!;
  }

  /**
   * Checks if the material supports diffuse texture map
   */
  private isMaterialWithMap(
    material: THREE.Material
  ): material is
    | THREE.MeshStandardMaterial
    | THREE.MeshPhongMaterial
    | THREE.MeshBasicMaterial
    | THREE.MeshLambertMaterial
    | THREE.MeshToonMaterial
    | THREE.MeshPhysicalMaterial {
    return (
      material instanceof THREE.MeshStandardMaterial ||
      material instanceof THREE.MeshPhongMaterial ||
      material instanceof THREE.MeshBasicMaterial ||
      material instanceof THREE.MeshLambertMaterial ||
      material instanceof THREE.MeshToonMaterial ||
      material instanceof THREE.MeshPhysicalMaterial
    );
  }

  /**
   * Checks if the material supports normal texture map
   */
  private isMaterialWithNormalMap(
    material: THREE.Material
  ): material is
    | THREE.MeshStandardMaterial
    | THREE.MeshPhongMaterial
    | THREE.MeshLambertMaterial
    | THREE.MeshToonMaterial
    | THREE.MeshPhysicalMaterial {
    return (
      (material instanceof THREE.MeshStandardMaterial ||
        material instanceof THREE.MeshPhongMaterial ||
        material instanceof THREE.MeshLambertMaterial ||
        material instanceof THREE.MeshToonMaterial ||
        material instanceof THREE.MeshPhysicalMaterial) &&
      !(material instanceof THREE.MeshBasicMaterial)
    );
  }

  private handleObjectSelected(object: THREE.Object3D): void {
    if (object instanceof THREE.Mesh) {
      let material: THREE.Material | null = null;

      if (Array.isArray(object.material)) {
        material = object.material[0];
      } else {
        material = object.material;
      }

      if (material) {
        this.selectedMaterial = material;
        this.updateMaterialPanel(material);
      }
    }
  }

  private handleObjectDeselected(): void {
    this.selectedMaterial = null;
  }

  private updateMaterialPanel(material: THREE.Material): void {
    if (this.isMaterialWithMap(material)) {
      const materialData = {
        color: '#' + material.color.getHexString(),
        opacity: material.opacity,
        transparent: material.transparent,
        hasDiffuseMap: !!material.map,
        hasNormalMap: false,
      };

      if (this.isMaterialWithNormalMap(material)) {
        materialData.hasNormalMap = !!material.normalMap;
      }

      // Ensure we have textures for this material
      this.getTexturesForMaterial(material);

      this.eventBus.emit('material.updated', materialData);
    }
  }

  private handleMaterialColorChange(color: THREE.Color): void {
    if (this.selectedMaterial) {
      if (this.isMaterialWithMap(this.selectedMaterial)) {
        this.selectedMaterial.color = color;
        this.selectedMaterial.needsUpdate = true;
      }
    }
  }

  private handleMaterialOpacityChange(opacity: number): void {
    if (this.selectedMaterial) {
      this.selectedMaterial.opacity = opacity;
      this.selectedMaterial.needsUpdate = true;
    }
  }

  private handleMaterialTransparentChange(transparent: boolean): void {
    if (this.selectedMaterial) {
      this.selectedMaterial.transparent = transparent;
      this.selectedMaterial.needsUpdate = true;
    }
  }

  private handleDiffuseMapToggle(enabled: boolean): void {
    if (this.selectedMaterial && this.isMaterialWithMap(this.selectedMaterial)) {
      const textures = this.getTexturesForMaterial(this.selectedMaterial);

      if (enabled && textures.diffuse) {
        this.selectedMaterial.map = textures.diffuse;
      } else {
        this.selectedMaterial.map = null;
      }

      this.selectedMaterial.needsUpdate = true;
    }
  }

  private handleNormalMapToggle(enabled: boolean): void {
    if (this.selectedMaterial && this.isMaterialWithNormalMap(this.selectedMaterial)) {
      const textures = this.getTexturesForMaterial(this.selectedMaterial);

      if (enabled && textures.normal) {
        this.selectedMaterial.normalMap = textures.normal;
      } else {
        this.selectedMaterial.normalMap = null;
      }

      this.selectedMaterial.needsUpdate = true;
    }
  }

  private handleDiffuseFileChange(file: File): void {
    if (!this.selectedMaterial || !this.isMaterialWithMap(this.selectedMaterial)) {
      return;
    }

    const textureUrl = URL.createObjectURL(file);
    const textures = this.getTexturesForMaterial(this.selectedMaterial);

    this.textureLoader.load(textureUrl, texture => {
      textures.diffuse?.dispose();
      textures.diffuse = texture;

      // Check if the material supports diffuse texture map
      if (this.selectedMaterial && this.isMaterialWithMap(this.selectedMaterial)) {
        const material = this.selectedMaterial;
        material.map = texture;
        material.needsUpdate = true;

        this.updateMaterialPanel(material);
      }
    });
  }

  private handleNormalFileChange(file: File): void {
    if (!this.selectedMaterial || !this.isMaterialWithNormalMap(this.selectedMaterial)) {
      return;
    }

    const textureUrl = URL.createObjectURL(file);
    const textures = this.getTexturesForMaterial(this.selectedMaterial);

    this.textureLoader.load(textureUrl, texture => {
      textures.normal?.dispose();
      textures.normal = texture;

      // Check if the material supports normal texture map
      if (this.selectedMaterial && this.isMaterialWithNormalMap(this.selectedMaterial)) {
        const material = this.selectedMaterial;
        material.normalMap = texture;
        material.needsUpdate = true;

        this.updateMaterialPanel(material);
      }
    });
  }

  public dispose(): void {
    this.eventBus.off('object.selected', this.handleObjectSelected.bind(this));
    this.eventBus.off('object.deselected', this.handleObjectDeselected.bind(this));
    this.eventBus.off('ui.material.color.change', this.handleMaterialColorChange.bind(this));
    this.eventBus.off('ui.material.opacity.change', this.handleMaterialOpacityChange.bind(this));
    this.eventBus.off(
      'ui.material.transparent.change',
      this.handleMaterialTransparentChange.bind(this)
    );
    this.eventBus.off('ui.material.diffuse.toggle', this.handleDiffuseMapToggle.bind(this));
    this.eventBus.off('ui.material.normal.toggle', this.handleNormalMapToggle.bind(this));
    this.eventBus.off('ui.material.diffuse.file', this.handleDiffuseFileChange.bind(this));
    this.eventBus.off('ui.material.normal.file', this.handleNormalFileChange.bind(this));

    this.materialTextures.forEach(textures => {
      if (textures.diffuse) {
        textures.diffuse.dispose();
      }
      if (textures.normal) {
        textures.normal.dispose();
      }
    });
    this.materialTextures.clear();
  }
}
