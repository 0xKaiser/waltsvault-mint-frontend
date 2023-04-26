import WebGlCanvas from '@twl/common/rendering-engine/webgl-canvas';
import IMG_GALAXY from 'assets/images/black-hole.jpg';
import GSAP, { Power2 } from 'gsap';
import blackHoleFragmentShader from 'rendering-engine/shaders/black-hole.fragment.glsl';
import standardVertexShader from 'rendering-engine/shaders/standard-vertex.shader.glsl';
import * as THREE from 'three';

const ENTER_ANIMATION = 4;
const EXIT_ANIMATION = 16;
export default class PassengersBlackHole extends THREE.Mesh {
  onEnterAnimationComplete?: () => void;

  onTravelAnimationComplete?: () => void;

  private shaderMaterial: THREE.ShaderMaterial;

  private textureAspectRatio = 1;

  private endFov: number = 0;

  constructor(
    private scene: WebGlCanvas,
    private camera: THREE.PerspectiveCamera,
    private startFov: number,
    private editMode = false,
  ) {
    const completeResourceLoad = scene.registerResourceLoad();
    const galaxyTexture = scene.loader.load(IMG_GALAXY, texture => {
      this.textureAspectRatio = texture.image.width / texture.image.height;
      this.updateDimensions();
      this.endFov = this.camera.fov;
      this.camera.fov = this.startFov;
      this.camera.updateProjectionMatrix();

      completeResourceLoad();
    });

    const shaderMaterial = new THREE.ShaderMaterial({
      transparent: true,
      vertexShader: standardVertexShader,
      fragmentShader: blackHoleFragmentShader,
      uniforms: {
        map: { value: galaxyTexture },
        iSize: { value: 0.0 },
        iTime: { value: 1000 },
        iClickTime: { value: 0 },
        iAnimation: { value: 0 },
        iWave: { value: 0 },
        iBlackOpacity: { value: 1 },
        aspectRatio: { value: 1 },
      },
    });
    super(new THREE.PlaneBufferGeometry(1, 1), shaderMaterial);

    this.onResize = this.onResize.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);

    this.camera.add(this);
    this.position.set(0, 0, -1);
    this.shaderMaterial = shaderMaterial;
    this.updateDimensions();
  }

  updateDimensions() {
    const { innerHeight, innerWidth } = window;
    const angle = (this.startFov / 2) * (Math.PI / 180);
    let height = 2 * Math.tan(angle);
    let width = (height * innerWidth) / innerHeight;

    const viewPortAspect = width / height;
    const aspectScale = viewPortAspect / this.textureAspectRatio;

    if (aspectScale > 1) height *= aspectScale;
    if (aspectScale < 1) width /= aspectScale;

    this.scale.set(width, height, 1);
    this.shaderMaterial.uniforms.aspectRatio.value = this.textureAspectRatio;
  }

  update() {
    this.shaderMaterial.uniforms.iTime.value += 0.01 * 0.25;
  }

  startEnterAnimation(onComplete?: () => void) {
    GSAP.to(this.shaderMaterial.uniforms.iSize, {
      ease: Power2.easeInOut,
      duration: this.editMode ? 1 : ENTER_ANIMATION,
      value: 1,
      onComplete: () => {
        if (onComplete) onComplete();
        if (this.onEnterAnimationComplete) this.onEnterAnimationComplete();
      },
    });
  }

  startTravelAnimation(configs?: { onComplete?: () => void; onUpdate?: (progress: number) => void }) {
    const { onUpdate, onComplete } = configs ?? {};
    const animation = { value: 0 };
    GSAP.to(animation, {
      value: 1,
      ease: Power2.easeInOut,
      duration: this.editMode ? 1 : EXIT_ANIMATION,
      onUpdate: () => {
        if (onUpdate) onUpdate(animation.value);
        const { value } = animation;
        const travelAnimation = value;
        const expandAnimation = animation.value ** 4;

        const size = 1 + expandAnimation * 10;
        const wave = travelAnimation;
        const fov = THREE.MathUtils.lerp(this.startFov, this.endFov, expandAnimation);

        this.shaderMaterial.uniforms.iSize.value = size;
        this.shaderMaterial.uniforms.iWave.value = wave;
        this.camera.fov = fov;
        this.camera.updateProjectionMatrix();
      },
      onComplete: () => {
        if (onComplete) onComplete();
        if (this.onTravelAnimationComplete) this.onTravelAnimationComplete();
      },
    });
  }

  setBlacknessOpacity(blacknessOpacity: number) {
    if (blacknessOpacity === 0 && this.parent) this.removeFromParent();
    if (blacknessOpacity > 0 && !this.parent) this.camera.add(this);
    this.shaderMaterial.uniforms.iBlackOpacity.value = blacknessOpacity;
  }

  onResize() {
    this.updateDimensions();
  }
}
