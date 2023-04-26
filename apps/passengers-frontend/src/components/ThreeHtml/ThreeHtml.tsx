// import { ReactThreeFiber, useFrame, useThree } from '@react-three/fiber';

import { THREE_HTML_DISTANCE_MULTIPLIER } from 'constants/common';

import WebGlCanvas from '@twl/common/rendering-engine/webgl-canvas';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { Vector3, Object3D, Matrix4, Camera, Raycaster } from 'three';

const v1 = new Vector3();
const v2 = new Vector3();
const v3 = new Vector3();
const raycaster = new Raycaster();

function defaultCalculatePosition(el: Object3D, camera: Camera, size: { width: number; height: number }) {
  const objectPos = v1.setFromMatrixPosition(el.matrixWorld);
  objectPos.project(camera);
  const widthHalf = size.width / 2;
  const heightHalf = size.height / 2;
  return [objectPos.x * widthHalf + widthHalf, -(objectPos.y * heightHalf) + heightHalf];
}

export type CalculatePosition = typeof defaultCalculatePosition;

function isObjectBehindCamera(el: Object3D, camera: Camera) {
  const objectPos = v1.setFromMatrixPosition(el.matrixWorld);
  const cameraPos = v2.setFromMatrixPosition(camera.matrixWorld);
  const deltaCamObj = objectPos.sub(cameraPos);
  const camDir = camera.getWorldDirection(v3);
  return deltaCamObj.angleTo(camDir) > Math.PI / 2;
}

function isObjectVisible(el: Object3D, camera: Camera, rayCaster: Raycaster, occlude: Object3D[]) {
  const elPos = v1.setFromMatrixPosition(el.matrixWorld);
  const screenPos = elPos.clone();
  screenPos.project(camera);
  rayCaster.setFromCamera(screenPos, camera);
  const intersects = rayCaster.intersectObjects(occlude, true);
  if (intersects.length) {
    const intersectionDistance = intersects[0].distance;
    const pointDistance = elPos.distanceTo(rayCaster.ray.origin);
    return pointDistance < intersectionDistance;
  }
  return true;
}

const epsilon = (value: number) => (Math.abs(value) < 1e-10 ? 0 : value);

function getCSSMatrix(matrix: Matrix4, multipliers: number[], prepend = '') {
  let matrix3d = 'matrix3d(';
  for (let i = 0; i !== 16; i += 1) {
    matrix3d += epsilon(multipliers[i] * matrix.elements[i]) + (i !== 15 ? ',' : ')');
  }
  return prepend + matrix3d;
}

const getCameraCSSMatrix = (
  (multipliers: number[]) => (matrix: Matrix4) =>
    getCSSMatrix(matrix, multipliers)
)([1, -1, 1, 1, 1, -1, 1, 1, 1, -1, 1, 1, 1, -1, 1, 1]);

const getObjectCSSMatrix = (
  (scaleMultipliers: (n: number) => number[]) => (matrix: Matrix4, factor: number) =>
    getCSSMatrix(matrix, scaleMultipliers(factor), 'translate(-50%,-50%)')
)((f: number) => [1 / f, 1 / f, 1 / f, 1, -1 / f, -1 / f, -1 / f, -1, 1 / f, 1 / f, 1 / f, 1, 1, 1, 1, 1]);

type PointerEventsProperties =
  | 'auto'
  | 'none'
  | 'visiblePainted'
  | 'visibleFill'
  | 'visibleStroke'
  | 'visible'
  | 'painted'
  | 'fill'
  | 'stroke'
  | 'all'
  | 'inherit';

export interface HtmlProps extends React.HTMLAttributes<HTMLDivElement> {
  prepend?: boolean;
  center?: boolean;
  fullscreen?: boolean;
  eps?: number;
  portal?: React.MutableRefObject<HTMLElement>;
  distanceFactor?: number;
  sprite?: boolean;
  transform?: boolean;
  zIndexRange?: Array<number>;
  occlude?: React.RefObject<Object3D>[] | boolean;
  onOcclude?: (visible: boolean) => null;
  calculatePosition?: CalculatePosition;
  as?: string;
  wrapperClass?: string;
  pointerEvents?: PointerEventsProperties;
  webglCanvas: WebGlCanvas;
  targetObject: Object3D;
  disabled?: boolean;
}

