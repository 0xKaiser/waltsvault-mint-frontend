import FLIGHT_CHECKER from 'assets/audio-video/flight-checker-circle.mp4';
import UI_LEFT from 'assets/audio-video/UI-left.mp4';
import UI_RIGHT from 'assets/audio-video/UI-right.mp4';
import { ReactComponent as PageDecoration } from 'assets/images/img-flight-list-page-decoration.svg';
import Button from 'components/Button';
import PassengersSocialButtons from 'components/PassengersSocialButtons';
import gsap, { Power2, Power4 } from 'gsap';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sound from 'utils/sound';

interface FlightListBackgroundProps {
  playing: boolean;
}

export default function FlightListBackground({ playing }: FlightListBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const uiLeftRef = useRef<HTMLVideoElement>(null);
  const uiRightRef = useRef<HTMLVideoElement>(null);
  const uiVideosRef = useRef(null);

  const navigate = useNavigate();
  const [mutedAudio, setMutedAudio] = useState(Sound.getMute());

  useEffect(() => {
    Sound.setMute(mutedAudio);
  }, [mutedAudio]);

  useEffect(() => {
    if (!videoRef.current || !uiLeftRef.current || !uiRightRef.current || !uiVideosRef.current) return;

    if (playing) {
      videoRef.current.play();
      uiLeftRef.current.play();
      uiRightRef.current.play();

      gsap.to(uiVideosRef.current, { opacity: 1, duration: 3, ease: Power2.easeInOut });
      return;
    }

    videoRef.current.pause();
    uiLeftRef.current.pause();
    uiRightRef.current.pause();

    gsap.to(uiVideosRef.current, { opacity: 0, duration: 1, ease: Power4.easeIn });
  }, [playing]);

  function toggleAudio() {
    setMutedAudio(muted => !muted);
  }

  function goHome() {
    navigate('/');
  }

  return (
    <div className="cover h-screen w-screen bg-gradient-to-tr from-[rgb(32,35,102)] to-black overflow-hidden relative md:pt-[60px]">
      <div className="h-full w-full relative">
        <div className="cover flex justify-center items-center overflow-hidden">
          <div
            ref={uiVideosRef}
            className="mix-blend-screen min-w-[175vh] flex justify-between h-full w-full opacity-0">
            <video ref={uiLeftRef} src={UI_LEFT} muted playsInline loop className="h-full " />
            <video ref={uiRightRef} src={UI_RIGHT} muted playsInline loop className="h-full " />
          </div>
          <div className="cover mix-blend-screen justify-center items-center h-full w-full">
            <div className="flex flex-1" />
            <video
              ref={videoRef}
              src={FLIGHT_CHECKER}
              muted
              playsInline
              autoPlay
              loop
              className="h-full margin z-10 object-cover abs-center-x"
            />
            <div className="flex flex-1" />
          </div>
        </div>
      </div>
      <div className="absolute left-0 top-0 h-full mix-blend-screen" />
      <div className="absolute right-0 top-0 h-full mix-blend-screen" />
      <div className="absolute top-8 w-full px-20 hidden md:block" />
      <div className="fixed top-0 w-full h-[10%] bg-gradient-to-t from-[rgba(12,255,255,0)] to-[rgb(0,240,255)] opacity-20" />
      <div className="fixed bottom-0 w-full h-[10%] bg-gradient-to-b from-[rgba(12,255,255,0)] to-[rgb(0,240,255)] opacity-20" />
      <div className="fixed top-10 right-10 left-10 flex justify-between pointer-events-auto">
        <Button onClick={goHome} small={false}>
          home
        </Button>
        <div className="flex-1  px-8 items-center hidden md:flex">
          <div className="w-full relative">
            <PageDecoration />
            <div className="absolute bottom-[1px] left-[100px] right-8 h-[1px] bg-primary-blue" />
          </div>
        </div>
        <div className="flex flex-grow-0">
          <PassengersSocialButtons muteButton muted={mutedAudio} onToggleMusic={toggleAudio} />
        </div>
      </div>
    </div>
  );
}
