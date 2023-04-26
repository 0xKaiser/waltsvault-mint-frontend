import { gsap, SteppedEase } from 'gsap';
import { TextPlugin } from 'gsap/all';
import React, { useCallback, useEffect, useRef, useState } from 'react';

export interface TextTypingAnimationProps {
  children?: string;
  onComplete?: () => void;
  className?: string;
  border?: boolean;
  duration?: number;
  delay?: number;
  showCursor?: boolean;
}

function TextTypingAnimation({
  children: text,
  onComplete,
  className = '',
  border = false,
  duration = 0.5,
  delay = 0.2,
  showCursor = false,
}: TextTypingAnimationProps) {
  const [isRenderedOnce, setIsRenderedOnce] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  gsap.registerPlugin(TextPlugin);

  const onAnimationComplete = useCallback(() => {
    setIsRenderedOnce(true);
    if (onComplete) {
      onComplete();
    }
  }, [onComplete]);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.to(textRef.current, {
      duration,
      delay,
      text,
      ease: 'none',
      onComplete: onAnimationComplete,
    });

    if (showCursor) {
      tl.to(cursorRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: SteppedEase.config(1),
        repeat: -1,
        yoyo: true,
      });
    }
    // text animation should happen only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isRenderedOnce && textRef.current) {
      textRef.current.innerHTML = text || '';
    }
  }, [text, isRenderedOnce]);
  return (
    <div className={`flex ${showCursor ? 'h-fit inline-flex items-end' : ''}`}>
      <div ref={textRef} className={`${className} ${border ? 'border-2 sm:border border-white' : ''} flex`} />
      {showCursor && <div ref={cursorRef} className="w-2 h-5 bg-white" />}
    </div>
  );
}
export default React.memo(TextTypingAnimation);
