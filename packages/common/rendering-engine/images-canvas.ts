import * as THREE from 'three';

import WebGlCanvas from "./webgl-canvas";

const perspective = 800;

export default class ImagesCanvas extends WebGlCanvas {
  isInViewportMap: Map<string, boolean> = new Map();

  timeout: NodeJS.Timeout | undefined;

  constructor(container: HTMLElement) {
    super(container);

    this.renderer.setClearColor(0x000000, 0);

    this.setupCamera();
    this.observer?.disconnect();
    this.stop();
  }

  setupCamera() {
    const fov = (180 * (2 * Math.atan(window.innerHeight / 2 / perspective))) / Math.PI;
    this.camera = new THREE.PerspectiveCamera(fov, this.width / this.height, 1, 1000);
    this.camera.position.set(0, 0, perspective);
    this.camera.lookAt(0, 0, 0);
  }

  onResize(): void {
    this.setupCamera();
  }

  addImage(imageMesh: THREE.Object3D, inInViewPort = true) {
    this.scene.add(imageMesh);
    this.isInViewportMap.set(imageMesh.uuid, inInViewPort);

    if (!this.isPlaying && inInViewPort) this.play();
  }

  removeImage(imageMesh: THREE.Object3D) {
    const isInViewPort = this.isInViewportMap.get(imageMesh.uuid);
    this.scene.remove(imageMesh);
    this.isInViewportMap.delete(imageMesh.uuid);
    if (isInViewPort && this.isPlaying) this.updateViewportStatus();
  }

  setMeshViewPortStatus(imageMesh: THREE.Object3D, isInInViewPort: boolean) {
    this.isInViewportMap.set(imageMesh.uuid, isInInViewPort);
    if (isInInViewPort !== this.isPlaying) this.updateViewportStatus();
  }

  private updateViewportStatus() {
    const shouldPlay = Array.from(this.isInViewportMap.values()).some(inViewPort => inViewPort);
    if (shouldPlay) this.play();
    else this.stop();
  }

  protected renderFunction(): void {
    super.renderFunction();
  }
}
