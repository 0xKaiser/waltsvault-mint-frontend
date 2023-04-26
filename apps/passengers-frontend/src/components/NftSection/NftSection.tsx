import useHorizontalSwipe from '@twl/common/hooks/useHorizontalSwipe';
import IMG_PASSENGER_0 from 'assets/images/passengers/img_passenger_0.jpg';
import IMG_PASSENGER_1 from 'assets/images/passengers/img_passenger_1.jpg';
import IMG_PASSENGER_2 from 'assets/images/passengers/img_passenger_2.png';
import IMG_PASSENGER_3 from 'assets/images/passengers/img_passenger_3.png';
import IMG_PASSENGER_4 from 'assets/images/passengers/img_passenger_4.png';
import IMG_PASSENGER_5 from 'assets/images/passengers/img_passenger_5.png';
import IMG_PASSENGER_BADGE_0 from 'assets/images/passengers/img_passenger_badge_0.png';
import IMG_PASSENGER_BADGE_1 from 'assets/images/passengers/img_passenger_badge_1.png';
import IMG_PASSENGER_BADGE_2 from 'assets/images/passengers/img_passenger_badge_2.png';
import IMG_PASSENGER_BADGE_3 from 'assets/images/passengers/img_passenger_badge_3.png';
import IMG_PASSENGER_BADGE_4 from 'assets/images/passengers/img_passenger_badge_4.png';
import IMG_PASSENGER_BADGE_5 from 'assets/images/passengers/img_passenger_badge_5.png';
import NftCard, { NftCardProps } from 'components/NftCard/NftCard';
import React, { useRef } from 'react';

import { NFT_SECTION_CONTENT_WIDTH_MOBILE } from './NftSection.const';

const NFTS: NftCardProps[] = [
  {
    image: IMG_PASSENGER_0,
    badge: IMG_PASSENGER_BADGE_0,
    title: 'engineering',
    quote: 'No matter where you are in the\nuniverse, you can always call us\nin your time of need',
    distanceTraveled: 524,
    galaxiesVisited: 14,
    distressCallsAnswered: 9,
  },
  {
    image: IMG_PASSENGER_1,
    badge: IMG_PASSENGER_BADGE_1,
    title: 'security and tactical',
    quote: 'Our missions are never easy,\nbut knowing we made a\ndifference makes it all worth it',
    distanceTraveled: 1964,
    galaxiesVisited: 45,
    distressCallsAnswered: 67,
  },
  {
    image: IMG_PASSENGER_2,
    badge: IMG_PASSENGER_BADGE_2,
    title: 'medical',
    quote: 'We’ve only discovered a small\npiece of the universe so far. We\nneed to keep exploring',
    distanceTraveled: 2996,
    galaxiesVisited: 97,
    distressCallsAnswered: 89,
  },
  {
    image: IMG_PASSENGER_3,
    badge: IMG_PASSENGER_BADGE_3,
    title: 'pkf',
    subtitle: '[peacekeeping federation]',
    quote:
      "I want to make the universe a\nbetter place for everyone. I\nknow it won't be easy, but\nPassengers never quit",
    distanceTraveled: 5634,
    galaxiesVisited: 111,
    distressCallsAnswered: 97,
  },
  {
    image: IMG_PASSENGER_4,
    badge: IMG_PASSENGER_BADGE_4,
    title: 'Linguistics',
    quote: "There’s no challenge too big, no\nmission that's too dangerous. I’m\nready for anything",
    distanceTraveled: 7064,
    galaxiesVisited: 132,
    distressCallsAnswered: 106,
  },
  {
    image: IMG_PASSENGER_5,
    badge: IMG_PASSENGER_BADGE_5,
    title: 'Galactic Navigation',
    quote:
      'We all dream of being heroes\nwhen we’re kids, so every single\none of us knows how much it\nmeans to be a Passenger.',
    distanceTraveled: 10542,
    galaxiesVisited: 197,
    distressCallsAnswered: 112,
  },
];

export default function NftSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [handlers, { scrollOffset }] = useHorizontalSwipe((offset: number) => {
    if (!containerRef.current) return;

    const { innerWidth } = window;
    const maxOffset = -Math.max(0, NFT_SECTION_CONTENT_WIDTH_MOBILE - innerWidth);
    scrollOffset.current = Math.min(0, Math.max(maxOffset, offset));
    containerRef.current.style.transform = `translateX(${scrollOffset.current}px)`;
  });

  function renderNftCards() {
    return NFTS.map(nft => <NftCard key={nft.title} {...nft} />);
  }

  return (
    <div {...handlers} className="passengers flex h-screen w-screen md:justify-center items-center  overflow-visible">
      <div
        ref={containerRef}
        className="flex h-full pt-[20vh] md:pt-0 md:items-center will-change-transform translate-x-0">
        {renderNftCards()}
      </div>
    </div>
  );
}
