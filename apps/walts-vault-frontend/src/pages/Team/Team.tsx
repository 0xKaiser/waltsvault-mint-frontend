import TeamCarousel from 'components/carousel-components/TeamCarousel';
import SubPageContainer from 'components/SubPageContainer';
import React from 'react';

interface TeamProps {
  lightOn: boolean;
}

export default function Team(props: TeamProps) {
  return (
    <SubPageContainer>
      <div className="relative flex justify-center items-center h-full w-full">
        <div className="relative h-[100%] w-[100%] flex justify-start items-center">
          <TeamCarousel {...props} />
        </div>
        <div className="cover z-20 pt-10 flex justify-center pointer-events-none">
          <h1>Team</h1>
        </div>
      </div>
    </SubPageContainer>
  );
}
