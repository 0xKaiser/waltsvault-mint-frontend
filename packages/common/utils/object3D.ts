import * as THREE from 'three';

export function setLayer(object: THREE.Object3D, layer: number) {
  object.layers.set(layer);
  object.traverse(obj => obj.layers.set(layer));
}
