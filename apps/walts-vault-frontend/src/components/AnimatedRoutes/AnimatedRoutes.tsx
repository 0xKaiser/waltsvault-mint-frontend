import GSAP, { Power2 } from 'gsap';
import React, { useEffect, useRef, useState } from 'react';
import { Routes, RoutesProps, useLocation } from 'react-router-dom';

const ANIMATION_DURATION = 0.4;

export default function AnimatedRoutes(props: RoutesProps) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    GSAP.to(containerRef.current, {
      opacity: 0,
      duration: ANIMATION_DURATION,
      onComplete: () => setDisplayLocation(location),
      ease: Power2.easeOut,
    });
  }, [location]);

  useEffect(() => {
    if (!containerRef.current) return;

    GSAP.to(containerRef.current, {
      opacity: 1,
      duration: ANIMATION_DURATION,
      ease: Power2.easeIn,
    });
  }, [displayLocation]);

  return (
    <div className="h-full w-full" ref={containerRef}>
      <Routes location={displayLocation} {...props} />
    </div>
  );
}
