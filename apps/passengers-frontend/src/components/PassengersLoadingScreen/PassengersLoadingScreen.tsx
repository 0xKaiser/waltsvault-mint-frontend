import useLatest from '@twl/common/hooks/useLatest';
import GSAP from 'gsap';
import React, { useEffect, useRef, useState } from 'react';
import PassengersScene from 'rendering-engine/passengers/passengers-scene';

interface PassengersLoadingScreenProps {
  passengerScene?: PassengersScene;
  initialAnimationProgress: number;
  onComplete: () => void;
}
export default function PassengersLoadingScreen({
  onComplete,
  passengerScene,
  initialAnimationProgress,
}: PassengersLoadingScreenProps) {
  const [loadProgress, setLoadProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const onCompleteRef = useLatest(onComplete);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!passengerScene) return;
    const animation = { value: 0 };
    function animateProgress(progress: number) {
      GSAP.to(animation, {
        value: progress,
        duration: 2,
        onUpdate: () => {
          setLoadProgress(animation.value);
          if (animation.value === 1) {
            onCompleteRef.current();
            GSAP.to(divRef.current, { opacity: 0, duration: 0.6, onComplete: () => setLoading(false) });
          }
        },
      });
    }
    animateProgress(initialAnimationProgress);
    passengerScene.onResourceLoadProgress = animateProgress;
  }, [passengerScene, initialAnimationProgress, onCompleteRef]);

  const loadingProgressPercentage = Math.ceil(loadProgress * 100);

  if (!loading) return null;
  return (
    <div ref={divRef} className="fixed top-0 left-0 flex h-screen w-screen justify-center items-center bg-black">
      <p className="numbers">{loadingProgressPercentage}%</p>
    </div>
  );
}
