import * as THREE from 'three';

import { UIComponent } from './UIComponent';

/**
 * Manages the material panel UI, handling input changes and updating the material properties.
 */
export class MaterialPanel extends UIComponent {
  private materialControls: {
    color: HTMLInputElement;
    opacity: HTMLInputElement;
    transparent: HTMLInputElement;
    opacityDisplay: HTMLElement;
  };

  private textureControls: {
    diffuseToggle: HTMLInputElement;
    normalToggle: HTMLInputElement;
    diffuseButton: HTMLButtonElement;
    normalButton: HTMLButtonElement;
    diffuseFileInput: HTMLInputElement;
    normalFileInput: HTMLInputElement;
  };

  constructor() {
    super();

    // Get material controls
    this.materialControls = {
      color: document.querySelector('#material-color') as HTMLInputElement,
      opacity: document.querySelector('#material-opacity') as HTMLInputElement,
      transparent: document.querySelector('#material-transparent') as HTMLInputElement,
      opacityDisplay: document.querySelector('#material-opacity-display') as HTMLElement,
    };

    // Get texture controls
    this.textureControls = {
      diffuseToggle: document.querySelector('#diffuse-map-toggle') as HTMLInputElement,
      normalToggle: document.querySelector('#normal-map-toggle') as HTMLInputElement,
      diffuseButton: document.querySelector('#diffuse-map-btn') as HTMLButtonElement,
      normalButton: document.querySelector('#normal-map-btn') as HTMLButtonElement,
      diffuseFileInput: document.querySelector('#diffuse-map-input') as HTMLInputElement,
      normalFileInput: document.querySelector('#normal-map-input') as HTMLInputElement,
    };

    this.setupEventListeners();
    this.setupEventBusListeners();
  }

  private setupEventListeners(): void {
    // Material controls
    this.addEventListenerWithCleanup(
      this.materialControls.color,
      'input',
      this.handleMaterialColorChange.bind(this)
    );
    this.addEventListenerWithCleanup(
      this.materialControls.opacity,
      'input',
      this.handleMaterialOpacityChange.bind(this)
    );
    this.addEventListenerWithCleanup(
      this.materialControls.transparent,
      'change',
      this.handleMaterialTransparentChange.bind(this)
    );

    // Texture toggles
    this.addEventListenerWithCleanup(
      this.textureControls.diffuseToggle,
      'change',
      this.handleDiffuseMapToggle.bind(this)
    );
    this.addEventListenerWithCleanup(
      this.textureControls.normalToggle,
      'change',
      this.handleNormalMapToggle.bind(this)
    );

    // Texture buttons
    this.addEventListenerWithCleanup(
      this.textureControls.diffuseButton,
      'click',
      this.handleDiffuseButtonClick.bind(this)
    );
    this.addEventListenerWithCleanup(
      this.textureControls.normalButton,
      'click',
      this.handleNormalButtonClick.bind(this)
    );

    // File inputs
    this.addEventListenerWithCleanup(
      this.textureControls.diffuseFileInput,
      'change',
      this.handleDiffuseFileChange.bind(this)
    );
    this.addEventListenerWithCleanup(
      this.textureControls.normalFileInput,
      'change',
      this.handleNormalFileChange.bind(this)
    );
  }

  private setupEventBusListeners(): void {
    this.eventBus.on('material.updated', this.updateMaterialProperties.bind(this));
  }

  private handleMaterialColorChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const color = new THREE.Color(input.value);
    this.eventBus.emit('ui.material.color.change', color);
  }

  private handleMaterialOpacityChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const opacity = parseFloat(input.value);
    this.materialControls.opacityDisplay.textContent = opacity.toFixed(2);
    this.eventBus.emit('ui.material.opacity.change', opacity);
  }

  private handleMaterialTransparentChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const transparent = input.checked;
    this.eventBus.emit('ui.material.transparent.change', transparent);
  }

  private handleDiffuseMapToggle(event: Event): void {
    const input = event.target as HTMLInputElement;
    const enabled = input.checked;
    this.eventBus.emit('ui.material.diffuse.toggle', enabled);
  }

  private handleNormalMapToggle(event: Event): void {
    const input = event.target as HTMLInputElement;
    const enabled = input.checked;
    this.eventBus.emit('ui.material.normal.toggle', enabled);
  }

  private handleDiffuseButtonClick(): void {
    this.textureControls.diffuseFileInput.click();
  }

  private handleNormalButtonClick(): void {
    this.textureControls.normalFileInput.click();
  }

  private handleDiffuseFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (files && files.length > 0) {
      this.eventBus.emit('ui.material.diffuse.file', files[0]);
      input.value = '';
    }
  }

  private handleNormalFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (files && files.length > 0) {
      this.eventBus.emit('ui.material.normal.file', files[0]);
      input.value = '';
    }
  }

  private updateMaterialProperties(materialData: {
    color?: string;
    opacity?: number;
    transparent?: boolean;
    hasDiffuseMap?: boolean;
    hasNormalMap?: boolean;
  }): void {
    if (materialData.color !== undefined) {
      this.materialControls.color.value = materialData.color;
    }

    if (materialData.opacity !== undefined) {
      this.materialControls.opacity.value = materialData.opacity.toString();
      this.materialControls.opacityDisplay.textContent = materialData.opacity.toFixed(2);
    }

    if (materialData.transparent !== undefined) {
      this.materialControls.transparent.checked = materialData.transparent;
    }

    if (materialData.hasDiffuseMap !== undefined) {
      this.textureControls.diffuseToggle.checked = materialData.hasDiffuseMap;
    }

    if (materialData.hasNormalMap !== undefined) {
      this.textureControls.normalToggle.checked = materialData.hasNormalMap;
    }
  }

  protected removeEventBusListeners(): void {
    this.eventBus.off('material.updated', this.updateMaterialProperties.bind(this));
  }
}