export const ThreeHtml = React.forwardRef(
  (
    {
      children,
      eps = 0.001,
      style,
      className,
      prepend,
      center,
      fullscreen,
      portal,
      distanceFactor,
      sprite = false,
      transform = false,
      occlude,
      onOcclude,
      zIndexRange = [16777271, 0],
      calculatePosition = defaultCalculatePosition,
      as = 'div',
      wrapperClass,
      pointerEvents = 'auto',
      webglCanvas,
      targetObject,
      disabled,
    }: HtmlProps,
    ref: React.Ref<HTMLDivElement>,
  ) => {
    const { scene, camera, renderer: gl, width, height } = webglCanvas;
    const size = React.useMemo(() => ({ width, height }), [width, height]);
    const [el] = React.useState(() => document.createElement(as));
    const root = React.useRef<ReactDOM.Root>();
    const oldZoom = React.useRef(0);
    const oldPosition = React.useRef([0, 0]);
    const transformOuterRef = React.useRef<HTMLDivElement>(null!);
    const transformInnerRef = React.useRef<HTMLDivElement>(null!);
    // Append to the connected element, which makes HTML work with views
    const target = (portal?.current || gl.domElement.parentNode) as HTMLElement;

    React.useLayoutEffect(() => {
      const newRoot = ReactDOM.createRoot(el);
      const currentRoot = newRoot;

      root.current = newRoot;
      scene.updateMatrixWorld();
      if (transform) {
        // el.style.cssText = `position:absolute;top:0;left:0;pointer-events:none;overflow:hidden;`;
        el.style.cssText = `position:absolute;top:0;left:0;`;
      } else {
        const vec = calculatePosition(targetObject, camera, size);
        el.style.cssText = `position:absolute;top:0;left:0;transform:translate3d(${vec[0]}px,${vec[1]}px,0);transform-origin:0 0;`;
      }
      if (target) {
        if (prepend) target.prepend(el);
        else target.appendChild(el);
      }
      return () => {
        if (target) target.removeChild(el);
        currentRoot.unmount();
      };
      // Code copied from drei.js
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [target, transform]);

    React.useLayoutEffect(() => {
      if (wrapperClass) el.className = wrapperClass;
      // Code copied from drei.js
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wrapperClass]);

    const styles: React.CSSProperties = React.useMemo(() => {
      if (transform) {
        return {
          position: 'absolute',
          top: 0,
          left: 0,
          width: size.width,
          height: size.height,
          transformStyle: 'preserve-3d',
          // TODO: re-enable!
          // pointerEvents: 'none',
        };
      }
      return {
        position: 'absolute',
        transform: center ? 'translate3d(-50%,-50%,0)' : 'none',
        ...(fullscreen && {
          top: -size.height / 2,
          left: -size.width / 2,
          width: size.width,
          height: size.height,
        }),
        ...style,
      };
    }, [style, center, fullscreen, size, transform]);

    const transformInnerStyles: React.CSSProperties = React.useMemo(
      () => ({ position: 'absolute', pointerEvents }),
      [pointerEvents],
    );

    React.useLayoutEffect(() => {
      if (transform) {
        root.current?.render(
          <div ref={transformOuterRef} style={styles}>
            <div ref={transformInnerRef} style={transformInnerStyles}>
              <div ref={ref} className={className} style={style}>
                {children}
              </div>
            </div>
          </div>,
        );
      } else {
        root.current?.render(
          <div ref={ref} style={styles} className={className}>
            {children}
          </div>,
        );
      }
    });

    const visible = React.useRef(true);
    const initialDisplayRef = React.useRef('');
    React.useEffect(() => {
      function onRender() {
        if (disabled) {
          initialDisplayRef.current = el.style.display;
          el.style.display = 'none';
          return;
        }
        el.style.display = '';

        const isInScene = !!targetObject.parent;
        camera.updateMatrixWorld();
        targetObject.updateWorldMatrix(true, false);
        const vec = transform ? oldPosition.current : calculatePosition(targetObject, camera, size);
        el.style.opacity = isInScene ? targetObject.userData.opacity ?? 1 : 0;

        if (
          transform ||
          Math.abs(oldZoom.current - camera.zoom) > eps ||
          Math.abs(oldPosition.current[0] - vec[0]) > eps ||
          Math.abs(oldPosition.current[1] - vec[1]) > eps
        ) {
          const isBehindCamera = isObjectBehindCamera(targetObject, camera);
          let raytraceTarget: null | undefined | boolean | Object3D[] = false;
          if (typeof occlude === 'boolean') {
            if (occlude === true) {
              raytraceTarget = [scene];
            }
          } else if (Array.isArray(occlude)) {
            raytraceTarget = occlude.map(item => item.current) as Object3D[];
          }

          const previouslyVisible = visible.current;
          if (raytraceTarget) {
            const isvisible = isObjectVisible(targetObject, camera, raycaster, raytraceTarget);
            visible.current = isvisible && !isBehindCamera;
          } else {
            visible.current = !isBehindCamera;
          }

          if (previouslyVisible !== visible.current) {
            if (onOcclude) onOcclude(!visible.current);
            else el.style.display = visible.current ? 'block' : 'none';
          }

          if (transform) {
            const [widthHalf, heightHalf] = [size.width / 2, size.height / 2];
            const fov = camera.projectionMatrix.elements[5] * heightHalf;
            const cameraMatrix = getCameraCSSMatrix(camera.matrixWorldInverse);
            const cameraTransform = `translateZ(${fov}px)`;
            let matrix = targetObject.matrixWorld;
            if (sprite) {
              matrix = camera.matrixWorldInverse.clone().transpose().copyPosition(matrix).scale(targetObject.scale);
              matrix.elements[3] = 0;
              matrix.elements[7] = 0;
              matrix.elements[11] = 0;
              matrix.elements[15] = 1;
            }
            el.style.width = `${size.width}px`;
            el.style.height = `${size.height}px`;
            el.style.perspective = `${fov}px`;
            if (transformOuterRef.current && transformInnerRef.current) {
              transformOuterRef.current.style.transform = `${cameraTransform}${cameraMatrix}translate(${widthHalf}px,${heightHalf}px)`;
              transformInnerRef.current.style.transform = getObjectCSSMatrix(matrix, THREE_HTML_DISTANCE_MULTIPLIER);
            }
          }
          oldPosition.current = vec;
          oldZoom.current = camera.zoom;
        }
      }
      webglCanvas.eventDispatcher.addEventListener('onRender', onRender);

      return () => {
        webglCanvas.eventDispatcher.removeEventListener('onRender', onRender);
      };
    }, [
      webglCanvas,
      camera,
      distanceFactor,
      el,
      occlude,
      onOcclude,
      scene,
      size,
      sprite,
      transform,
      zIndexRange,
      eps,
      calculatePosition,
      targetObject,
      disabled,
    ]);

    // return <group {...props} ref={group} />;
    return null;
  },
);
