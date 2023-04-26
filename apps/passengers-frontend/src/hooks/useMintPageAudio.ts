import { MintState } from 'constants/common';

import { useEffect, useState } from 'react';
import Sound, { audio } from 'utils/sound';

const { NotConnected, Connecting, CanMint, MintingInProgress, MintingSuccessful } = MintState;

interface MintPageAudioProps {
  userEntered: boolean;
  enterAnimationCompleted: boolean;
  mintState: MintState;
  isWarning: boolean;
  isError: boolean;
  isWalletError: boolean;
}
export default function useMintPageAudio(props: MintPageAudioProps) {
  const { userEntered, enterAnimationCompleted, mintState, isWarning, isError, isWalletError } = props;
  const [mutedAudio, setMutedAudio] = useState(Sound.getMute());

  useEffect(() => {
    Sound.setMute(mutedAudio);
  }, [mutedAudio]);

  useEffect(() => {
    if (!userEntered) return undefined;

    audio.flightSfxAmbience.play();
    return () => {
      audio.flightSfxAmbience.pause();
    };
  }, [userEntered]);

  const playMint1 =
    enterAnimationCompleted && [CanMint, Connecting, MintingInProgress, NotConnected].includes(mintState);
  useEffect(() => {
    if (!playMint1) return undefined;

    audio.sfxMint1.play();
    return () => {
      Sound.stop(audio.sfxMint1);
    };
  }, [playMint1]);

  useEffect(() => {
    if (mintState !== MintingSuccessful) return undefined;

    audio.sfxMint2.play();
    return () => {
      Sound.stop(audio.sfxMint2);
    };
  }, [mintState]);

  useEffect(() => {
    if (!isWarning && !isError && !isWalletError) return undefined;

    audio.flightSfxError.play();

    return () => {
      Sound.stop(audio.flightSfxError);
    };
  }, [isWarning, isError, isWalletError]);

  function toggleAudio() {
    setMutedAudio(muted => !muted);
  }

  return { toggleAudio, mutedAudio };
}
