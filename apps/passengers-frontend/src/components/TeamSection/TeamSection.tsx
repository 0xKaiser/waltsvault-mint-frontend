import useHorizontalSwipe from '@twl/common/hooks/useHorizontalSwipe';
import useWindowInnerDimensions from '@twl/common/hooks/useWindowInnerDimensions';
import useTeamDimensions from 'hooks/useTeamDimensions';
import React, { useMemo, useState } from 'react';
import Sound from 'utils/sound';

import TeamCard from './TeamCard';
import { TEAM, TEAM_CARD_ACTIVE_SCALE } from './TeamSection.constants';

function TeamSection() {
  const { innerWidth } = useWindowInnerDimensions();
  const [scrollOffset, setScrollOffset] = useState(0);
  const [{ slotWidth, scaledWidth }, getTeamCardYTransform] = useTeamDimensions();
  const [swipeHandlers, { snapToNext, snapToPrevious }] = useHorizontalSwipe(
    offset => {
      const maxOffset = TEAM.length * slotWidth;
      const newOffset = offset % maxOffset;
      setScrollOffset(newOffset);
    },
    {
      velocityStrength: 0,
      snapInterval: slotWidth,
    },
  );

  const teamData = useMemo(() => {
    const minNumber = Math.max((innerWidth * 4) / slotWidth, TEAM.length * 4);
    const minOddNumber = minNumber - (minNumber % 2) + 1;
    const expandedTeam = [...TEAM];

    for (let i = 0; i < minOddNumber - TEAM.length; i += 1) {
      expandedTeam.push(TEAM[i % TEAM.length]);
    }

    return expandedTeam;
  }, [innerWidth, slotWidth]);

  const arrowsPadding = scaledWidth + 32;
  const yCardTransform = getTeamCardYTransform(TEAM_CARD_ACTIVE_SCALE);

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center overflow-visible passengers">
      <div className="relative">
        <div {...swipeHandlers} className="flex" style={{ transform: `translateX(${scrollOffset}px)` }}>
          {teamData.map((member, index) => {
            const key = index + member.name;
            return (
              <TeamCard
                key={key}
                {...member}
                centerOffset={index - Math.floor(teamData.length / 2)}
                scrollOffset={scrollOffset}
              />
            );
          })}
        </div>
        <div className="absolute flex justify-center w-full bottom-[110%] ">
          <h1>OUR TEAM</h1>
        </div>
        <div
          className="cover flex justify-center items-center pointer-events-none"
          style={{ transform: `translateY(${yCardTransform}px)` }}>
          <div className=" pointer-events-auto">
            <Arrow direction="left" onClick={snapToPrevious} />
          </div>
          <div style={{ width: arrowsPadding }} />
          <div className=" pointer-events-auto">
            <Arrow direction="right" onClick={snapToNext} />
          </div>
        </div>
      </div>
    </div>
  );
}

interface ArrowProps {
  direction: 'left' | 'right';
  onClick: () => void;
}
function Arrow({ direction, onClick }: ArrowProps) {
  const transform = `rotate(${direction === 'left' ? -90 : 90}deg)`;
  function onLocalClick() {
    Sound.playSfxClick();
    if (onClick) onClick();
  }
  return (
    <div
      aria-label={`arrow ${direction}`}
      role="button"
      tabIndex={0}
      onClick={onLocalClick}
      onKeyDown={onLocalClick}
      className="passengers h-16 w-16 border-b-primary-blue border-x-transparent border-solid border-b-[64px] border-x-[32px]"
      style={{ transform }}
    />
  );
}

export default TeamSection;
