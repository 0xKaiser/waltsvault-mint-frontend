import { VIRTUAL_SCROLL_EASING_DURATION } from 'constants/common';

import { AppEventsType } from '@twl/common/types/types';
import GSAP from 'gsap';
import React, { useEffect, useRef } from 'react';

interface SmoothScrollProps {
  children: React.ReactNode;
  easingDuration?: number;
}

export default function SmoothScroll(props: SmoothScrollProps) {
  const { children, easingDuration } = props;
  const virtualSizeRef = useRef<HTMLDivElement>(null);
  const smoothWrapperRef = useRef<HTMLDivElement>(null);
  const smoothContainerRef = useRef<HTMLDivElement>(null);
  const scrollValueRef = useRef({ scrollY: window.scrollY, scrollX: window.scrollX });

  useEffect(() => {
    const smoothContainer = smoothContainerRef.current;
    const virtualSize = virtualSizeRef.current;

    function onVirtualScroll() {
      if (!smoothContainer) return;
      smoothContainer.style.transform = `translateY(${-scrollValueRef.current.scrollY}px)`;

      const scrollXDelta = scrollValueRef.current.scrollX - window.virtualScrollX;
      const scrollYDelta = scrollValueRef.current.scrollY - window.virtualScrollY;

      window.virtualScrollY = scrollValueRef.current.scrollY;
      window.virtualScrollX = scrollValueRef.current.scrollX;

      window.eventDispatcher.dispatchEvent({
        type: AppEventsType.onVirtualScroll,
        scrollY: scrollValueRef.current.scrollY,
        scrollX: 0,
        scrollXDelta,
        scrollYDelta,
      });
    }

    function onScroll() {
      const { scrollY, scrollX } = window;

      GSAP.to(scrollValueRef.current, {
        scrollY,
        scrollX,
        duration: easingDuration ?? VIRTUAL_SCROLL_EASING_DURATION,
        onUpdate: onVirtualScroll,
      });
    }

    function onContentResize() {
      if (!smoothContainer || !virtualSize) return;

      virtualSize.style.height = `${smoothContainer.offsetHeight}px`;
      virtualSize.style.width = `${smoothContainer.offsetWidth}px`;
    }

    const resizeObserver = new ResizeObserver(() => {
      onContentResize();
    });
    if (smoothContainer) resizeObserver.observe(smoothContainer);

    if (smoothContainer) smoothContainer.addEventListener('change', onContentResize);
    window.addEventListener('scroll', onScroll, true);

    onContentResize();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('scroll', onScroll);
      if (smoothContainer) smoothContainer.removeEventListener('change', onContentResize);
    };
  }, [easingDuration]);

  return (
    <div ref={smoothWrapperRef} id="smooth-wrapper">
      <div ref={virtualSizeRef} />
      <div id="smooth-content-wrapper">
        <div ref={smoothContainerRef} id="smooth-content">
          {children}
        </div>
      </div>
    </div>
  );
}
