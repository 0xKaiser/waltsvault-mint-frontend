import WebGlCanvas from '@twl/common/rendering-engine/webgl-canvas';
import twlModel from 'assets/models/twl.fbx';
import { GUI } from 'dat.gui';
import gsap from 'gsap';
import asciiFragmentShader from 'rendering-engine/shaders/ascii-fragment.shader.glsl';
import standardVertexShader from 'rendering-engine/shaders/standard-vertex.shader.glsl';
import twlParticlesFragment from 'rendering-engine/shaders/twl-particles-fragment.shader.glsl';
import twlParticlesVertex from 'rendering-engine/shaders/twl-particles-vertex.shader.glsl';
import * as THREE from 'three';
import { Mesh, MeshBasicMaterial, ShaderMaterial, Vector2 } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

import TouchTexture from './touch-texture';

const NUMBER_OF_PARTICLE = 25000;
const perspective = 800;

export default class TwlLogo extends WebGlCanvas {
  effectComposer?: EffectComposer;

  private asciiShaderPass?: ShaderPass;

  private touchTexture?: TouchTexture;

  private handleMouseMove?: (e: MouseEvent) => void;

  private shaderMaterial?: ShaderMaterial;

  private points?: THREE.Points;

  private guiFolder?: GUI;

  private hoverRotation = Math.PI * 0.2;

  private logoModelMesh?: Mesh;

  constructor(container: HTMLElement) {
    super(container);

    this.createParticles = this.createParticles.bind(this);
    this.setupGui = this.setupGui.bind(this);

    this.setupTouchTexture();
    this.setupScene();
    this.setupEffecComposer();
  }

  private setupTouchTexture() {
    this.touchTexture = new TouchTexture();

    this.handleMouseMove = (event: MouseEvent) => {
      if (!this.points) return;

      const x = THREE.MathUtils.clamp(event.offsetX / window.innerWidth, 0, 1);
      const y = THREE.MathUtils.clamp((window.innerHeight - event.offsetY) / window.innerHeight, 0, 1);
      this.touchTexture?.addTouch({ x, y });

      const rotateX = this.hoverRotation * (0.5 - y) * 2;
      const rotateY = this.hoverRotation * (x - 0.5) * 2;

      gsap.to(this.points.rotation, {
        x: rotateX,
        y: rotateY,
        duration: 0.5,
      });
    };

    this.container.addEventListener('mousemove', this.handleMouseMove);
  }

  private setupEffecComposer() {
    this.effectComposer = new EffectComposer(this.renderer);
    this.effectComposer.addPass(new RenderPass(this.scene, this.camera));
    this.asciiShaderPass = new ShaderPass({
      vertexShader: standardVertexShader,
      fragmentShader: asciiFragmentShader,
      uniforms: {
        tDiffuse: { value: null },
        iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        devicePixelRatio: { value: window.devicePixelRatio },
      },
    });

    this.effectComposer.addPass(this.asciiShaderPass);
  }

  private setupCamera() {
    const fov = (180 * (2 * Math.atan(window.innerHeight / 2 / perspective))) / Math.PI;
    this.camera.fov = fov;
    this.camera.near = 1;
    this.camera.far = 1000;
    this.camera.position.set(0, 0, perspective);
    this.camera.lookAt(0, 0, 0);
    this.camera.updateProjectionMatrix();
  }

  private setupScene() {
    const fbxLoader = new FBXLoader();
    const material = new MeshBasicMaterial({ color: 0xf00f00 });
    fbxLoader.load(
      twlModel,
      object => {
        object.children.forEach(child => {
          if (!(child as THREE.Mesh).isMesh) return;
          this.logoModelMesh = child as THREE.Mesh;
          this.logoModelMesh.material = material;
          this.logoModelMesh.geometry.center();
          this.createParticles();
        });
      },
      undefined,
      error => {
        console.error(error);
      },
    );
  }

