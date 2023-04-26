import * as THREE from 'three';

import IMG_GLOWING_PARTICLE_2 from '../assets/images/glowing-particle-1.png';
import particlesFragmentShader from '../shaders/particles.fragment.glsl';
import particlesVertexShader from '../shaders/particles.vertex.glsl';

export interface ParticlesConfig {
  particlesVertices: Float32Array;
  morphVertices?: Float32Array;
  particleSize?: number;
  shaderMaterialParameters?: THREE.ShaderMaterialParameters;
  shineColor?: number | THREE.Color;
  color?: number | THREE.Color;
  secondaryColor?: number | THREE.Color;
  opacity?: number;
  boundingSphereMesh?: THREE.Mesh;
}

export default class Particles extends THREE.Object3D {
  mesh: THREE.Mesh;

  geometry: THREE.InstancedBufferGeometry;

  particlePlaneGeometry: THREE.PlaneBufferGeometry;

  particleMaterial: THREE.ShaderMaterial;

  textureLoader: THREE.TextureLoader;

  constructor(config: ParticlesConfig) {
    super();
    const {
      particlesVertices,
      morphVertices,
      particleSize = 0.02,
      shaderMaterialParameters = {},
      shineColor = 0xffffff,
      color = 0xffffff,
      opacity = 1,
      secondaryColor = 0xffffff,
      boundingSphereMesh,
    } = config ?? {};

    this.textureLoader = new THREE.TextureLoader();

    this.particlePlaneGeometry = new THREE.PlaneBufferGeometry(1, 1);
    this.geometry = new THREE.InstancedBufferGeometry();
    this.geometry.index = this.particlePlaneGeometry.index;

    this.geometry.setAttribute('position', this.particlePlaneGeometry.getAttribute('position'));
    this.geometry.setAttribute('uv', this.particlePlaneGeometry.getAttribute('uv'));
    this.geometry.setAttribute('pos', new THREE.InstancedBufferAttribute(particlesVertices, 3));

    this.geometry.setAttribute(
      'morphTarget',
      new THREE.InstancedBufferAttribute(morphVertices ?? new Float32Array(particlesVertices.length), 3),
    );

    this.particleMaterial = new THREE.ShaderMaterial({
      transparent: true,
      alphaTest: 0.01,
      side: THREE.DoubleSide,
      vertexShader: particlesVertexShader,
      fragmentShader: particlesFragmentShader,
      depthTest: false,
      ...shaderMaterialParameters,
      uniforms: {
        opacity: { value: opacity },
        shineColor: { value: new THREE.Color(shineColor) },
        color: { value: new THREE.Color(color) },
        map: { value: this.textureLoader.load(IMG_GLOWING_PARTICLE_2) },
        morphInfluence: { value: 0 },
        particleSize: { value: particleSize },
        secondaryColor: { value: new THREE.Color(secondaryColor) },
        ...shaderMaterialParameters.uniforms,
      },
    });

    this.mesh = new THREE.Mesh(this.geometry, this.particleMaterial);
    this.position.set(0, 0, 0);
    this.add(this.mesh);

    if (boundingSphereMesh) this.updateBoundingSphere(boundingSphereMesh);
    this.geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0), 10000);
  }

  setMorphTarget(vertices: Float32Array) {
    this.geometry.setAttribute('morphTarget', new THREE.InstancedBufferAttribute(vertices, 3));
  }

  setMorphInfluence(influence: number) {
    this.particleMaterial.uniforms.morphInfluence.value = influence;
  }

  updateBoundingSphere(mesh: THREE.Mesh) {
    mesh.geometry.computeBoundingSphere();
    this.geometry.boundingSphere = mesh.geometry.boundingSphere;
  }
}
