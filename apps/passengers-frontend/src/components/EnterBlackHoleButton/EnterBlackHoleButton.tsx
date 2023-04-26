import useSkipFirstEffect from '@twl/common/hooks/useSkipFirstEffect';
import BracketsHighlight from 'components/BracketsHighlight';
import GSAP from 'gsap';
import React, { useEffect, useRef, useState } from 'react';
import Sound from 'utils/sound';

interface EnterBlackHoleButtonProps {
  onClick: () => void;
  visible: boolean;
}
export default function EnterBlackHoleButton({ onClick, visible }: EnterBlackHoleButtonProps) {
  const [isVisible, setIsVisible] = useState(visible);
  const buttonRef = useRef<HTMLHeadingElement>(null);

  useSkipFirstEffect(() => {
    if (isVisible === visible) return;
    if (visible) {
      setIsVisible(true);
      return;
    }
    GSAP.to(buttonRef.current, {
      opacity: 0,
      duration: 1,
      onComplete: () => {
        setIsVisible(false);
      },
    });
  }, [visible]);

  useEffect(() => {
    if (!isVisible) return;
    GSAP.to(buttonRef.current, { opacity: 1, duration: 2 });
  }, [isVisible]);

  function onLocalClick() {
    Sound.playSfxClick();
    onClick();
  }

  if (!isVisible) return null;
  return (
    <div
      className="pointer-events-auto bg-transparent flex flex-1 h-screen items-center justify-center  opacity-0"
      ref={buttonRef}>
      <div className="relative p-8" tabIndex={0} onClick={onLocalClick} onKeyDown={onLocalClick} role="button">
        <h3 className="caption">Enter</h3>
        <BracketsHighlight />
      </div>
    </div>
  );
}
