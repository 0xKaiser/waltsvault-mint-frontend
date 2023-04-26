import gsap from 'gsap';
import React, { useEffect, useRef, useState } from 'react';

interface LoadingScreenProps {
  progress: number;
}
export default function LoadingScreen(props: LoadingScreenProps) {
  const { progress } = props;
  const divRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(progress < 100);

  useEffect(() => {
    if (progress < 100) return;

    gsap.to(divRef.current, { opacity: 0, duration: 0.6, onComplete: () => setLoading(false) });
  }, [progress]);

  if (!loading) return null;
  return (
    <div
      ref={divRef}
      className="fixed top-0 left-0 flex h-screen w-screen justify-center items-center bg-black z-[16754241]">
      <p className="numbers">{Math.ceil(progress)}%</p>
    </div>
  );
}
