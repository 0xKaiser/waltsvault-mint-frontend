import { PerspectiveCamera } from 'three';

const { sqrt, min, max, cos, sin, tan, PI, atan } = Math;

export function degToRad(deg: number) {
  return (deg / 180) * PI;
}

export function getHorizontalFov(camera: PerspectiveCamera) {
  return (2 * atan(tan((camera.fov * PI) / 180 / 2) * camera.aspect) * 180) / PI; // degrees
}

export function calculateNormalizedScroll(start: number, duration: number) {
  const scrollStart = window.innerHeight * (start / 100);
  const scrollDuration = window.innerHeight * (duration / 100);

  return max(0, min(1, (window.scrollY - scrollStart) / scrollDuration));
}

export function easeInSine(x: number): number {
  return 1 - cos((x * PI) / 2);
}

export function easeOutSine(x: number): number {
  return sin((x * PI) / 2);
}

export function easeInCirc(x: number): number {
  return 1 - sqrt(1 - x ** 2);
}

export function easeOutCirc(x: number): number {
  return sqrt(1 - (x - 1) ** 2);
}

export function easeInExpo(x: number): number {
  return x === 0 ? 0 : 2 ** (10 * x - 10);
}

export function easeOutExpo(x: number): number {
  return x === 1 ? 1 : 1 - 2 ** (-10 * x);
}

export function easeInQuart(x: number): number {
  return x * x * x * x;
}

export function easeOutQuart(x: number): number {
  return 1 - (1 - x) ** 4;
}
export function easeInCube(x: number): number {
  return x ** 3;
}

export function easeOutCube(x: number): number {
  return 1 - (1 - x) ** 3;
}
export function easeInQuad(x: number): number {
  return x ** 2;
}

export function easeOutQuad(x: number): number {
  return 1 - (1 - x) ** 2;
}

export function clamp(value: number, minimum: number, maximum: number) {
  return min(maximum, max(minimum, value));
}

export function mapLinear(
  x: number,
  [startA, endA]: [number, number],
  [startB, endB]: [number, number],
  mode: 'clamp' | 'extend' = 'clamp',
) {
  let normalizedValue = (x - startA) / (endA - startA);
  if (mode === 'clamp') normalizedValue = clamp(normalizedValue, 0, 1);

  return startB + (endB - startB) * normalizedValue;
}

export function lerp(x: number, y: number, t: number) {
  return x + (y - x) * t;
}

export function isSorted(array: number[]) {
  const risingTrend = array[0] < array[1];

  return array.every((value, index) => {
    if (index === 0) return true;
    if (risingTrend) return array[index - 1] < value;
    return array[index - 1] > value;
  });
}

export function interpolate(x: number, inputs: number[], outputs: number[], mode: 'clamp' | 'extend' = 'clamp') {
  if (inputs.length !== outputs.length) throw new Error('Length of inputs and outputs must be the same!');
  if (inputs.length < 2) throw new Error('Inputs array must have at least 2 values!');
  if (!isSorted(inputs)) throw new Error('Inputs array must be sorted in ascending or descending order!');

  const isAscending = inputs[0] < inputs[1];
  let start = isAscending ? 0 : inputs.length - 2;
  let end = isAscending ? 1 : inputs.length - 1;

  if (isAscending) {
    while (x > inputs[end] && end < inputs.length) {
      start += 1;
      end += 1;
    }
  } else {
    while (x > inputs[start] && start >= 0) {
      start -= 1;
      end -= 1;
    }
  }

  return mapLinear(x, [inputs[start], inputs[end]], [outputs[start], outputs[end]], mode);
}
