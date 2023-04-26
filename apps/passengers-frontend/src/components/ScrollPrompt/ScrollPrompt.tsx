import useSkipFirstEffect from '@twl/common/hooks/useSkipFirstEffect';
import gsap from 'gsap';
import React, { useRef } from 'react';

const ARROW_ANIMATION_DURATION = 2;
const ARROW_ANIMATION_DELAY = 2;

export interface ScrollPromptProps {
  visible?: boolean;
}

export default function ScrollPrompt({ visible }: ScrollPromptProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const initiallyVisible = useRef(!!visible);

  useSkipFirstEffect(() => {
    if (!containerRef.current) return;

    gsap.to(containerRef.current, {
      opacity: visible ? 1 : 0,
      delay: visible ? ARROW_ANIMATION_DELAY : 0,
      duration: ARROW_ANIMATION_DURATION,
    });
  }, [visible]);

  return (
    <div
      className={`${
        initiallyVisible.current ? 'opacity-100' : 'opacity-0'
      } pointer-events-none fixed flex flex-col items-center bottom left-0 right-0 bottom-[8vh] `}
      ref={containerRef}>
      <p className="pt-2">scroll</p>
    </div>
  );
}
