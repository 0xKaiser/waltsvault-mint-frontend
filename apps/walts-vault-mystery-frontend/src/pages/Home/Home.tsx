import { ReactComponent as EnterDecoration } from 'assets/icons/ic-enter-decoration.svg';
import ImgRevealBg from 'assets/images/img-reveal-bg.png';
import PARTICLES_VIDEO from 'assets/videos/WV-particles.mp4';
import Clock from 'components/Clock';
import Footer from 'components/Footer';
import Radio from 'components/Radio';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import Sound, { sfxClockCompleted } from 'utils/sounds';
import { getLabel, getLink } from 'utils/utils';

export default function Home() {
  const [step, setStep] = useState(0);
  const [isWithBlackCover, setIsWithBlackCover] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  useLayoutEffect(() => {
    setTimeout(() => setIsWithBlackCover(false), 1000);
  }, []);

  const onResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useLayoutEffect(() => {
    onResize();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  function onRadioComplete() {
    setIsWithBlackCover(true);
    setTimeout(() => setStep(1), 1000);
    setTimeout(() => setIsWithBlackCover(false), 1500);
  }

  function onClockComplete() {
    Sound.play(sfxClockCompleted);
    setStep(2);
  }

  function ahahaClick() {
    const link = getLink();
    window.open(link, '_blank');
    Sound.play(sfxClockCompleted);
    setStep(2);
  }

  useEffect(() => {
    if (step !== 2) return;

    setIsWithBlackCover(true);
    setTimeout(() => {
      setIsCompleted(true);
      setIsWithBlackCover(false);
    }, 1000);
  }, [step]);

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-black overflow-hidden select-none">
      <video
        src={PARTICLES_VIDEO}
        muted
        autoPlay
        loop
        playsInline
        className=" absolute left-0 top-0 h-full w-full pointer-events-none mix-blend-screen object-cover transition-opacity z-10"
      />
      <div
        className={`
          cover bg-black z-10 transition-opacity duration-[1000ms]
          ${!isWithBlackCover ? 'opacity-0 pointer-events-none' : ''}
        `}
      />
      <div className="cover flex justify-center pointer-events-none overflow-hidden">
        <img className="h-full object-cover" src={ImgRevealBg} alt="background" />
        <img className="h-full object-cover" src={ImgRevealBg} alt="background" />
        <img className="h-full object-cover" src={ImgRevealBg} alt="background" />
        <img className="h-full object-cover" src={ImgRevealBg} alt="background" />
        <div className="cover bg-black opacity-40" />
      </div>
      {step === 0 && (
        <div className="cover h-full w-full overflow-hidden">
          <Radio onComplete={onRadioComplete} windowWidth={windowWidth} />
        </div>
      )}
      {(step === 1 || (step === 2 && !isCompleted)) && (
        <div className="relative h-full opacity-1 pointer-events-none">
          <Clock onComplete={step === 1 ? onClockComplete : undefined} windowWidth={windowWidth} />
        </div>
      )}
      <div className="cover flex flex-col justify-between pointer-events-none">
        <div className="h-[20%] w-full bg-gradient-to-b from-[rgba(0,0,0,0.8)] to-[rgba(0,0,0,0)]" />
        <div className="h-[20%] w-full bg-gradient-to-t from-[rgba(0,0,0,0.8)] to-[rgba(0,0,0,0)]" />
      </div>
      {isCompleted && (
        <div className="cover bg-black flex justify-center items-center select-none">
          <div className="flex items-center px-10">
            <div className="rotate-180">
              <EnterDecoration />
            </div>
            <button type="button" className="px-5" onClick={ahahaClick}>
              <h1 className="text-white text-center leading-[120px]">
                {getLabel()}
              </h1>
            </button>
            <EnterDecoration />
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
