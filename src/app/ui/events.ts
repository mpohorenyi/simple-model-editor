import * as THREE from 'three';

export interface PositionChangeEvent {
  axis: 'x' | 'y' | 'z';
  value: number;
}

export interface RotationChangeEvent {
  axis: 'x' | 'y' | 'z';
  value: number; // in radians
}

export interface ScaleChangeEvent {
  axis: 'x' | 'y' | 'z';
  value: number;
}

export interface EnvironmentMapEvent {
  name?: string;
  isBackgroundVisible?: boolean;
}

export interface ObjectEvent {
  object: THREE.Object3D;
}
