import useSkipFirstEffect from '@twl/common/hooks/useSkipFirstEffect';
import CarouselButton from 'components/carousel-components/CarouselButton';
import CarouselCard from 'components/carousel-components/CarouselCard';
import { CarouselCardProps } from 'components/carousel-components/CarouselCard/CarouselCard';
import GSAP, { Power1, Power2 } from 'gsap';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import Sound, { sfxPaperMovement } from 'utils/sounds';

const SCROLL_EASING = 1.2;
const SCROLL_SNAP_TIMEOUT = 300;
const ITEM_SCROLL_SIZE = 1000;
const SWIPE_DELTA_MULTIPLIER = 8;
const MAX_VELOCITY = 200;
const SCROLL_VELOCITY_MULTIPLIER = 0.3;
const SCROLL_SPEED_MULTIPLIER = 2.5;

interface CarouselProps<T> extends Pick<CarouselCardProps<T>, 'renderCard'> {
  images: T[];
  innerContainerClassName?: string;
  arrowsOffset?: number;
  arrowSize?: number;
  scrollSpeedMultiplier?: number;
}

function absRemainder(number: number, divider: number) {
  const remainder = number % divider;
  if (remainder < 0) return divider + remainder;
  return remainder;
}

export default function Carousel<T>(props: CarouselProps<T>) {
  const {
    images,
    innerContainerClassName,
    arrowsOffset,
    arrowSize,
    scrollSpeedMultiplier = SCROLL_SPEED_MULTIPLIER,
    ...rest
  } = props;

  const scrollAnimation = useRef(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const scrollVelocityRef = useRef(0);

  const [scrollProgress, setScrollProgress] = useState(0);

  const scrollableHeight = ITEM_SCROLL_SIZE * images.length;

  const getCurrentIndex = useCallback(
    (applyVelocity?: boolean) => {
      const velocityAddOn = applyVelocity
        ? ((1 / images.length - 1) / 2) * (scrollVelocityRef.current / MAX_VELOCITY)
        : 0;
      const index = Math.round(scrollAnimation.current * images.length + velocityAddOn) % images.length;
      return index;
    },
    [images.length],
  );

  const currentIndex = getCurrentIndex();
  useSkipFirstEffect(() => Sound.play(sfxPaperMovement), [currentIndex]);

  const animateScroll = useCallback((to: number, duration = SCROLL_EASING, ease = Power1.easeOut) => {
    GSAP.to(scrollAnimation, {
      current: to,
      duration,
      ease,
      onUpdate: () => setScrollProgress(scrollAnimation.current),
    });
  }, []);

  const scrollToIndex = useCallback(
    (index: number, config?: { ease?: gsap.EaseFunction; duration?: number }) => {
      const normalizedScroll = index / images.length;

      const targetBase = Math.sign(scrollAnimation.current) * Math.floor(Math.abs(scrollAnimation.current));
      const target = targetBase + normalizedScroll;
      animateScroll(target, config?.duration, config?.ease);
    },
    [images.length, animateScroll],
  );

  const getClosesAnimationSnapPoint = useCallback(
    (applyVelocity?: boolean) => {
      const velocityAddOn = applyVelocity ? 0.5 * (scrollVelocityRef.current / MAX_VELOCITY) : 0;
      return Math.round(scrollAnimation.current * images.length - velocityAddOn) / images.length;
    },
    [images.length],
  );

  const snapToClosest = useCallback(() => {
    animateScroll(getClosesAnimationSnapPoint(true));
  }, [getClosesAnimationSnapPoint, animateScroll]);

  const swipeHandlers = useSwipeable({
    onSwiping: event => {
      scrollVelocityRef.current = -event.deltaX;
      const normalizedDelta = (event.deltaX * SWIPE_DELTA_MULTIPLIER) / scrollableHeight;
      const animationTarget = scrollAnimation.current + normalizedDelta;

      animateScroll(animationTarget);
    },
    onTouchEndOrOnMouseUp: () => {
      snapToClosest();
    },
  });

  useEffect(() => {
    function onWheel(event: WheelEvent) {
      scrollVelocityRef.current = -event.deltaY * SCROLL_VELOCITY_MULTIPLIER;
      clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(snapToClosest, SCROLL_SNAP_TIMEOUT);

      const normalizedDelta = (event.deltaY / scrollableHeight) * scrollSpeedMultiplier;
      const animationTarget = scrollAnimation.current + normalizedDelta;

      animateScroll(animationTarget);
    }
    window.addEventListener('wheel', onWheel);

    return () => window.removeEventListener('wheel', onWheel);
  }, [
    images.length,
    getCurrentIndex,
    scrollToIndex,
    scrollableHeight,
    animateScroll,
    snapToClosest,
    scrollSpeedMultiplier,
  ]);

  function scrollToNext() {
    const targetValue = getClosesAnimationSnapPoint() + 1 / images.length;

    animateScroll(targetValue, SCROLL_EASING, Power2.easeInOut);
  }

  function scrollToPrevious() {
    const targetValue = getClosesAnimationSnapPoint() - 1 / images.length;

    animateScroll(targetValue, SCROLL_EASING, Power2.easeInOut);
  }

  const activeScrollProgress = absRemainder(scrollProgress, 1);

  return (
    <div className="relative flex h-full w-full cursor-ns-resize" {...swipeHandlers}>
      <div className="flex justify-center items-center absolute top-0 h-full w-full">
        <CarouselButton onClick={scrollToPrevious} direction="left" arrowsOffset={arrowsOffset} arrowSize={arrowSize} />
        <div className={innerContainerClassName ?? 'min-h-full min-w-full z-10 '}>
          {images.map((data, index) => (
            <CarouselCard
              {...rest}
              data={data}
              key={Math.max(index)}
              numberOfElements={images.length}
              scrollProgress={activeScrollProgress}
              index={index}
            />
          ))}
        </div>
        <CarouselButton onClick={scrollToNext} direction="right" arrowsOffset={arrowsOffset} arrowSize={arrowSize} />
      </div>
    </div>
  );
}
