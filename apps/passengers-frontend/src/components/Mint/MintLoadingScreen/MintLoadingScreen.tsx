import LoadingScreen from 'components/LoadingScreen';
import gsap from 'gsap';
import React, { useEffect, useRef, useState } from 'react';

interface MintLoadingScreenProps {
  corridorLoaded: boolean;
  hologramLoaded: boolean;
}
export default function MintLoadingScreen(props: MintLoadingScreenProps) {
  const { corridorLoaded, hologramLoaded } = props;
  const [loadProgress, setLoadProgress] = useState(0);

  const animationRef = useRef({ value: 0 });

  useEffect(() => {
    let progress = 60;
    if (corridorLoaded) progress += 20;
    if (hologramLoaded) progress += 20;

    gsap.to(animationRef.current, {
      value: progress,
      duration: 1,
      onUpdate: () => setLoadProgress(animationRef.current.value),
    });
  }, [corridorLoaded, hologramLoaded]);

  return <LoadingScreen progress={loadProgress} />;
}
