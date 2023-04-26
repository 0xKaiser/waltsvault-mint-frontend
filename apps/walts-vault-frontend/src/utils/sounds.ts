import RADIO_MUSIC from 'assets/audio/radio-music.mp3';
import RADIO_STATIC from 'assets/audio/radio-static.mp3';
import SFX_CLOCK_COMPLETED from 'assets/audio/sfx-clock-completed.mp3';
import SFX_CLOCK from 'assets/audio/sfx-clock.mp3';
import SFX_LIGHTS_SWITCH from 'assets/audio/sfx-light-switch.mp3';
import SFX_PAPER_MOVEMENT from 'assets/audio/sfx-paper-movement.mp3';
import SONG_1 from 'assets/audio/song-1.mp3';
import SONG_2 from 'assets/audio/song-2.mp3';
import SONG_3 from 'assets/audio/song-3.mp3';
import { Howl } from 'howler';

import { isMobile } from './utils';

const LOCAL_STORAGE_KEY_MUTE = '_MUTE';

const sfxLightsSwitch = new Howl({ src: [SFX_LIGHTS_SWITCH], html5: true });
const sfxPaperMovement = new Howl({ src: [SFX_PAPER_MOVEMENT], html5: true });
const song1 = new Howl({ src: [SONG_1], html5: true });
const song2 = new Howl({ src: [SONG_2], html5: true });
const song3 = new Howl({ src: [SONG_3], html5: true });
const radioMusic = new Howl({ src: [RADIO_MUSIC], html5: true, loop: true });
const radioStatic = new Howl({ src: [RADIO_STATIC], html5: true, loop: true });
const sfxClock = new Howl({ src: [SFX_CLOCK], html5: true, loop: true });
const sfxClockCompleted = new Howl({ src: [SFX_CLOCK_COMPLETED], html5: true });

const Sounds = [sfxLightsSwitch, sfxPaperMovement, song1, song2, song3, radioMusic, radioStatic, sfxClock, sfxClockCompleted];

export { sfxLightsSwitch, sfxPaperMovement, song1, song2, song3, radioMusic, radioStatic, sfxClock, sfxClockCompleted };

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

const backgroundTracks = [song1, song2, song3];
let activeIndex = 0;
function playBackgroundMusic(resume = false) {
  const activeSong = backgroundTracks[activeIndex];
  play(activeSong, { resume });
  activeSong.on('end', () => {
    activeIndex = (activeIndex + 1) % backgroundTracks.length;
    playBackgroundMusic();
  });
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
  playBackgroundMusic,
  pause,
  play,
};

export default Sound;
