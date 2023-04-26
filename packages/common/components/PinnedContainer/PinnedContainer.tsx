import React, { useRef, useEffect, useCallback } from 'react';

import useLatest from '../../hooks/useLatest';
import useVirtualPositionObserver from '../../hooks/useVirtualPositionObserver';
import { AppEventsType } from '../../types/types';

export interface PinnedContainerProps {
  children: JSX.Element;
  pinDuration: number;
  onScroll?: (progress: number, scrollOffset: number) => void;
  paddingDivChildren?: JSX.Element;
}
function PinnedContainer(props: PinnedContainerProps) {
  const { children, pinDuration, onScroll, paddingDivChildren } = props;
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const latestOnScroll = useLatest(onScroll);
  const [containerRef, containerPosition] = useVirtualPositionObserver();
  const pinPaddingHeight = window.innerHeight * (pinDuration / 100);

  const onScrollTranslate = useCallback(() => {
    const domElement = contentWrapperRef.current;
    if (!domElement) return;

    const targetTranslate = Math.max(
      0,
      Math.min(pinPaddingHeight, window.virtualScrollY - containerPosition.current.top),
    );
    domElement.style.transform = `translateY(${targetTranslate}px)`;

    if (latestOnScroll.current) {
      const progress = targetTranslate / pinPaddingHeight;

      latestOnScroll.current(progress, targetTranslate);
    }
  }, [pinPaddingHeight, containerPosition, latestOnScroll]);

  useEffect(() => {
    window.eventDispatcher.addEventListener(AppEventsType.onVirtualScroll, onScrollTranslate);

    return () => {
      window.eventDispatcher.removeEventListener(AppEventsType.onVirtualScroll, onScrollTranslate);
    };
  }, [onScrollTranslate]);

  return (
    <div ref={containerRef}>
      <div ref={contentWrapperRef}>{children}</div>
      <div style={{ height: pinPaddingHeight }} className="flex">
        {paddingDivChildren}
      </div>
    </div>
  );
}
export default React.memo(PinnedContainer);
