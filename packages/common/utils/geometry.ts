import * as THREE from 'three';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';

export function sampleMesh(
  sampler: MeshSurfaceSampler,
  vertices: Float32Array,
  numberOfParticles: number,
  spread = 0,
  normals?: Float32Array,
) {
  const vec3 = new THREE.Vector3();
  const normal = new THREE.Vector3();
  for (let i = 0; i < numberOfParticles; i += 1) {
    sampler.sample(vec3, normal);

    const { x, y, z } = vec3;

    vertices.set(
      [
        x + (1 - Math.random() * 2) * spread,
        y + (1 - Math.random() * 2) * spread,
        z + (1 - Math.random() * 2) * spread,
      ],
      i * 3,
    );
    normals?.set([normal.x, normal.y, normal.z], i * 3);
  }
}
