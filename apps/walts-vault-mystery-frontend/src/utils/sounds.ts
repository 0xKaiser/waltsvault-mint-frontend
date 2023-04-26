import RADIO_MUSIC from 'assets/audio/radio-music.mp3';
import RADIO_STATIC from 'assets/audio/radio-static.mp3';
import SFX_CLOCK_COMPLETED from 'assets/audio/sfx-clock-completed.mp3';
import SFX_CLOCK from 'assets/audio/sfx-clock.mp3';
import SFX_LIGHTS_SWITCH from 'assets/audio/sfx-light-switch.mp3';
import { Howl } from 'howler';

import { isMobile } from './utils';

const LOCAL_STORAGE_KEY_MUTE = '_MUTE';

const sfxLightsSwitch = new Howl({ src: [SFX_LIGHTS_SWITCH], });
const radioMusic = new Howl({ src: [RADIO_MUSIC], loop: true });
const radioStatic = new Howl({ src: [RADIO_STATIC], loop: true });
const sfxClock = new Howl({ src: [SFX_CLOCK], loop: true });
const sfxClockCompleted = new Howl({ src: [SFX_CLOCK_COMPLETED] });

const Sounds = [sfxLightsSwitch, radioMusic, radioStatic, sfxClock, sfxClockCompleted];

export { sfxLightsSwitch, radioMusic, radioStatic, sfxClock, sfxClockCompleted };

let isMuted = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_MUTE) || 'false') as boolean;

function getIsMuted() {
  return isMuted;
}

interface PlayConfig {
  resume?: boolean;
  fade?: number;
}

function play(audio: Howl, config: PlayConfig = {}) {
  const { resume = false, fade = 0 } = config;
  if (!resume) audio.seek(0);

  audio.play();
}

function pause(audio: Howl, fade = 0) {
  audio.pause();
}

function setMute(value: boolean) {
  isMuted = value;
  localStorage.setItem(LOCAL_STORAGE_KEY_MUTE, String(value));
  Sounds.forEach(audio => audio.mute(value));
}

function setIsTabActive(value: boolean) {
  if (!isMobile) return;
  Sounds.forEach(audio => audio.mute(isMuted || !value));
}

const Sound = {
  getIsMuted,
  setMute,
  setIsTabActive,
  pause,
  play,
};

export default Sound;