  private createParticles() {
    if (this.isDead || !this.logoModelMesh) return;
    const particleAnimationStart = new Float32Array(NUMBER_OF_PARTICLE);
    const particlesLocations = new Float32Array(NUMBER_OF_PARTICLE * 3);
    const particlesColors = new Float32Array(NUMBER_OF_PARTICLE);
    const particlesAngles = new Float32Array(NUMBER_OF_PARTICLE);
    const indices = new Uint16Array(NUMBER_OF_PARTICLE);
    const vec3 = new THREE.Vector3();
    const normal = new THREE.Vector3();

    const frontSide = new THREE.Vector3(0, 0, 1);
    const backSide = new THREE.Vector3(0, 0, -1);
    const upSide = new THREE.Vector3(0, 1, 0);

    const sampler = new MeshSurfaceSampler(this.logoModelMesh).build();
    this.logoModelMesh.geometry.computeBoundingBox();
    const { boundingBox } = this.logoModelMesh.geometry;
    const geometryHeight = boundingBox!.max.y - boundingBox!.min.y;

    for (let i = 0; i < NUMBER_OF_PARTICLE; i += 1) {
      const index = i * 3;
      sampler.sample(vec3, normal);

      particleAnimationStart[i] = (vec3.y - boundingBox!.min.y) / geometryHeight;

      particlesLocations[index] = vec3.x;
      particlesLocations[index + 1] = vec3.y;
      particlesLocations[index + 2] = vec3.z;

      normal.round();
      if (normal.equals(frontSide)) particlesColors[i] = 1;
      else if (normal.equals(backSide)) particlesColors[i] = 1;
      else if (normal.equals(upSide)) particlesColors[i] = 0.65;
      else particlesColors[i] = 0.25;

      particlesAngles[i] = Math.random() * Math.PI * 2;
      indices[i] = i;
    }

    const bufferGeometry = new THREE.BufferGeometry();
    bufferGeometry.setAttribute('particleAnimationStart', new THREE.BufferAttribute(particleAnimationStart, 1));
    bufferGeometry.setAttribute('position', new THREE.BufferAttribute(particlesLocations, 3));
    bufferGeometry.setAttribute('customColor', new THREE.BufferAttribute(particlesColors, 1));
    bufferGeometry.setAttribute('angle', new THREE.BufferAttribute(particlesAngles, 1));
    this.shaderMaterial = new ShaderMaterial({
      vertexShader: twlParticlesVertex,
      fragmentShader: twlParticlesFragment,
      uniforms: {
        uColor: { value: new THREE.Color(0xffffff) },
        uSize: { value: 10 },
        uTouchTexture: { value: this.touchTexture?.texture },
        uRandom: { value: 2.0 },
        uTime: { value: 0.0 },
        uFlatDispersion: { value: 40 },
        uDepthDispersion: { value: 20 },
        uAnimation: { value: 0 },
        uParticleAnimationDurationPercentage: { value: 0.2 },
        uResolution: { value: new Vector2(window.innerWidth, window.innerHeight) },
      },
    });
    this.points = new THREE.Points(bufferGeometry, this.shaderMaterial);
    this.scaleParticles();
    this.scene.add(this.points);

    gsap.to(this.shaderMaterial.uniforms.uAnimation, {
      value: 1.0,
      duration: 4,
      delay: 1.0,
    });
    this.setupGui();
  }

  scaleParticles() {
    if (!this.points || !this.logoModelMesh) return;
    this.logoModelMesh.geometry.computeBoundingBox();
    const { boundingBox } = this.logoModelMesh.geometry;
    const geometryWidth = boundingBox!.max.x - boundingBox!.min.x;
    const scale = (window.innerWidth * 0.7) / geometryWidth;
    this.points.scale.set(scale, scale, scale);
  }

  setupGui() {
    if (!this.shaderMaterial) throw new Error('Shader material is needed to set up the gui');
    this.guiFolder = window.gui.addFolder('twl logo');

    const flatDispersionControls = this.guiFolder.add(this.shaderMaterial.uniforms.uFlatDispersion, 'value', 0, 200);
    flatDispersionControls.name('uFlatDispersion');
    const depthDispersionControls = this.guiFolder.add(this.shaderMaterial.uniforms.uDepthDispersion, 'value', 0, 200);
    depthDispersionControls.name('uDepthDispersion');
    this.guiFolder.add(this, 'hoverRotation', 0, Math.PI);
  }

  protected renderFunction(): void {
    this.effectComposer?.render();
  }

  onResize() {
    this.setupCamera();
    this.scaleParticles();
    if (this.shaderMaterial)
      (this.shaderMaterial.uniforms.uResolution.value as Vector2).set(window.innerWidth, window.innerHeight);
  }

  update() {
    if (this.shaderMaterial) this.shaderMaterial.uniforms.uTime.value += 0.01;
    this.touchTexture?.update();
  }

  dispose() {
    super.dispose();
    if (this.handleMouseMove) this.container.removeEventListener('mousedown', this.handleMouseMove);
    if (this.guiFolder) window.gui.removeFolder(this.guiFolder);
  }
}
