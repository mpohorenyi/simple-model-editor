import * as THREE from 'three';

import { UIComponent } from './UIComponent';
import { PositionChangeEvent, RotationChangeEvent, ScaleChangeEvent } from './events';

/**
 * Manages the object panel UI, handling input changes and updating the object properties.
 */
export class ObjectPanel extends UIComponent {
  private positionInputs: {
    x: HTMLInputElement;
    y: HTMLInputElement;
    z: HTMLInputElement;
  };

  private rotationInputs: {
    x: HTMLInputElement;
    y: HTMLInputElement;
    z: HTMLInputElement;
  };

  private scaleInputs: {
    x: HTMLInputElement;
    y: HTMLInputElement;
    z: HTMLInputElement;
  };

  private objectNameInput: HTMLInputElement;

  constructor() {
    super();

    // Get position inputs
    this.positionInputs = {
      x: document.querySelector('#pos-x') as HTMLInputElement,
      y: document.querySelector('#pos-y') as HTMLInputElement,
      z: document.querySelector('#pos-z') as HTMLInputElement,
    };

    // Get rotation inputs
    this.rotationInputs = {
      x: document.querySelector('#rot-x') as HTMLInputElement,
      y: document.querySelector('#rot-y') as HTMLInputElement,
      z: document.querySelector('#rot-z') as HTMLInputElement,
    };

    // Get scale inputs
    this.scaleInputs = {
      x: document.querySelector('#scale-x') as HTMLInputElement,
      y: document.querySelector('#scale-y') as HTMLInputElement,
      z: document.querySelector('#scale-z') as HTMLInputElement,
    };

    // Get object name input
    this.objectNameInput = document.querySelector('#object-name') as HTMLInputElement;

    this.setupEventListeners();
    this.setupEventBusListeners();
  }

  private setupEventListeners(): void {
    // Position input change events
    Object.values(this.positionInputs).forEach(input => {
      this.addEventListenerWithCleanup(input, 'change', this.handlePositionChange.bind(this));
    });

    // Rotation input change events
    Object.values(this.rotationInputs).forEach(input => {
      this.addEventListenerWithCleanup(input, 'change', this.handleRotationChange.bind(this));
    });

    // Scale input change events
    Object.values(this.scaleInputs).forEach(input => {
      this.addEventListenerWithCleanup(input, 'change', this.handleScaleChange.bind(this));
    });
  }

  private setupEventBusListeners(): void {
    this.eventBus.on('object.selected', this.handleObjectSelected.bind(this));
    this.eventBus.on('object.transformed', this.updateObjectProperties.bind(this));
  }

  private handlePositionChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const axis = input.dataset.axis as 'x' | 'y' | 'z';
    const value = this.validateNumericInput(input);

    const positionEvent: PositionChangeEvent = { axis, value };
    this.eventBus.emit('ui.object.position.change', positionEvent);
  }

  private handleRotationChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const axis = input.dataset.axis as 'x' | 'y' | 'z';
    const degrees = this.validateNumericInput(input);
    const radians = THREE.MathUtils.degToRad(degrees);

    const rotationEvent: RotationChangeEvent = { axis, value: radians };
    this.eventBus.emit('ui.object.rotation.change', rotationEvent);
  }

  private handleScaleChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const axis = input.dataset.axis as 'x' | 'y' | 'z';
    const value = this.validateNumericInput(input, 1);

    const scaleEvent: ScaleChangeEvent = { axis, value };
    this.eventBus.emit('ui.object.scale.change', scaleEvent);
  }

  private updateObjectProperties(object: THREE.Object3D): void {
    // Update name
    this.objectNameInput.value = object.name;

    // Update position inputs
    this.positionInputs.x.value = object.position.x.toFixed(2);
    this.positionInputs.y.value = object.position.y.toFixed(2);
    this.positionInputs.z.value = object.position.z.toFixed(2);

    // Update rotation inputs (convert from radians to degrees)
    this.rotationInputs.x.value = THREE.MathUtils.radToDeg(object.rotation.x).toFixed(2);
    this.rotationInputs.y.value = THREE.MathUtils.radToDeg(object.rotation.y).toFixed(2);
    this.rotationInputs.z.value = THREE.MathUtils.radToDeg(object.rotation.z).toFixed(2);

    // Update scale inputs
    this.scaleInputs.x.value = object.scale.x.toFixed(2);
    this.scaleInputs.y.value = object.scale.y.toFixed(2);
    this.scaleInputs.z.value = object.scale.z.toFixed(2);
  }

  private handleObjectSelected(object: THREE.Object3D): void {
    this.updateObjectProperties(object);
  }

  protected removeEventBusListeners(): void {
    this.eventBus.off('object.selected', this.handleObjectSelected.bind(this));
    this.eventBus.off('object.transformed', this.updateObjectProperties.bind(this));
  }
}
