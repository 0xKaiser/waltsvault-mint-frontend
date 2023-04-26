import PinnedContainer from '@twl/common/components/PinnedContainer';
import { PinnedContainerProps } from '@twl/common/components/PinnedContainer/PinnedContainer';
import React, { useRef } from 'react';

interface PinnedHorizontalScrollProps extends Omit<PinnedContainerProps, 'onScroll'> {
  children: JSX.Element;
  onScroll: (progress: number, translate: { x: number; y: number }) => void;
}

function PinnedHorizontalScroll(props: PinnedHorizontalScrollProps) {
  const { children, onScroll, ...rest } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);

  function translateHorizontally(progress: number, translateY: number) {
    if (!contentWrapperRef.current || !containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const contentWidth = contentWrapperRef.current.offsetWidth;
    const scrollAmount = -Math.max(0, (contentWidth - containerWidth) * progress);

    contentWrapperRef.current.style.transform = `translateX(${scrollAmount}px)`;

    if (onScroll) onScroll(progress, { x: scrollAmount, y: translateY });
  }

  return (
    <PinnedContainer {...rest} onScroll={translateHorizontally}>
      <div ref={containerRef} className="w-full h-full overflow-hidden">
        <div ref={contentWrapperRef} className="inline-flex flex-1">
          {children}
        </div>
      </div>
    </PinnedContainer>
  );
}

export default React.memo(PinnedHorizontalScroll);
