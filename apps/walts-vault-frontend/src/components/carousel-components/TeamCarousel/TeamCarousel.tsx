import useBreakpoints from '@twl/common/hooks/useBreakpoints';
import TEAM_1 from 'assets/videos/team/team-1.mp4';
import TEAM_2 from 'assets/videos/team/team-2.mp4';
import TEAM_3 from 'assets/videos/team/team-3.mp4';
import TEAM_4 from 'assets/videos/team/team-4.mp4';
import TEAM_5 from 'assets/videos/team/team-5.mp4';
import TEAM_6 from 'assets/videos/team/team-6.mp4';
import TEAM_7 from 'assets/videos/team/team-7.mp4';
import React from 'react';

import Carousel from '../Carousel';
import TeamCarouselCard from '../TeamCarouselCard';

const TEAM = [
  { src: TEAM_1, name: 'Cohl', title: 'Lead Artist' },
  { src: TEAM_2, name: 'Mickey', title: 'Concept and Design' },
  { src: TEAM_3, name: 'Betty', title: 'Public Relations' },
  { src: TEAM_4, name: 'Willie', title: 'Operations' },
  { src: TEAM_5, name: 'Felix', title: 'Community Management' },
  { src: TEAM_6, name: 'Bimbo', title: 'Foundation Supervisor' },
  { src: TEAM_7, name: 'Koko', title: 'Dev' },
];

interface TeamCarouselProps {
  lightOn: boolean;
}

export default function TeamCarousel({ lightOn }: TeamCarouselProps) {
  const { isMobile } = useBreakpoints();
  function renderTeamCard({ animation, data }: { animation: number; data: typeof TEAM[0] }) {
    return <TeamCarouselCard lightOn={lightOn} animation={animation} {...data} />;
  }

  const arrowsOffset = isMobile ? 280 : 180;

  return <Carousel images={TEAM} renderCard={renderTeamCard} arrowSize={90} arrowsOffset={arrowsOffset} />;
}
