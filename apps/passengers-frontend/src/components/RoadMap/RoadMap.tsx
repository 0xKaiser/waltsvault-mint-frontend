import useWindowInnerDimensions from '@twl/common/hooks/useWindowInnerDimensions';
import { interpolate } from '@twl/common/utils/math';
import BracketsHighlight from 'components/BracketsHighlight';
import React, { useEffect, useRef, useState } from 'react';
import { Event } from 'three';
import { AppEventsType } from 'types/interfaces';

import { ROAD_MAP_DATA, RoadMapContentData } from './RoadMap.constants';

const SCROLL_EPSILON = 0.027;
interface RoadMapProps {
  scrollLocation: number;
}
function RoadMap(props: RoadMapProps) {
  const { scrollLocation } = props;

  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  const { innerHeight, innerWidth } = useWindowInnerDimensions();

  useEffect(() => {
    if (!contentRef.current) {
      return;
    }
    if (innerWidth < 500 && contentHeight) return;

    const { height } = contentRef.current.getBoundingClientRect();
    setContentHeight(height);
  }, [contentHeight, innerHeight, innerWidth]);

  useEffect(() => {
    function handleScrollEvent(event: Event) {
      if (!contentRef.current) return;

      const scrollProgress = interpolate(
        (event?.progress as number) ?? 0,
        [scrollLocation - SCROLL_EPSILON, scrollLocation + SCROLL_EPSILON],
        [0, 1],
        'clamp',
      );

      const translateDistance = -contentHeight * scrollProgress;
      contentRef.current.style.transform = `translateY(${translateDistance}px)`;
    }
    window.eventDispatcher.addEventListener(AppEventsType.onPassengersScrollProgress, handleScrollEvent);

    return () => {
      window.eventDispatcher.removeEventListener(AppEventsType.onPassengersScrollProgress, handleScrollEvent);
    };
  }, [contentHeight, innerHeight, scrollLocation]);

  return (
    <div className="h-screen w-screen flex justify-center overflow-visible">
      <div className="passengers flex flex-col w-full min-h-full px-[5%]  relative text-white overflow-visible">
        <div ref={contentRef} className="pb-[100vh]">
          <div className="flex flex-col items-center mb-24">
            <h1 className="text-center">FLIGHT PATH</h1>
          </div>
          <div className="w-full flex flex-col items-center relative">
            {ROAD_MAP_DATA.map(({ date, content, title }, index) => {
              const barOpacity = index < ROAD_MAP_DATA.length - 1 ? 1 : 0;
              return (
                <div className="w-full max-w-[1200px] flex items-stretch">
                  <div className="flex md:pl-[140px]">
                    <div
                      className="min-h-[100px] min-w-[4px] max-w-[4px] bg-primary-blue mr-[40px] md:mr-[80px]"
                      style={{ opacity: barOpacity }}
                    />
                  </div>
                  <div className="flex flex-col">
                    <DateRow date={date}>{title}</DateRow>
                    {content.map(c => (
                      <RoadMapContent {...c} />
                    ))}
                  </div>
                </div>
              );
            })}
            <div />
          </div>
        </div>
      </div>
    </div>
  );
}
export default RoadMap;

interface DateRowProps {
  date?: string;
  children?: string;
}
function DateRow(props: DateRowProps) {
  const { date, children } = props;
  return (
    <div className="w-full relative text-primary-blue">
      <div className="absolute left-0">
        <div className="absolute right-[30px] md:right-[70px]">
          <Dot />
        </div>
      </div>
      <div className="md:absolute md:left-0">
        {date && <p className="text-primary-blue md:absolute md:right-[120px] min-w-[140px] md:text-right">{date}</p>}
      </div>
      {children && <div className="caption-small pb-3 uppercase">{children}</div>}
    </div>
  );
}

function Dot() {
  return <div className="h-[24px] w-[24px] rounded-full bg-primary-blue" />;
}

function RoadMapContent(props: RoadMapContentData) {
  const { type, text } = props;

  switch (type) {
    case 'body':
      return <div className="description-medium pb-12 whitespace-pre-wrap">{text}</div>;
    case 'title':
      return <h3 className="pb-10 uppercase">{text}</h3>;
    case 'sub-title':
      return <p className="pb-10 text-primary-blue uppercase">{text}</p>;
    case 'content-box':
      return (
        <div className="pb-20">
          <div className="w-full p-5 relative">
            <div className="w-full p-5 bg-primary-blue">
              <p className="text-black">{text}</p>
            </div>
            <BracketsHighlight />
          </div>
        </div>
      );
    default:
      return (
        <div className="w-full pt-10 pb-20">
          <div className="w-full h-[2px] bg-primary-blue" />
        </div>
      );
  }
}
