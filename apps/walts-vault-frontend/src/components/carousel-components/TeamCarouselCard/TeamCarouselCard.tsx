import { clamp } from '@twl/common/utils/math';
import React, { useEffect, useMemo, useRef } from 'react';

interface TeamCarouselCardProps {
  animation: number;
  src: string;
  title: string;
  name: string;
  lightOn: boolean;
}

export default function TeamCarouselCard(props: TeamCarouselCardProps) {
  const { animation, src, title, name, lightOn } = props;

  const videoRef = useRef<HTMLVideoElement>(null);
  const isActive = Math.abs(animation) < 0.001;
  const playVideo = isActive && lightOn;

  useEffect(() => {
    if (!videoRef.current) return;

    if (playVideo) videoRef.current.play();
    else videoRef.current.pause();
  }, [playVideo]);

  const transformValue = clamp(animation, -1, 1);
  const transform = useMemo(() => {
    const xTranslate = transformValue * 100;

    return `translateX(${xTranslate}%)`;
  }, [transformValue]);

  const opacity = 1 - Math.abs(animation);

  return (
    <div className="w-full h-full flex justify-center items-center overflow-hidden">
      <video
        ref={videoRef}
        className="w-full  relative bottom-20"
        style={{ transform, opacity }}
        playsInline
        muted
        loop
        src={`${src}#t=0.001`}
      />
      {isActive &&
        <div className="cover flex-col flex justify-end pb-10">
          <div className="pb-10">
            <h2 className="whitespace-nowrap text-center mb-[-16px]">{name}</h2>
            <h4 className="whitespace-nowrap text-center">{title}</h4>
          </div>
        </div>
      }
    </div>
  );
}
