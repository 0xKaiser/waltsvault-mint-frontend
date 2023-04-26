import { FlightState } from 'constants/common';

import FlightListStatusBox from 'components/FlightList/FlightListStatusBox';
import gsap from 'gsap';
import React, { useEffect, useRef } from 'react';

interface FlightListContentProps {
  state: FlightState;
  flightSpots: number;
  reservedSpots: number;
}

export default function FlightListContent({ flightSpots, reservedSpots, state }: FlightListContentProps) {
  const containerRef = useRef(null);

  const showContent = !!TITLES[state];

  useEffect(() => {
    if (!containerRef.current || !showContent) return undefined;

    gsap.to(containerRef.current, {
      opacity: 1,
      pointerEvents: 'auto',
      duration: 1.6,
      delay: 0,
    });
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      gsap.to(containerRef.current, {
        opacity: 0,
        pointerEvents: 'none',
        duration: 1.6,
        delay: 0,
      });
    };
  }, [showContent]);

  const title = TITLES[state] || '';
  const textColor = state === FlightState.NoDataFound ? 'text-error' : 'text-primary-blue';

  function renderContent() {
    if (state === FlightState.CheckingProgress) return <FlightListStatusBox loading />;
    if (state === FlightState.NoDataFound) return <FlightListStatusBox error>no data found</FlightListStatusBox>;

    return (
      <div className="flex flex-col w-full gap-2 justify-center items-center">
        {!!flightSpots && (
          <FlightListStatusBox>
            <SpotsText spots={flightSpots}>flight list spot</SpotsText>
          </FlightListStatusBox>
        )}
        {!!reservedSpots && (
          <FlightListStatusBox>
            <SpotsText spots={reservedSpots}>reserve list spot</SpotsText>
          </FlightListStatusBox>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="cover flex flex-col justify-center items-center pointer-events-none opacity-0">
      <div className="relative">
        {renderContent()}
        <div className={`text-center w-full caption-small uppercase absolute top-[-30px] ${textColor}`}>{title}</div>
      </div>
    </div>
  );
}

interface SpotsTextProps {
  spots: number;
  children: string;
}
function SpotsText({ spots, children }: SpotsTextProps) {
  return (
    <p className="text-primary-blue">
      x<div className="numbers inline">{spots}</div> {children}
    </p>
  );
}

const TITLES: Record<number, string> = {
  [FlightState.CheckingProgress]: 'checking flight status',
  [FlightState.NoDataFound]: 'system error',
  [FlightState.FlightSpots]: 'welcome aboard recruit',
};
