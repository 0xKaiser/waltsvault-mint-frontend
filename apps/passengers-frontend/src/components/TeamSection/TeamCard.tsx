import useBreakpoints from '@twl/common/hooks/useBreakpoints';
import useTeamDimensions from 'hooks/useTeamDimensions';
import React, { useMemo } from 'react';
import { MathUtils } from 'three';

import { TEAM_CARD_ACTIVE_SCALE } from './TeamSection.constants';

interface TeamCardProps {
  name: string;
  title: string;
  avatar: string;
  centerOffset: number;
  scrollOffset: number;
  social?: { link: string; icon: string; alt: string }[];
}
export default function TeamCard(props: TeamCardProps) {
  const { name, title, avatar, centerOffset, scrollOffset, social } = props;

  const [{ cardWidth, cardHeight, scaledWidth, scaledHeight, slotWidth, cardMargin }, translateY] = useTeamDimensions();
  const { isDesktop } = useBreakpoints();

  const animation = useMemo(() => {
    const initialDistance = slotWidth * centerOffset;
    const distanceFromCenter = Math.abs(initialDistance + scrollOffset);
    const animationValue = MathUtils.clamp(1 - Math.abs(distanceFromCenter / slotWidth), 0, 1);
    return animationValue;
  }, [scrollOffset, centerOffset, slotWidth]);

  const opacity = MathUtils.lerp(0.3, 1, animation);
  const textOpacity = animation;
  const scale = MathUtils.lerp(1, TEAM_CARD_ACTIVE_SCALE, animation);
  const yOffset = translateY(scale) / scale;
  const textRightPos = isDesktop ? cardWidth + (scaledWidth - cardWidth) / 2 + 32 : 0;
  const textTopPos = isDesktop ? 0 : scaledHeight + 32;
  const textBottomPos = isDesktop ? -(scaledHeight - cardHeight) : undefined;

  return (
    <div className="relative" style={{ opacity, margin: cardMargin }}>
      <div
        className="relative"
        style={{
          height: cardHeight,
          width: cardWidth,
          transform: `scale(${scale}) translateY(${yOffset}px)`,
        }}>
        <div className="h-full w-full flex p-5 items-end">
          <img className="cover clip-corner-large un-blur-image" alt={`team member ${name}`} src={avatar} />
          {social && (
            <div className="relative flex gap-5">
              {social.map(({ icon, link, alt }) => (
                <a key={link} href={link} target="_blank" rel="noreferrer">
                  <img className="h-[21px] w-[21px]" src={icon} alt={alt} />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
      <div
        className="absolute  flex flex-col justify-end pointer-events-none"
        style={{ right: textRightPos, top: textTopPos, bottom: textBottomPos, opacity: textOpacity }}>
        <p className="caption uppercase text-primary-blue">{title}</p>
        <h2>{name}</h2>
      </div>
    </div>
  );
}
