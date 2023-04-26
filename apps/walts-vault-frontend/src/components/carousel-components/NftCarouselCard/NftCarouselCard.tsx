import React, { memo, useEffect, useMemo, useRef } from 'react';

interface NftCarouselCardProps {
  animation: number;
  src: string;
  lightOn: boolean;
}
function NftCarouselCard({ animation, src, lightOn }: NftCarouselCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isActive = Math.abs(animation) < 0.001;
  const playVideo = isActive && lightOn;

  useEffect(() => {
    if (!videoRef.current) return;

    if (playVideo) videoRef.current.play();
    else videoRef.current.pause();
  }, [playVideo]);

  const transform = useMemo(() => {
    const xTranslate = animation * 100;

    return `translateX(${xTranslate}%)`;
  }, [animation]);

  const opacity = Math.max(0, 1 - Math.abs(animation)) ** 2;
  const pointerEvents = Math.abs(animation - 0) > 0.1 ? 'none' : 'auto';

  return (
    <video
      ref={videoRef}
      muted
      loop
      playsInline
      style={{ transform, opacity, pointerEvents }}
      className="h-full w-full"
      src={`${src}#t=0.001`}
    />
  );
}

export default memo(NftCarouselCard);
