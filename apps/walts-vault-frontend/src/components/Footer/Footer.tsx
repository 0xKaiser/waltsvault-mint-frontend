import useBreakpoints from '@twl/common/hooks/useBreakpoints';
import { ReactComponent as IcRavendale } from 'assets/icons/ic-ravendale.svg';
import { ReactComponent as IcSoundBlack } from 'assets/icons/ic-sound-black.svg';
import { ReactComponent as IcSoundMutedBlack } from 'assets/icons/ic-sound-muted-black.svg';
import { ReactComponent as IcSoundMutedWhite } from 'assets/icons/ic-sound-muted.svg';
import { ReactComponent as IcSoundWhite } from 'assets/icons/ic-sound.svg';
import useActiveTabDetector from 'hooks/useActiveTabDetector';
import React, { useLayoutEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sound from 'utils/sounds';

export default function Footer() {
  const { isMobile } = useBreakpoints();
  const [isMuted, setIsMuted] = useState(Sound.getIsMuted());
  const { isTabActive } = useActiveTabDetector();
  const { pathname } = useLocation();
  const isMintPage = pathname === '/mint' || pathname === '/claim-and-refund' || pathname === '/wallet-checker';

  useLayoutEffect(() => {
    Sound.setMute(isMuted);
  }, [isMuted]);

  useLayoutEffect(() => {
    Sound.setIsTabActive(isTabActive);
  }, [isTabActive]);

  function toggleMute() {
    setIsMuted(!isMuted);
  }

  const IcSound = isMintPage ? IcSoundBlack : IcSoundWhite;
  const IcSoundMuted = isMintPage ? IcSoundMutedBlack : IcSoundMutedWhite;

  return (
    <>
      {!isMintPage && (
        <div className={`fixed bottom-8 pointer-events-auto ${isMobile ? 'left-5' : 'left-10'}`}>
          <button
            className=""
            type="button"
            onClick={() => window.open('https://opensea.io/collection/walts-vault-dream-catchers', '_blank')}>
            <IcRavendale />
          </button>
        </div>
      )}
      <div className="fixed bottom-8 right-10 pointer-events-auto z-20">
        <button className="" type="button" onClick={toggleMute}>
          {isMuted ? <IcSoundMuted /> : <IcSound />}
        </button>
      </div>
    </>
  );
}
