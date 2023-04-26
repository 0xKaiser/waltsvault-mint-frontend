import { useEffect, useRef } from 'react';

import useLatest from './useLatest';

interface UseRotateObjectProps {
  onChange?: (rotationDelta: number) => void;
  onAngleChange?: (angle: number) => void;
  transformOrigin?: { x: number; y: number };
}
export default function useRotateObject<T extends HTMLElement>(props?: UseRotateObjectProps) {
  const ref = useRef<T>(null);
  const isMoving = useRef(false);
  const startAngle = useRef(0);
  const elementRotation = useRef(0);
  const startElementRotation = useRef(0);
  const oldMousePos = useRef({ x: 0, y: 0 });

  const latestPropsRef = useLatest(props);
  const { onChange } = props ?? {};

  useEffect(() => {
    if (!ref.current) {
      console.error('element ref was undefined in useRotateObject!');
      return undefined;
    }
    const { x: transformX = 0.5, y: transformY = 0.5 } = latestPropsRef.current?.transformOrigin ?? {};

    function getElementCenter() {
      if (!ref.current) return [0, 0];

      const { top, left, height, width } = ref.current.getBoundingClientRect();
      const centerX = left + width * transformX;
      const centerY = top + height * transformY;

      return [centerX, centerY];
    }

    function getAngle(eventX: number, eventY: number) {
      if (!ref.current) return 0;

      const [centerX, centerY] = getElementCenter();

      return (Math.atan2(eventX - centerX, eventY - centerY) * 180) / Math.PI;
    }

    function getMovementDelta(eventX: number, eventY: number) {
      const delta = [eventX - oldMousePos.current.x, eventY - oldMousePos.current.y];

      oldMousePos.current.x = eventX;
      oldMousePos.current.y = eventY;

      return delta;
    }

    function getDirection(eventX: number, eventY: number) {
      if (!ref.current) return 1;

      const [centerX, centerY] = getElementCenter();
      const [deltaX, deltaY] = getMovementDelta(eventX, eventY);

      // console.log(deltaX, deltaY);
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // console.log('delta X', deltaX, deltaY);
        return Math.sign(deltaX) * Math.sign(centerY - eventY);
      }
      // console.log('delta y', deltaX, deltaY);
      return -Math.sign(deltaY) * Math.sign(centerX - eventX);
    }

    function getAngleDelta(newAngle: number) {
      return Math.min(
        Math.abs(newAngle - elementRotation.current),
        Math.abs(newAngle - 360 - elementRotation.current),
        Math.abs(newAngle + 360 - elementRotation.current),
      );
    }

    function onStart(event: MouseEvent | Touch) {
      const { pageX, pageY } = event;
      oldMousePos.current.x = pageX;
      oldMousePos.current.y = pageX;

      isMoving.current = true;
      startAngle.current = getAngle(pageX, pageY);
      startElementRotation.current = elementRotation.current;
    }

    function onTouchStart(event: TouchEvent) {
      onStart(event.touches[0]);
    }

    function onEnd() {
      isMoving.current = false;
    }

    function onMove(event: MouseEvent | Touch) {
      if (!isMoving.current || !ref.current) return;

      const { pageX, pageY } = event;

      const currentAngle = getAngle(pageX, pageY);
      const angleDiff = currentAngle - startAngle.current;

      const newAngle = startElementRotation.current - angleDiff;
      const angleDelta = getAngleDelta(newAngle);
      elementRotation.current = newAngle;
      ref.current.style.transform = `rotate(${newAngle}deg)`;
      ref.current.style.transformOrigin = `${transformX * 100}% ${transformY * 100}%`;

      if (onChange) {
        const direction = getDirection(pageX, pageY);
        onChange(Math.abs(angleDelta) * direction);
      }
      if (latestPropsRef.current?.onAngleChange) latestPropsRef.current?.onAngleChange(newAngle);
    }

    function onTouchMove(event: TouchEvent) {
      onMove(event.touches[0]);
    }

    ref.current.addEventListener('mousedown', onStart);
    ref.current.addEventListener('mouseup', onEnd);
    ref.current.addEventListener('touchstart', onTouchStart);
    ref.current.addEventListener('touchend', onEnd);
    ref.current.addEventListener('mouseleave', onEnd);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onTouchMove);

    return () => {
      ref.current?.removeEventListener('mousedown', onStart);
      ref.current?.removeEventListener('mouseup', onEnd);
      ref.current?.removeEventListener('touchstart', onTouchStart);
      ref.current?.removeEventListener('touchend', onEnd);
      ref.current?.removeEventListener('mouseleave', onEnd);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onTouchMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onChange]);

  return ref;
}
