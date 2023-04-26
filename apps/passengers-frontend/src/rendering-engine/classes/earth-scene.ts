import WebGlCanvas from '@twl/common/rendering-engine/webgl-canvas';
import { AppEventsType } from '@twl/common/types/types';
import { calculateNormalizedScroll } from '@twl/common/utils/math';
import GSAP from 'gsap';
import asciiFragmentShader from 'rendering-engine/shaders/ascii-fragment.shader.glsl';
import morphVertexShader from 'rendering-engine/shaders/morph-vertex.shader.glsl';
import standardFragmentShader from 'rendering-engine/shaders/standard-fragment.shader.glsl';
import standardVertexShader from 'rendering-engine/shaders/standard-vertex.shader.glsl';
import * as THREE from 'three';
import { ShaderMaterial } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

const uniformsAnimationConfig: Record<string, { start: number; end: number }> = {
  // vertex
  uFrequency: {
    start: 8,
    end: 0,
  },
  uAmplitude: {
    start: 4,
    end: 4,
  },
  uDensity: {
    start: 1,
    end: 1,
  },
  uStrength: {
    start: 8,
    end: 0,
  },
  // fragment
  uDeepPurple: {
    // max 1
    start: 1,
    end: 0,
  },
  uOpacity: {
    // max 1
    start: 0.1,
    end: 0.66,
  },
};

const cameraAnimationConfig = {
  x: {
    start: 0,
    end: -10,
  },
  y: {
    start: 0,
    end: 0,
  },
  z: {
    start: 18,
    end: 35,
  },
};

interface AnimationConfig {
  start: number;
  duration: number;
}

export default class EarthScene extends WebGlCanvas {
  private sphere?: THREE.Mesh;

  private effectComposer: EffectComposer;

  private scroll = { normalized: 0, running: false, soft: 0, hard: 0, ease: 0.05, limit: window.innerHeight };

  private asciiShaderPass: ShaderPass;

  constructor(
    container: HTMLElement,
    private cameraAnimRange: AnimationConfig,
    private morphAnimRange: AnimationConfig,
  ) {
    super(container);

    this.onScroll = this.onScroll.bind(this);
    this.updateScrollAnimations = this.updateScrollAnimations.bind(this);

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

    this.setupScene();
    this.setupEventListeners();
  }

  protected renderFunction(): void {
    this.effectComposer.render();
  }

  private setupScene() {
    const object = new THREE.Object3D();
    const geometry = new THREE.IcosahedronBufferGeometry(15, 20);
    const material = new THREE.ShaderMaterial({
      fragmentShader: standardFragmentShader,
      vertexShader: morphVertexShader,
      uniforms: {
        map: {
          value: undefined,
        },
      },
    });

    Object.entries(uniformsAnimationConfig).forEach(([key, { start }]) => {
      material.uniforms[key] = { value: start };
    });
    this.sphere = new THREE.Mesh(geometry, material);
    this.sphere.rotation.x = 0.3;
    object.rotation.z = -0.5;
    object.add(this.sphere);
    this.scene.add(object);

    this.dispose = this.dispose.bind(this);

    const pointLight = new THREE.PointLight(0xffffff, 4, 30);
    pointLight.position.set(-10, 10, 25);
    this.scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    this.scene.add(ambientLight);

    this.camera.position.z = cameraAnimationConfig.z.start;
    this.camera.lookAt(0, 0, 0);

    this.loader.load(
      '/public-assets/earthmap.jpg',
      texture => {
        material.uniforms.map.value = texture;
        material.needsUpdate = true;
      },
      undefined,
      error => console.error(error),
    );
  }

  animateCamera() {
    const normalizedScroll = calculateNormalizedScroll(this.cameraAnimRange.start, this.cameraAnimRange.duration);
    GSAP.to(this.camera.position, {
      x:
        cameraAnimationConfig.x.start +
        normalizedScroll * (cameraAnimationConfig.x.end - cameraAnimationConfig.x.start),
      y:
        cameraAnimationConfig.y.start +
        normalizedScroll * (cameraAnimationConfig.y.end - cameraAnimationConfig.y.start),
      z:
        cameraAnimationConfig.z.start +
        normalizedScroll * (cameraAnimationConfig.z.end - cameraAnimationConfig.z.start),
    });
  }

  animateShader() {
    if (!this.sphere) return;
    const material = this.sphere.material as ShaderMaterial;
    const normalizedScroll = calculateNormalizedScroll(this.morphAnimRange.start, this.morphAnimRange.duration);

    Object.entries(uniformsAnimationConfig).forEach(([key, { start, end }]) => {
      if (start === end || !this.sphere) return;
      GSAP.to(material.uniforms[key], {
        value: start + normalizedScroll * (end - start),
      });
    });
  }

  updateScrollAnimations() {
    this.scroll.running = false;

    this.animateCamera();
    this.animateShader();
  }

  onScroll() {
    this.scroll.normalized = this.scroll.hard / this.scroll.limit;

    if (!this.scroll.running) {
      window.requestAnimationFrame(this.updateScrollAnimations);

      this.scroll.running = true;
    }
  }

  setupEventListeners() {
    window.eventDispatcher.addEventListener(AppEventsType.onVirtualScroll, this.onScroll);
  }

  onResize(): void {
    if (!this.asciiShaderPass) return;
    this.asciiShaderPass.uniforms.iResolution.value.set(window.innerWidth, window.innerHeight);
    this.asciiShaderPass.uniforms.devicePixelRatio.value = window.devicePixelRatio;
  }

  // eslint-disable-next-line class-methods-use-this
  update(): void {
    if (!this.sphere) return;

    this.scroll.hard = window.scrollY;
    this.scroll.hard = GSAP.utils.clamp(0, this.scroll.limit, this.scroll.hard);
    this.scroll.soft = GSAP.utils.interpolate(this.scroll.soft, this.scroll.hard, this.scroll.ease);

    if (this.scroll.soft < 0.01) {
      this.scroll.soft = 0;
    }

    this.sphere.rotation.y += 0.0015;
  }

  public dispose(): void {
    super.dispose();
    window.removeEventListener('scroll', this.onScroll);
  }
}
