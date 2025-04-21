import * as THREE from 'three';

export interface ObjectChangeEvent {
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
