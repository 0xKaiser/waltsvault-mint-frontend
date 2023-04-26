import gsap from 'gsap';
import { useCallback, useMemo, useRef } from 'react';
import { useSwipeable } from 'react-swipeable';

import useLatest from './useLatest';

const VELOCITY_STRENGTH = 5;
const VELOCITY_EASING = 0.98;

interface HorizontalSwipeConfig {
  disable?: boolean;
  velocityStrength?: number;
  velocityEasing?: number;
  snapInterval?: number;
}
export default function useHorizontalSwipe(onScroll: (offset: number) => void, config?: HorizontalSwipeConfig) {
  const {
    disable,
    snapInterval,
    velocityEasing = VELOCITY_EASING,
    velocityStrength = VELOCITY_STRENGTH,
  } = config ?? {};

  const scrollOffset = useRef(0);
  const touchStartOffset = useRef(0);
  const velocityRef = useRef(0);
  const activeAnimation = useRef<gsap.core.Tween>();

  const latestOnScroll = useLatest(onScroll);

  const setOffset = useCallback(
    (offset: number) => {
      scrollOffset.current = offset;
      latestOnScroll.current(scrollOffset.current);
    },
    [latestOnScroll],
  );

  const applyVelocity = useCallback(() => {
    if (Math.abs(velocityRef.current) < 0.001) return;

    setOffset(scrollOffset.current + velocityRef.current);
    velocityRef.current *= velocityEasing;
    setTimeout(applyVelocity, 0);
  }, [setOffset, velocityEasing]);

  const snap = useCallback(
    (target?: number) => {
      if (!snapInterval) return;
      if (activeAnimation.current) activeAnimation.current.kill();

      const targetOffset = target ?? Math.round(scrollOffset.current / snapInterval) * snapInterval;
      activeAnimation.current = gsap.to(scrollOffset, {
        current: targetOffset,
        duration: 0.5,
        onUpdate: () => setOffset(scrollOffset.current),
      });
    },
    [setOffset, snapInterval],
  );

  const snapToIndex = useCallback(
    (index: number) => {
      if (!snapInterval) return;
      snap(snapInterval * index);
    },
    [snapInterval, snap],
  );

  const getCurrentIndex = useCallback(
    () =>
      !snapInterval ? 0 : Math.floor(Math.abs(scrollOffset.current / snapInterval)) * Math.sign(scrollOffset.current),
    [snapInterval],
  );

  const snapToNext = useCallback(() => {
    if (!snapInterval) return;
    const index = getCurrentIndex();
    snap((index - 1) * snapInterval);
  }, [snapInterval, snap, getCurrentIndex]);

  const snapToPrevious = useCallback(() => {
    if (!snapInterval) return;
    const index = getCurrentIndex();
    snap((index + 1) * snapInterval);
  }, [snapInterval, snap, getCurrentIndex]);

  const data = useMemo(
    () => ({
      snapToIndex,
      snapToNext,
      snapToPrevious,
      getCurrentIndex,
      scrollOffset,
    }),
    [snapToIndex, snapToNext, snapToPrevious, getCurrentIndex],
  );

  const handlers = useSwipeable({
    onSwipeStart: () => {
      if (disable) return;
      velocityRef.current = 0;
      touchStartOffset.current = scrollOffset.current;
      if (activeAnimation.current) activeAnimation.current.kill();
    },
    onSwiping: event => {
      if (disable) return;
      velocityRef.current = Math.sign(event.deltaX) * event.velocity * velocityStrength;
      setOffset(touchStartOffset.current + event.deltaX);
    },
    onTouchEndOrOnMouseUp: () => {
      if (disable) return;
      if (snapInterval) snap();
      else applyVelocity();
    },
  });

  return [handlers, data] as [typeof handlers, typeof data];
}
