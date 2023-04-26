import usePreviousState from '@twl/common/hooks/usePreviousState';
import { ReactComponent as IcPadlock } from 'assets/icons/ic-padlock.svg';
import gsap from 'gsap';
import React, { useEffect, useRef } from 'react';

interface MintPhaseIndicatorProps {
  isPublicPhase: boolean | null;
}
export default function MintPhaseIndicator({ isPublicPhase }: MintPhaseIndicatorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousPhase = usePreviousState(isPublicPhase);

  useEffect(() => {
    if (isPublicPhase !== null && previousPhase === null) {
      gsap.to(containerRef.current, { duration: 0.3, opacity: 1 });
    }
    if (isPublicPhase === null && previousPhase !== null) {
      gsap.to(containerRef.current, { duration: 0.3, opacity: 0 });
    }
  }, [isPublicPhase, previousPhase]);

  const textColor = isPublicPhase ? 'text-white' : 'text-warning';
  return (
    <div ref={containerRef} className="flex flex-col gap-4 caption-small uppercase opacity-0">
      {!isPublicPhase && <div className="text-white">PHASE I</div>}{' '}
      <div className={`flex gap-2  ${textColor}`}>
        PHASE II - PUBLIC LIST
        {!isPublicPhase && <IcPadlock />}
      </div>
    </div>
  );
}
