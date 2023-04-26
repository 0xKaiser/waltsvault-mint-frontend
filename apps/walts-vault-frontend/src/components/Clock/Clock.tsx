/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import IMG_CLOCK from 'assets/images/img-clock.png';
import IMG_HOUR_HAND from 'assets/images/img-hour-hand.png';
import IMG_MINUTE_HAND from 'assets/images/img-minute-hand.png';
import gsap from 'gsap';
import useElementSize from 'hooks/useElementSize';
import useRotateObject from 'hooks/useRotateObject';
import React, { useEffect, useRef, useState } from 'react';
import Sound, { sfxClock } from 'utils/sounds';

const TARGET_TIME = { h: 7.35, m: 55, delta: 12 };

export default function Clock({ onComplete, windowWidth }: { onComplete: undefined | (() => void), windowWidth: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [clockRef, [clockX, clockY]] = useElementSize<HTMLImageElement>();
  const [minuteActive, setMinuteActive] = useState(false);
  const [hourActive, setHourActive] = useState(false);
  const [hourAngle, setHourAngle] = useState(0);
  const [minuteAngle, setMinuteAngle] = useState(0);
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [isInFocus, setIsInFocus] = useState(false);
  const isMobile = windowWidth <= 991;

  useEffect(() => {
    const targetMinAngle = (TARGET_TIME.m / 60) * 360;
    const targetHourAngle = (TARGET_TIME.h / 12 + TARGET_TIME.m / 60 / 12) * 360;
    const minDelta = Math.abs(targetMinAngle - Math.abs(minuteAngle));
    const hourDelta = Math.abs(targetHourAngle - Math.abs(hourAngle));
    if (minDelta < TARGET_TIME.delta && hourDelta < TARGET_TIME.delta && onComplete) {
      Sound.pause(sfxClock);
      onComplete();
    }
  }, [hourAngle, minuteAngle]); // eslint-disable-line

  useEffect(() => {
    setIsPlayingSound(true);
    const timeout = setTimeout(() => setIsPlayingSound(false), 100);
    return () => clearTimeout(timeout);
  }, [hourAngle, minuteAngle]);

  useEffect(() => {
    if (isPlayingSound) Sound.play(sfxClock); else Sound.pause(sfxClock);
  }, [isPlayingSound]);

  useEffect(() => {
    gsap.to(containerRef.current, {
      marginTop: isInFocus ? (isMobile ? '90%' : '50%') : '3%', // eslint-disable-line
      scale: isInFocus ? (isMobile ? 4.8 : 2.2) : (isMobile ? 1.8 : 1), // eslint-disable-line
      duration: 1,
    });
  }, [isInFocus, isMobile]); // eslint-disable-line

  const hourHandRef = useRotateObject<HTMLDivElement>({
    onAngleChange: (angle) => setHourAngle(angle >= 0 ? angle % 360 : 360 + (angle % 360)),
  });
  const minuteHandRef = useRotateObject<HTMLDivElement>({
    onAngleChange: (angle) => setMinuteAngle(angle >= 0 ? angle % 360 : 360 + (angle % 360)),
  });

  function onMinuteMouseDown() {
    setMinuteActive(true);
  }
  function onMinuteMouseUp() {
    setMinuteActive(false);
  }
  function onHourMouseDown() {
    setHourActive(true);
  }
  function onHourMouseUp() {
    setHourActive(false);
  }
  function onFocus() {
    setIsInFocus(true);
  }

  return (
    <div ref={containerRef} className="h-full relative flex justify-center items-center pointer-events-none select-none">
      <img ref={clockRef} src={IMG_CLOCK} alt="clock" className="max-w-[100%] max-h-[100%] pointer-events-none" />
      <div
        className={`
          absolute w-[3%] mt-[-40.2%] mr-[-0.7%]
          ${hourActive ? 'z-10' : ''}
          ${minuteActive ? 'pointer-events-none' : ''}
        `}
      >
        <div
          ref={hourHandRef}
          className="pointer-events-auto cursor-grab origin-bottom"
          onMouseDown={onHourMouseDown}
          onMouseUp={onHourMouseUp}
        >
          <img className="pointer-events-none" src={IMG_HOUR_HAND} alt="hour hand" />
        </div>
      </div>
      <div
        className={`
          absolute w-[3%] mt-[-40.2%] mr-[-0.7%] 
          ${minuteActive ? 'z-10' : ''}
          ${hourActive ? 'pointer-events-none' : ''}
        `}
      >
        <div
          ref={minuteHandRef}
          className="pointer-events-auto cursor-grab origin-bottom"
          onMouseDown={onMinuteMouseDown}
          onMouseUp={onMinuteMouseUp}
        >
          <img className="pointer-events-none" src={IMG_MINUTE_HAND} alt="hour hand" />
        </div>
      </div>
      {!isInFocus &&
        <button
          className="absolute pointer-events-auto w-[22%] left-[39%]"
          onClick={onFocus}
          type="button"
          style={{ height: clockY * 0.21, marginTop: -clockY * 0.41 }}
        />
      }
    </div >
  );
}
