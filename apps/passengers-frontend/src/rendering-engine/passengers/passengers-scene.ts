import { BREAKPOINTS } from 'constants/common';

import Particles from '@twl/common/rendering-engine/particles';
import WebGlCanvas from '@twl/common/rendering-engine/webgl-canvas';
import { sampleMesh } from '@twl/common/utils/geometry';
import { degToRad, getHorizontalFov } from '@twl/common/utils/math';
import { setLayer } from '@twl/common/utils/object3D';
import IMG_SKYBOX from 'assets/images/skybox.jpg';
import passengers1 from 'assets/models/passengers1.fbx';
import { GUI } from 'dat.gui';
import GSAP, { Power2 } from 'gsap';
import { HtmlContent, TitleAnimationState } from 'pages/PassengersPage/PassengersPage.constants';
import { AnimationMixer, Object3D, AnimationClip, ShaderMaterial } from 'three';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';

import PassengersBlackHole from './passengers-blackhole';

const NUMBER_OF_PARTICLES = 7000;
const NEBULA_DISPERSION = 500;
const TIME_DELTA = 0.02;
const PARTICLES_SIZE = 1.5;
const MAX_CAMERA_ROTATION = Math.PI / 40;
const LOGO_ANIMATION_DURATION = 2;
const LOGO_ANIMATION_DISTANCE = -1000;
const CAMERA_FOV = 60;
const MAX_HTML_CONTENT_WIDTH = 1854;
const HTML_FULL_SIZE_DISTANCE = 1020;
const HTML_FULL_DISTANCE_SCALE = 0.8;
const LOGO_DISABLE_THRESHOLD = 0.1;

export default class PassengersScene extends WebGlCanvas {
  blackHole?: PassengersBlackHole;

  text: Object3D = new Object3D();

  private effectComposer?: EffectComposer;

  private guiFolder?: GUI;

  private animationMixer?: AnimationMixer;

  private shaderMaterial?: ShaderMaterial;

  private cameraContainer = new Object3D();

  private animationDuration = 0;

  private scrollProgress: number = 0;

  private logoParent = new THREE.Object3D();

  private maxYRotation = 0;

  private targetRotation = { x: 0, y: 0 };

  constructor(
    container: HTMLElement,
    private config: {
      htmlContent: HtmlContent[];
      editMode: boolean;
      logo: THREE.Object3D;
      disabledBlackHole: boolean;
    },
  ) {
    super(container);

    this.onScrollProgress = this.onScrollProgress.bind(this);

    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.camera.layers.enableAll();

    this.setupCamera();
    this.setupHtmlContent();
    this.setupScene();
    this.createSkybox();
    this.calculateMaxYRotationAngle();
    if (!config.disabledBlackHole)
      this.blackHole = new PassengersBlackHole(this, this.camera, 140, this.config.editMode);
    if (config.editMode) {
      this.enablePositionLogger();
      this.enableStats();
    }
    // write hello world function
  }

  private setupHtmlContent() {
    this.scaleHtmlContent();
    this.config.htmlContent.forEach(content => {
      const parent = new THREE.Object3D();
      parent.add(content.anchor);
      this.scene.add(parent);
      content.anchor.userData = { opacity: 0, animationState: TitleAnimationState.before };
      content.anchor.translateZ(-HTML_FULL_SIZE_DISTANCE);
    });
    this.config.logo.translateZ(-HTML_FULL_SIZE_DISTANCE);
  }

  private enablePositionLogger() {
    const worldPosition = new THREE.Vector3();
    const worldScale = new THREE.Vector3();
    const worldRotation = new THREE.Euler();
    const worldQuaternion = new THREE.Quaternion();
    function parseVector(vector: THREE.Vector3 | THREE.Euler) {
      const { x, y, z } = vector;
      return `new THREE.Vector3(${x} ,${y}, ${z})`;
    }
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key !== 's') return;

      this.camera.getWorldPosition(worldPosition);
      this.camera.getWorldQuaternion(worldQuaternion);
      this.camera.getWorldScale(worldScale);
      worldRotation.setFromQuaternion(worldQuaternion);

