import { SOCIAL_MEDIA } from 'constants/common';

import { ReactComponent as IcMenu } from 'assets/icons/ic-menu.svg';
import Button from 'components/Button';
import React, { useEffect, useState } from 'react';
import * as THREE from 'three';

interface PassengerSocialButtonsProps {
  muted?: boolean;
  onToggleMusic?: () => void;
  openMobileMenu?: () => void;
  muteButton?: boolean;
  mobileMenu?: boolean;
  socialsEnabled?: boolean;
}

export default function PassengersSocialButtons({
  muteButton,
  openMobileMenu,
  mobileMenu,
  socialsEnabled,
  ...props
}: PassengerSocialButtonsProps) {
  function openLink(to: string) {
    return () => window.open(to);
  }
  const { discord, twitter } = SOCIAL_MEDIA.passenger;
  const TwitterIcon = twitter.icon;
  const DiscordIcon = discord.icon;
  return (
    <div className="flex flex-row-reverse w-full justify-between transition-all">
      {(muteButton || mobileMenu) && (
        <div className="flex row gap-6">
          {muteButton && <MusicButton {...props} />}
          {mobileMenu && (
            <Button onClick={openMobileMenu}>
              <IcMenu />
            </Button>
          )}
        </div>
      )}
      {socialsEnabled && (
        <div className="flex row gap-6">
          <Button onClick={openLink(discord.link)}>
            <DiscordIcon />
          </Button>
          <Button onClick={openLink(twitter.link)}>
            <TwitterIcon />
          </Button>
        </div>
      )}
    </div>
  );
}

const MIN_SCALE = 0.1;
const ANIMATION_DURATION = 0.2;
const BARS = [0, 1, 2];
function MusicButton({ muted, onToggleMusic }: PassengerSocialButtonsProps) {
  return (
    <Button onClick={onToggleMusic}>
      <div className="flex flex-1 justify-between h-full w-full">
        {BARS.map(v => (
          <AnimatedBar animated={!muted} key={v} />
        ))}
      </div>
    </Button>
  );
}

interface AnimatedBarProps {
  animated: boolean;
}
function AnimatedBar({ animated }: AnimatedBarProps) {
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    if (!animated) {
      setScale(MIN_SCALE);
      return undefined;
    }
    const interval = setInterval(() => {
      const value = THREE.MathUtils.lerp(MIN_SCALE, 1, Math.random());
      setScale(value);
    }, ANIMATION_DURATION * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [animated]);

  const translateY = (1 - scale) * 50;
  return (
    <div className="transition-transform duration-200" style={{ transform: `translateY(${translateY}%)` }}>
      <div
        className="h-full w-[4px] bg-white transition-transform duration-200"
        style={{ transform: `scale(1, ${scale})` }}
      />
    </div>
  );
}
