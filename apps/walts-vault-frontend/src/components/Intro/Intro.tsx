import { ReactComponent as EnterDecoration } from 'assets/icons/ic-enter-decoration.svg';
import CURTAINS_STATIC_VIDEO from 'assets/videos/curtains-static.mp4';
import CURTAINS_VIDEO from 'assets/videos/curtains.mp4';
import gsap from 'gsap';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigationType } from 'react-router-dom';
import Sound from 'utils/sounds';

enum IntroState {
  LOADING,
  READY,
  PLAYING,
  COMPLETED,
}

const BUTTON_OPACITY_ANIMATION_DURATION = 0.3;
const INTRO_FADE_ANIMATION_DURATION = 0.3;

export default function Intro() {
  const navigationType = useNavigationType();
  const [state, setState] = useState<IntroState>(IntroState.READY);
  const videoRef = useRef<HTMLVideoElement>(null);
  const buttonContainerRef = useRef(null);
  const containerRef = useRef(null);
  const [videoDebug, setVideoDebug] = useState<string[]>([]);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    if (!buttonContainerRef.current || !videoRef.current || !containerRef.current) return;

    switch (state) {
      case IntroState.PLAYING:
        gsap.to(buttonContainerRef.current, {
          opacity: 0,
          duration: BUTTON_OPACITY_ANIMATION_DURATION,
        });
        videoRef.current.play();
        Sound.setMute(Sound.getIsMuted());
        Sound.playBackgroundMusic();
        break;

      case IntroState.COMPLETED:
        gsap.to(containerRef.current, { opacity: 0, duration: INTRO_FADE_ANIMATION_DURATION });
        break;
      default:
        break;
    }

    console.log('STATE:', IntroState[state]);
    let debugArr = videoDebug;
    debugArr.push(IntroState[state]);
    setVideoDebug(debugArr);
  }, [state]);

  function enter() {
    if (!videoRef.current) return;

    videoRef.current.currentTime = 0;
    setState(IntroState.PLAYING);

    setTimeout(() => {
      if (state !== IntroState.COMPLETED) {
        onVideoEnd();
      }
    }, 2500)
  }

  function onVideoEnd() {
    setState(IntroState.COMPLETED);
  }

  const readyRef = useRef(0);
  function onCanPlay() {
    readyRef.current += 2;
    setVideoLoaded(true);

    if (state === IntroState.LOADING && readyRef.current >= 1) {
      setState(IntroState.READY);
    }
  }

  const pointerEvents = state === IntroState.COMPLETED ? 'none' : 'auto';
  const buttonDisabled = state !== IntroState.READY;
  const showStaticVideo = [IntroState.LOADING, IntroState.READY].includes(state);
  const isLoading = IntroState.LOADING === state;

  if (navigationType !== 'POP') return null;

  return (
    <div ref={containerRef} className="fixed top-0 left-0 h-full w-full bg-black z-10" style={{ pointerEvents }}>
      <div className="cover h-full w-full">
        <video
          ref={videoRef}
          className="h-full w-full object-cover bg-black"
          src={CURTAINS_VIDEO}
          playsInline
          onEnded={!showStaticVideo ? onVideoEnd : undefined}
          onLoadedData={onCanPlay}
          preload='auto'
          muted
        />
      </div>
      {showStaticVideo && (
        <div className="cover h-full w-full">
          <video
            playsInline
            className="h-full w-full object-cover bg-black"
            onLoadedData={onCanPlay}
            preload='auto'
            src={CURTAINS_STATIC_VIDEO}
            muted
            autoPlay
            loop
          />
        </div>
      )}
      <div ref={buttonContainerRef} className="cover flex justify-center items-center">
        <div className="flex items-center">
          <EnterDecoration className="rotate-180" />
          <button type="button" onClickCapture={enter} className="px-10">
            <h1 className="text-white">Enter</h1>
          </button>
          <EnterDecoration />
        </div>
      </div>
      {/* <span style={{
        position: 'absolute',
        inset: '0 0',
        fontSize: '1rem',
        color: '#FFF',
        pointerEvents: 'none',
        background: 'hsla(0, 0%, 0%, 0.75)',
        width: 'fit-content',
        height: 'fit-content',
        fontFamily: 'sans-serif'
      }}>
        CUR STATE: {IntroState[state]} <br />
        PREV STATES: {videoDebug.toString()} <br />
        VID LOADED: {videoLoaded + " " + readyRef.current}
      </span> */}
    </div>
  );
}
