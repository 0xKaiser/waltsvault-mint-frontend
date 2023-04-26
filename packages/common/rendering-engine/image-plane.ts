import { Material, Mesh, MeshBasicMaterial, Object3D, PlaneBufferGeometry, TextureLoader } from 'three';
import { elementInViewport } from 'utils/dom';

import ImagesCanvas from './images-canvas';

import { VIRTUAL_SCROLL_EASING_DURATION } from '../global-constants';
import { AppEventsType, AppScrollEvent } from '../types/types';

const loader = new TextureLoader();

export interface ImagePlaneConfigs {
  material?: Material;
}

export default class ImagePlane extends Object3D {
  $mesh: Mesh;

  $isInViewPort: boolean;

  boundingRect = {
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  };

  translate = {
    x: 0,
    y: 0,
  };

  scroll = {
    x: 0,
    y: 0,
  };

  get isInViewPort() {
    return this.$isInViewPort;
  }

  set isInViewPort(state: boolean) {
    this.$isInViewPort = state;
    this.canvas.setMeshViewPortStatus(this.$mesh, state);
  }

  private observer?: IntersectionObserver;

  constructor(private htmlImage: HTMLImageElement, private canvas: ImagesCanvas, configs?: ImagePlaneConfigs) {
    super();
    this.onVirtualScroll = this.onVirtualScroll.bind(this);
    this.updateSizeAndPosition = this.updateSizeAndPosition.bind(this);

    const { material } = configs ?? {};
    this.$isInViewPort = elementInViewport(this.htmlImage);

    const geometry = new PlaneBufferGeometry(1, 1, 1, 1);

    this.$mesh = new Mesh(geometry, material ?? this.createMaterial());
    this.$mesh.position.set(0, 0, 0);
    this.add(this.$mesh);
    canvas.addImage(this, this.isInViewPort);

    this.setBoundingRect();
    this.updateSizeAndPosition();
    this.setupIntersectionObserver();
    this.setupScrollListener();
  }

  private setBoundingRect() {
    const { top, left, width, height } = this.htmlImage.getBoundingClientRect();

    this.boundingRect = {
      top: top - window.virtualScrollY,
      left: left - window.virtualScrollX,
      width,
      height,
    };
  }

  private onVirtualScroll(event: AppScrollEvent) {
    this.scroll = {
      x: event.scrollX,
      y: event.scrollY,
    };
    this.updateSizeAndPosition();
  }

  private setupScrollListener() {
    window.eventDispatcher.addEventListener(AppEventsType.onVirtualScroll, this.onVirtualScroll);
  }

  private createMaterial() {
    const texture = loader.load(this.htmlImage.src);
    return new MeshBasicMaterial({ map: texture });
  }

  private updateSizeAndPosition() {
    const { width, height, top, left } = this.boundingRect;

    const topPosition = top + this.translate.y - this.scroll.y;
    const leftPosition = left + this.translate.x - this.scroll.x;

    const x = leftPosition - window.innerWidth / 2 + width / 2;
    const y = -topPosition + window.innerHeight / 2 - height / 2;
    this.$mesh.scale.set(width, height, 1);
    this.position.set(x, y, 0);
  }

  private setupIntersectionObserver() {
    let timeout: NodeJS.Timeout;
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: [0.0001],
    };
    const onIntersection: IntersectionObserverCallback = elements => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        this.isInViewPort = elements[0].isIntersecting;
      }, VIRTUAL_SCROLL_EASING_DURATION + 2);
    };
    this.observer = new IntersectionObserver(onIntersection, options);
    this.observer.observe(this.htmlImage);
  }

  remove() {
    window.eventDispatcher.removeEventListener(AppEventsType.onVirtualScroll, this.onVirtualScroll);
    this.observer?.disconnect();
    this.canvas.removeImage(this.$mesh);
    return this;
  }
}