      // Needed for placing text in the edit mode
      // TODO: remove when the scene is finalized
      // eslint-disable-next-line no-console
      console.log(
        `progress: ${this.scrollProgress}, position: ${parseVector(worldPosition)}, scale: ${parseVector(
          worldScale,
        )}, rotation: ${parseVector(worldRotation)}`,
      );
    };
    window.addEventListener('keydown', handleKeydown);
    this.cleanupFunctions.push(() => window.removeEventListener('keydown', handleKeydown));
  }

  private setupCamera() {
    const normalizedMousePosition = new THREE.Vector2(0, 0);

    const cameraRotationContainer = new THREE.Object3D();
    this.scene.add(this.cameraContainer);
    cameraRotationContainer.add(this.camera);
    this.cameraContainer.add(cameraRotationContainer);
    this.camera.fov = CAMERA_FOV;
    this.camera.far = 10000;
    this.camera.near = 0.1;
    this.camera.updateProjectionMatrix();
    cameraRotationContainer.rotation.set(0, -Math.PI / 2, 0);
    this.camera.rotation.set(0, 0, 0);
    this.camera.position.set(0, 0, 0);

    if (this.config.editMode) return;

    const that = this;
    function onMouseMove(event: MouseEvent) {
      normalizedMousePosition.set((event.x / window.innerWidth) * 2 - 1, (event.y / window.innerHeight) * 2 - 1);
      const rotationY = -normalizedMousePosition.x;
      const rotationX = -normalizedMousePosition.y;

      GSAP.to(that.targetRotation, {
        x: rotationX,
        y: rotationY,
        duration: 0.2,
      });
    }
    window.addEventListener('mousemove', onMouseMove);
    this.cleanupFunctions.push(() => window.removeEventListener('mousemove', onMouseMove));
  }

  private setupScene() {
    const completeResourceLoad = this.registerResourceLoad();
    this.animationMixer = new AnimationMixer(this.cameraContainer);
    const whiteColor = new THREE.Color('white');
    this.scene.add(new THREE.AmbientLight(whiteColor));
    const light = new THREE.DirectionalLight(0xffffff, 0.3);
    light.position.set(50000, 6000000, -2000000);
    light.lookAt(new THREE.Vector3(0, 0, 0));

    this.scene.add(light);
    const fbxLoader = new FBXLoader();
    fbxLoader.load(passengers1, obj => {
      const nebulas = obj.children.find(o => o.name === 'Nebulas');
      nebulas?.children.forEach(nebulaMesh =>
        this.createNebula(nebulaMesh as THREE.Mesh, NUMBER_OF_PARTICLES, NEBULA_DISPERSION),
      );

      const cameraClip = AnimationClip.findByName(obj.animations, 'Camera|CameraAction');
      this.animationDuration = cameraClip.duration;

      const cameraAction = this.animationMixer!.clipAction(cameraClip);
      cameraAction.play();
      this.animationMixer?.setTime(0);

      completeResourceLoad();
    });
  }

  private createSkybox() {
    const completeResourceLoad = this.registerResourceLoad();
    const sphere = new THREE.SphereBufferGeometry(100000, 100, 100);
    const sphereMaterial = new THREE.MeshBasicMaterial({ map: this.loader.load(IMG_SKYBOX, completeResourceLoad) });
    const skyboxMesh = new THREE.Mesh(sphere, sphereMaterial);

    sphereMaterial.side = THREE.BackSide;
    sphereMaterial.map!.encoding = THREE.sRGBEncoding;

    skyboxMesh.rotateY(Math.PI / 2);
    this.scene.add(skyboxMesh);
  }

  private createNebula(nebulaMesh: THREE.Mesh, numberOfParticles: number, spread = 0) {
    const particlesVertices = new Float32Array(numberOfParticles * 3);

    const sampler = new MeshSurfaceSampler(nebulaMesh).build();
    sampleMesh(sampler, particlesVertices, numberOfParticles, spread);

    const nebula = new Particles({
      particlesVertices,
      secondaryColor: 0xffffff,
      color: 0x0085f7,
      particleSize: PARTICLES_SIZE,
      boundingSphereMesh: nebulaMesh,
    });
    nebula.position.copy(nebulaMesh.position);
    nebula.scale.copy(nebulaMesh.scale);
    nebula.rotation.copy(nebulaMesh.rotation);
    setLayer(nebula, 1);
    this.scene.add(nebula);

    return nebula;
  }

  onScrollProgress(progress: number) {
    this.scrollProgress = progress;

    this.animationMixer?.setTime(this.animationDuration * progress);
    this.toggleLogo(progress);
  }

  private toggleLogo(progress: number) {
    const { logo } = this.config ?? {};
    if (!logo) return;

    const logoDisabled = progress > LOGO_DISABLE_THRESHOLD;
    if (logoDisabled && !!logo.parent) logo.removeFromParent();
    if (!logoDisabled && !logo.parent) this.scene.add(logo);
  }

  private scaleHtmlContent() {
    const targetHeight = 2 * HTML_FULL_SIZE_DISTANCE * Math.tan(degToRad(CAMERA_FOV / 2));
    const distanceScale = HTML_FULL_DISTANCE_SCALE;
    const scale = (targetHeight * distanceScale) / window.innerHeight;
    this.config?.htmlContent.forEach(content => {
      content.anchor.scale.set(scale, scale, 1);
    });
    this.config?.logo.scale.set(scale, scale, 1);
  }

  private calculateMaxYRotationAngle() {
    const fov = getHorizontalFov(this.camera);
    const scale = (2 * HTML_FULL_SIZE_DISTANCE * Math.tan(degToRad(CAMERA_FOV / 2))) / window.innerHeight;
    const width = (MAX_HTML_CONTENT_WIDTH * scale) / 2;
    this.maxYRotation = Math.atan(width / HTML_FULL_SIZE_DISTANCE) - degToRad(fov / 2);
  }

  onResize() {
    this.effectComposer?.setSize(window.innerWidth, window.innerHeight);
    this.scaleHtmlContent();
    this.calculateMaxYRotationAngle();
    this.blackHole?.onResize();
  }

  dispose() {
    super.dispose();
    if (this.guiFolder) window.gui.removeFolder(this.guiFolder);
  }

  update() {
    if (this.blackHole) this.blackHole.update();
    if (this.shaderMaterial) this.shaderMaterial.uniforms.time.value += TIME_DELTA;
    this.updateCameraRotation();
  }

  private updateCameraRotation() {
    const isDesktop = window.innerWidth > BREAKPOINTS.md;
    const desktopF = isDesktop ? 1 : 0;
    const editF = this.config.editMode ? 0 : 1;
    const factor = desktopF * editF;

    GSAP.to(this.camera.rotation, {
      x: this.targetRotation.x * MAX_CAMERA_ROTATION * factor,
      y: this.targetRotation.y * Math.max(MAX_CAMERA_ROTATION, this.maxYRotation) * factor,
      duration: 0.5,
    });
  }

  animateLogoEntry() {
    const animation = { value: 0 };
    const directionVector = new THREE.Vector3();
    const positionVector = new THREE.Vector3();

    this.scene.add(this.logoParent);
    this.logoParent.add(this.config.logo);
    this.config.logo.getWorldDirection(directionVector);

    GSAP.to(this.config.logo.userData, { opacity: 1, duration: LOGO_ANIMATION_DURATION * 0.5, ease: Power2.easeOut });
    GSAP.to(animation, {
      value: 1,
      duration: LOGO_ANIMATION_DURATION,
      ease: Power2.easeInOut,
      onUpdate: () => {
        positionVector.copy(directionVector);
        positionVector.multiplyScalar((1 - animation.value) * LOGO_ANIMATION_DISTANCE);
        this.logoParent.position.copy(positionVector);
      },
    });
  }
}
