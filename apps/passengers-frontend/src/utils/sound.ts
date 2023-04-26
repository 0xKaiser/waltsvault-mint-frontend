import { LocalStorageKeys } from 'constants/common';

import CONNOR_1 from 'assets/audio-video/connor1.mp3';
import CONNOR_2 from 'assets/audio-video/connor2.mp3';
import CONNOR_3 from 'assets/audio-video/connor3.mp3';
import FLIGHT_SFX_AMBIENCE from 'assets/audio-video/FLIGHT-SFX-AMBIENCE.mp3';
import FLIGHT_SFX_BUTTON from 'assets/audio-video/FLIGHT-SFX-button.mp3';
import FLIGHT_SFX_CONFIRMATION from 'assets/audio-video/FLIGHT-SFX-confirmation.mp3';
import FLIGHT_SFX_ERROR from 'assets/audio-video/FLIGHT-SFX-error.mp3';
import FLIGHT_SFX_UI_BEGINS from 'assets/audio-video/FLIGHT-SFX-UI BEGINS.mp3';
import SFX_MINT_1 from 'assets/audio-video/mint-1.mp3';
import SFX_MINT_2 from 'assets/audio-video/mint-2.mp3';
import ENTRY_AUDIO from 'assets/audio-video/passenger_entry_music.m4a';
import SFC_AIRLOCK_OPEN from 'assets/audio-video/SFC-AIRLOCK-OPEN.mp3';
import SFX_CLICK from 'assets/audio-video/SFX-click.mp3';
import SFX_HOVER from 'assets/audio-video/SFX-hover.mp3';

export const audio = {
  sfxHover: new Audio(SFX_HOVER),
  sfxClick: new Audio(SFX_CLICK),
  flightSfxUiBegins: new Audio(FLIGHT_SFX_UI_BEGINS),
  flightSfxButton: new Audio(FLIGHT_SFX_BUTTON),
  flightSfxConfirmation: new Audio(FLIGHT_SFX_CONFIRMATION),
  flightSfxError: new Audio(FLIGHT_SFX_ERROR),
  flightSfxAmbience: new Audio(FLIGHT_SFX_AMBIENCE),
  connor1: new Audio(CONNOR_1),
  connor2: new Audio(CONNOR_2),
  connor3: new Audio(CONNOR_3),
  entryAudio: new Audio(ENTRY_AUDIO),
  sfxMint1: new Audio(SFX_MINT_1),
  sfxMint2: new Audio(SFX_MINT_2),
  sfxAirLockOpen: new Audio(SFC_AIRLOCK_OPEN),
};

audio.flightSfxAmbience.loop = true;

// removed audio control by gsap because it doesnt work in inactive tabs (known issue)
function changeAudioVolume(a: HTMLAudioElement, endValue: number, duration: number, onComplete?: Function) {
  if (!a) return;
  const startValue = a.volume;
  const isIncreasing = startValue < endValue;
  const interval = Math.round(duration / Math.abs((endValue - startValue) / 0.05));
  const fadeout = setInterval(() => {
    if ((isIncreasing && a.volume < endValue) || (!isIncreasing && a.volume > endValue)) {
      let newVolume = isIncreasing ? (a.volume + 0.05) : (a.volume - 0.05);
      newVolume = Math.min(Math.max(newVolume, 0), 1);
      a.volume = newVolume;
    } else {
      clearInterval(fadeout);
      if (onComplete) onComplete();
    }
  }, interval);
}

function isIOS() {
  // on iOS html5 audio volume cannot be controlled, so for iOS browsers we pause all active audios when need to mute
  if (typeof window === `undefined` || typeof navigator === `undefined`) return false;
  return /iPhone|iPad|iPod/i.test(navigator.userAgent || navigator.vendor);
};

function getMute() {
  return JSON.parse(localStorage.getItem(LocalStorageKeys.MUTE) || 'false') as boolean;
}

function play(a: HTMLAudioElement) {
  a.currentTime = 0.01;
  if (isIOS()) {
    if (getMute()) a.pause(); else a.play();
  } else {
    a.play();
  }
}

function stop(a: HTMLAudioElement) {
  if (isIOS()) {
    a.pause();
  } else {
    changeAudioVolume(a, 0, 1000, () => {
      a.pause();
      a.currentTime = 0;
      a.volume = getMute() ? 0 : 1;
    });
  }
}

function setMute(isMute: boolean) {
  localStorage.setItem(LocalStorageKeys.MUTE, String(isMute));
  Object.values(audio).forEach(a => {
    if (isIOS()) {
      if (!isMute && a.currentTime > 0) a.play(); else a.pause();
    } else {
      changeAudioVolume(a, isMute ? 0 : 1, 1000);
    }
  });
}

const Sound = {
  play,
  stop,
  getMute,
  playSfxClick: () => play(audio.sfxClick),
  playSfxHover: () => play(audio.sfxHover),
  sfxHover: () => play(audio.sfxHover),
  setMute,
  playFlightAmbience: () => play(audio.flightSfxAmbience),
  playFlightSfxUiBegins: () => play(audio.flightSfxUiBegins),
  playFlightSfxButton: () => play(audio.flightSfxButton),
  playFlightSfxConfirmation: () => play(audio.flightSfxConfirmation),
  playFlightSfxError: () => play(audio.flightSfxError),
};

export default Sound;
