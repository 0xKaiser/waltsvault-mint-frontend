import { gsap } from 'gsap';
import { useEffect } from 'react';
import { Object3D, Vector3 } from 'three';

export default function useLookAroundCamera(
  camera?: Object3D | null,
  turnSpeed: number = 1,
  turnRadius: number = Math.PI / 8,
  enabled: boolean = true,
) {
  useEffect(() => {
    if (!enabled || !camera) return undefined;

    const onMouseMove = (event: MouseEvent) => {
      const normalizedMousePosition: Vector3 = new Vector3(event.y / window.innerHeight, event.x / window.innerWidth, 0)
        .multiplyScalar(2)
        .subScalar(1)
        .multiplyScalar(-turnRadius);
      gsap.to(camera.rotation, {
        z: normalizedMousePosition.x,
        y: normalizedMousePosition.y,
        duration: turnSpeed,
      });
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [camera, enabled, turnRadius, turnSpeed]);
}
