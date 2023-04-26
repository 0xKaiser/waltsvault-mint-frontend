// @ts-ignore

import Stats from 'stats.js';
import * as THREE from 'three';
import { EventDispatcher } from 'three';

import { BREAKPOINTS, VIRTUAL_SCROLL_EASING_DURATION } from '../global-constants';

export default abstract class WebGlCanvas {
  loader = new THREE.TextureLoader();

  stopTimeout: NodeJS.Timeout | undefined;

  renderer: THREE.WebGLRenderer;

  scene: THREE.Scene;

  camera: THREE.PerspectiveCamera;

  autoPauseScene = true;

  width: number;

  height: number;

  eventDispatcher = new EventDispatcher();

  onResourcesReady?: () => void;

  onResourceLoadProgress?: (progress: number) => void;

  protected isPlaying: boolean = true;

  protected isDead = false;

  protected observer?: IntersectionObserver;

  protected container: HTMLElement;

  protected cleanupFunctions: Function[] = [];

  private stats?: Stats;

  private loadingItems = 0;

  private peakLoadingItems = 0;

  private loadingProgress = 0;

  constructor(container: HTMLElement) {
    this.resize = this.resize.bind(this);
    this.render = this.render.bind(this);

    this.scene = new THREE.Scene();
    this.container = container;

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0x000000, 0);

    this.container.appendChild(this.renderer.domElement);

    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.camera = new THREE.PerspectiveCamera(70, this.width / this.height, 0.001, 1000);

    this.resize(true);
    this.setupResize();
    requestAnimationFrame(this.render);
    this.setupIntersectionObserver();
  }

  resize(setupPhase?: boolean) {
    const width = this.container.offsetWidth;
    const height = this.container.offsetHeight;
    // Prevent resign from happening on mobile/tablet devices (solves issues with jumping content on safari browsers)
    if (!setupPhase && width <= BREAKPOINTS.sm) return;
    this.width = width;
    this.height = height;

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    if (this.onResize) this.onResize();
  }

  enableStats() {
    this.stats = new Stats();
    this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(this.stats.dom);
  }

  removeStats() {
    if (!this.stats) return;

    this.stats.dom.remove();
  }

  private setupIntersectionObserver() {
    const options = {
      root: null,
      threshold: [0.01],
    };
    const onIntersection: IntersectionObserverCallback = elements => {
      if (elements[0].isIntersecting) this.play();
      else this.stop();
    };
    this.observer = new IntersectionObserver(onIntersection, options);
    this.observer.observe(this.container);
  }

  private setupResize() {
    const that = this;
    const handleResize = () => {
      that.resize();
    };
    window.addEventListener('resize', handleResize);
    this.cleanupFunctions.push(() => window.removeEventListener('resize', handleResize));
  }

  private clock = new THREE.Clock();

  private render(time: DOMHighResTimeStamp) {
    const timeDelta = this.clock.getDelta();
    if (!this.isPlaying || this.isDead) return;
    if (this.stats) this.stats.begin();

    this.eventDispatcher.dispatchEvent({ type: 'onRender', time });
    if (this.update) this.update(timeDelta);
    this.renderFunction();

    if (this.stats) this.stats.end();
    requestAnimationFrame(this.render.bind(this));
  }

  public stop() {
    clearTimeout(this.stopTimeout);
    setTimeout(() => {
      this.isPlaying = false;
    }, VIRTUAL_SCROLL_EASING_DURATION * 1.5);
  }

  public play() {
    clearTimeout(this.stopTimeout);
    if (this.isDead) throw new Error('Cannot call play on a dead scene!');
    if (!this.isPlaying) {
      requestAnimationFrame(this.render);
      this.isPlaying = true;
    }
  }

  public dispose() {
    this.isDead = true;
    this.observer?.disconnect();
    this.renderer.domElement?.remove();
    this.removeStats();

    this.cleanupFunctions.forEach(fun => fun());

    this.scene.traverse(object => {
      object.remove();
      if (object instanceof THREE.Material || object instanceof THREE.BufferGeometry) {
        object.dispose();
      }
    });
  }

  protected renderFunction() {
    this.renderer.render(this.scene, this.camera);
  }

  protected update?(time: DOMHighResTimeStamp): void;
  protected onResize?(): void;

  registerResourceLoad(weight = 1) {
    this.loadingItems += weight;
    this.peakLoadingItems += weight;

    return () => {
      this.loadingItems -= weight;
      if (this.onResourceLoadProgress) this.onResourceLoadProgress(1 - this.loadingItems / this.peakLoadingItems);
      if (this.loadingItems === 0) this.peakLoadingItems = 0;
      if (this.loadingItems === 0 && this.onResourcesReady) this.onResourcesReady();
      if (this.loadingItems < 0) throw new Error("Resource loading count shouldn't be negative!");
    };
  }
}
