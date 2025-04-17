import * as THREE from 'three';
import { TransformControls } from 'three/examples/jsm/Addons.js';

import { EventBus, SceneManager } from '../singletons';
import { TransformMode } from '../types';

/**
 * ControlsManager - Manages the transform controls for manipulating objects in the scene
 */
export class ControlsManager {
  private sceneManager: SceneManager;
  private eventBus: EventBus;

  private transformControls: TransformControls;

  private selectedObject: THREE.Object3D | null = null;
  private transformMode: TransformMode = TransformMode.TRANSLATE;
  private raycaster: THREE.Raycaster;
  private pointer: THREE.Vector2;

  private mouseState = {
    startPosition: { x: 0, y: 0 },
    hasMoved: false,
    threshold: 5,
  };

  constructor() {
    this.eventBus = EventBus.getInstance();
    this.sceneManager = SceneManager.getInstance();

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();

    this.transformControls = new TransformControls(
      this.sceneManager.getCamera(),
      this.sceneManager.getCanvas()
    );

    this.transformControls.setSize(0.5);
    this.sceneManager.getScene().add(this.transformControls.getHelper());

    this.setupEventListeners();
  }

  /**
   * Setup event listeners for transform controls
   */
  private setupEventListeners(): void {
    const canvas = this.sceneManager.getCanvas();
    const transformControls = this.transformControls;

    transformControls.addEventListener('dragging-changed', this.handleDraggingChanged.bind(this));
    transformControls.addEventListener('objectChange', this.handleObjectChanged.bind(this));

    window.addEventListener('keydown', this.handleKeyDown.bind(this));

    canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
    canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
  }

  /**
   * Handle dragging changed event from transform controls
   */
  private handleDraggingChanged(event: { value: unknown }): void {
    // Disable orbit controls while dragging
    this.eventBus.emit('controls.orbit.enabled', !event.value);
  }

  /**
   * Handle object changed event from transform controls
   */
  private handleObjectChanged(): void {
    if (this.selectedObject) {
      this.eventBus.emit('object.transformed', this.selectedObject);
    }
  }

  private handleMouseDown(event: MouseEvent): void {
    this.mouseState.startPosition = { x: event.clientX, y: event.clientY };
    this.mouseState.hasMoved = false;
  }

  private handleMouseMove(event: MouseEvent): void {
    const dx = Math.abs(event.clientX - this.mouseState.startPosition.x);
    const dy = Math.abs(event.clientY - this.mouseState.startPosition.y);

    if (dx > this.mouseState.threshold || dy > this.mouseState.threshold) {
      this.mouseState.hasMoved = true;
    }
  }

  private handleMouseUp(event: MouseEvent): void {
    if (!this.mouseState.hasMoved) {
      this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

      this.raycaster.setFromCamera(this.pointer, this.sceneManager.getCamera());

      const intersects = this.raycaster.intersectObjects(this.sceneManager.getObjects());

      if (intersects.length > 0) {
        const selectedObject = intersects[0].object;
        this.selectObject(selectedObject);
      } else {
        this.deselectObject();
      }
    }
  }

  /**
   * Handle keyboard shortcuts for transform controls
   */
  private handleKeyDown(event: KeyboardEvent): void {
    if (!this.selectedObject) return;

    switch (event.code) {
      case 'KeyW':
        this.setMode(TransformMode.TRANSLATE);
        break;
      case 'KeyE':
        this.setMode(TransformMode.ROTATE);
        break;
      case 'KeyR':
        this.setMode(TransformMode.SCALE);
        break;
    }
  }

  /**
   * Set transform mode (translate, rotate, scale)
   */
  public setMode(mode: TransformMode): void {
    this.transformMode = mode;
    this.transformControls.setMode(mode);
    this.eventBus.emit('controls.transform.mode.changed', mode);
  }

  public selectObject(object: THREE.Object3D): void {
    if (this.selectedObject) {
      this.deselectObject();
    }

    this.selectedObject = object;
    this.transformControls.attach(object);

    this.eventBus.emit('object.selected', object);
  }

  public deselectObject(): void {
    if (this.selectedObject) {
      this.transformControls.detach();
      const deselectedObject = this.selectedObject;
      this.selectedObject = null;

      this.eventBus.emit('object.deselected', deselectedObject);
    }
  }

  public getSelectedObject(): THREE.Object3D | null {
    return this.selectedObject;
  }

  /**
   * Clean up resources
   */
  public dispose(): void {
    const canvas = this.sceneManager.getCanvas();

    this.transformControls.dispose();
    window.removeEventListener('keydown', this.handleKeyDown.bind(this));

    canvas.removeEventListener('mousedown', this.handleMouseDown.bind(this));
    canvas.removeEventListener('mousemove', this.handleMouseMove.bind(this));
    canvas.removeEventListener('mouseup', this.handleMouseUp.bind(this));
  }
}
