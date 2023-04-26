import { ReactComponent as IcSoundMuted } from 'assets/icons/ic-sound-muted.svg';
import { ReactComponent as IcSound } from 'assets/icons/ic-sound.svg';
import useActiveTabDetector from 'hooks/useActiveTabDetector';
import React, { useLayoutEffect, useState } from 'react';
import Sound from 'utils/sounds';

export default function Footer() {
  const [isMuted, setIsMuted] = useState(Sound.getIsMuted());
  const { isTabActive } = useActiveTabDetector();

  useLayoutEffect(() => {
    Sound.setMute(isMuted);
  }, [isMuted]);

  useLayoutEffect(() => {
    Sound.setIsTabActive(isTabActive);
  }, [isTabActive]);

  function toggleMute() {
    setIsMuted(!isMuted);
  }

  return (
    <div className="fixed bottom-8 right-10 pointer-events-auto">
      <button className="" type="button" onClick={toggleMute}>
        {isMuted ? <IcSoundMuted /> : <IcSound />}
      </button>
    </div>
  );
}
