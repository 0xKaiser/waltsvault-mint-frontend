/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import ImgFrequencyIndicator from 'assets/images/img-frequency-indicator.png';
import ImgRadioKnob from 'assets/images/img-radio-knob.png';
import ImgRadio from 'assets/images/img-radio.png';
import gsap from 'gsap';
import useRotateObject from 'hooks/useRotateObject';
import React, { useEffect, useRef, useState } from 'react';
import Sound, { radioMusic, radioStatic } from 'utils/sounds';

const RIGHT_FREQUENCY_START = 0.45;
const RIGHT_FREQUENCY_END = 0.65;
const FIND_SONG_DELAY = 4000;

export default function Radio({ onComplete, windowWidth }: { onComplete: () => void; windowWidth: number }) {
  const [isRightFrequency, setIsRightFrequency] = useState(false);
  const [isUserInteracted, setIsUserInteracted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const frequencyIndicatorRef = useRef<HTMLImageElement>(null);
  const frequencyRef = useRef(0);
  const isMobile = windowWidth <= 991;

  useEffect(() => {
    if (!isUserInteracted) return;
    if (isRightFrequency) {
      Sound.play(radioMusic, { resume: true, fade: 1500 });
      Sound.pause(radioStatic, 0.5);
    } else {
      Sound.pause(radioMusic, 0.5);
      Sound.play(radioStatic, { resume: true, fade: 1500 });
    }
  }, [isUserInteracted, isRightFrequency]);

  useEffect(() => {
    if (!isRightFrequency) return undefined;

    const timeout = setTimeout(() => onComplete(), FIND_SONG_DELAY);

    return () => {
      clearTimeout(timeout);
      Sound.pause(radioStatic);
    };
  }, [isRightFrequency, onComplete]);

  function onKnobRotate(delta: number) {
    const FREQUENCY_WINDOW_WIDTH = windowWidth * (isMobile ? 0.195 : 0.155);
    frequencyRef.current = Math.max(0, Math.min(1, frequencyRef.current + delta / (360 * 5)));
    setIsUserInteracted(true);
    setIsRightFrequency(frequencyRef.current > RIGHT_FREQUENCY_START && frequencyRef.current < RIGHT_FREQUENCY_END);

    if (frequencyIndicatorRef.current) {
      const translateX = FREQUENCY_WINDOW_WIDTH * frequencyRef.current;
      gsap.to(frequencyIndicatorRef.current, {
        transform: `translateX(${translateX}px)`,
        duration: 0.3,
      });
    }
  }

  const leftKnobRef = useRotateObject<HTMLDivElement>({ onChange: onKnobRotate });
  const rightKnobRef = useRotateObject<HTMLDivElement>({ onChange: onKnobRotate });

  useEffect(() => {
    gsap.to(containerRef.current, {
      scale: isMobile ? 1.8 : 1,
      duration: 1,
    });
  }, [isMobile]);

  return (
    <div ref={containerRef} className="h-full w-full flex justify-center items-center select-none">
      <img
        className={`absolute ${isMobile ? 'w-80%]' : 'w-[80%]'} pointer-events-none overflow-hidden`}
        src={ImgRadio}
        alt="radio"
      />
      <div
        className={`
          absolute cursor-grab hover:scale-105
          ${isMobile ? 'w-[14%] mt-[22%] ml-[-37%]' : 'w-[11%] mt-[17.8%] ml-[-29.5%]'}
        `}
        ref={leftKnobRef}>
        <img className="pointer-events-none" src={ImgRadioKnob} alt="radio knob" />
      </div>
      <div
        className={`
          absolute cursor-grab hover:scale-105 
          ${isMobile ? 'w-[14%] mt-[22%] mr-[-38%]' : 'w-[11%] mt-[17.8%] mr-[-30.5%]'}
        `}
        ref={rightKnobRef}>
        <img className="pointer-events-none" src={ImgRadioKnob} alt="radio knob" />
      </div>
      <img
        ref={frequencyIndicatorRef}
        className={`absolute ${isMobile ? 'w-[1%] mt-[20%] ml-[-18.5%]' : 'w-[1%] mt-[16%] ml-[-14.5%]'}`}
        src={ImgFrequencyIndicator}
        alt="frequency indicator"
      />
    </div>
  );
}
