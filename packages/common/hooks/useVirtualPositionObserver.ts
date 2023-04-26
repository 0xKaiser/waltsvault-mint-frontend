import { useCallback, useEffect, useRef } from 'react';

const windowObject = window;

export default function useVirtualPositionObserver() {
  const ref = useRef<HTMLDivElement>(null);
  const positionRef = useRef({
    left: 0,
    top: 0,
  });

  const updatePosition = useCallback(() => {
    if (!ref.current) return;
    const { left, top } = ref.current.getBoundingClientRect();
    const fromTop = Math.round(top + windowObject.virtualScrollY ?? 0);
    const fromLeft = Math.round(left + windowObject.virtualScrollX ?? 0);

    positionRef.current.top = fromTop;
    positionRef.current.left = fromLeft;
  }, []);

  useEffect(() => {
    if (!ref.current) throw new Error("Ref shouldn't be null!");

    const observer = new IntersectionObserver(updatePosition);
    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [updatePosition]);

  useEffect(() => {
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
    };
  }, [updatePosition]);

  return [ref, positionRef] as [typeof ref, typeof positionRef];
}
