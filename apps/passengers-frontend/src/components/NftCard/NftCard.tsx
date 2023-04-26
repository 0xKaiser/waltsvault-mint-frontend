import useBreakpoints from '@twl/common/hooks/useBreakpoints';
import BracketsHighlight from 'components/BracketsHighlight';
import React from 'react';

export interface NftCardProps {
  image: string;
  badge: string;
  title: string;
  subtitle?: string;
  quote: string;
  distanceTraveled: number;
  galaxiesVisited: number;
  distressCallsAnswered: number;
}

export default function NftCard(props: NftCardProps) {
  const { image, badge, title, subtitle, quote, distanceTraveled, galaxiesVisited, distressCallsAnswered } = props;
  const { isDesktop } = useBreakpoints();

  if (isDesktop)
    return (
      <div className="group pr-4 last:pr-20 first:pl-20">
        <div className="relative">
          <div className="bg-blue-500 relative transition-all w-[178px] group-hover:w-[884px] overflow-hidden">
            <div className="cover bg-[rgba(0,0,0,0.9)]  " />
            <div className="flex relative transition-all h-[524px] w-[178px] group-hover:w-[884px]">
              <div className="transition-transform translate-x-[-85px] group-hover:translate-x-0">
                <img src={image} alt="passenger_0" className="h-[524px] w-[524px] max-w-[524px] clip-corner" />
              </div>
              <div className="min-w-[360px] flex flex-col flex-1 justify-center pr-16">
                {renderSection(distanceTraveled, 'lightyears traveled')}
                {renderSection(galaxiesVisited, 'galaxies visited')}
                {renderSection(distressCallsAnswered, 'distress calls answered')}
              </div>
            </div>
          </div>
          <div className="p-8 bg-[rgba(0,0,0,0.8)] absolute bottom-0 left-[-64px] inline-flex flex-col mt-[0] translate-y-[50%] transition-transform scale-0 group-hover:scale-100">
            <h3>{title}</h3>
            {subtitle && <p className="caption uppercase mb-3">{subtitle}</p>}
            <p className="whitespace-pre-line">{quote}</p>
            <BracketsHighlight />
          </div>
          <div className="absolute top-0 left-0 translate-x-[-50%] translate-y-[-50%] transition-transform scale-0 group-hover:scale-100">
            <img src={badge} alt="badge" className="animate-spin-slow" />
          </div>
        </div>
      </div>
    );

  return (
    <div className="group pr-4">
      <div className="relative w-[112px]  group-hover:w-[360px]  overflow-hidden transition-all">
        <div className="relative w-ful h-full">
          <div className="bg-blue-500 relative h-[360px]  w-full">
            <div className="cover bg-[rgba(0,0,0,0.9)]" />
            <div className="flex relative transition-all  w-full h-full">
              <div className="transition-transform translate-x-[-68px] group-hover:translate-x-0 w-full h-full">
                <img src={image} alt="passenger_0" className="h-full min-w-[360px]  max-w-full clip-corner" />
              </div>
            </div>
          </div>
        </div>
        <div className="transition-transform scale-0 group-hover:scale-100  min-w-[360px] max-w-[360px] flex-col items-center pt-5">
          <div className="p-8 bg-[rgba(0,0,0,0.8)] inline-flex flex-col relative max-w-full">
            <h3>{title}</h3>
            {subtitle && <p className="caption uppercase mb-3">{subtitle}</p>}
            <p className="md:whitespace-pre-line">{quote}</p>
            <BracketsHighlight />
          </div>

          <div className=" w-full relative flex  justify-between">
            {renderSection(distanceTraveled, 'lightyears traveled')}
            {renderSection(galaxiesVisited, 'galaxies visited')}
            {renderSection(distressCallsAnswered, 'distress calls answered')}
          </div>
        </div>
      </div>
    </div>
  );
}

function renderSection(number: number, description: string) {
  return (
    <div className="flex-col md:mb-14 md:last:mb-0 items-center">
      <p className="text-right numbers">{number.toLocaleString()}</p>
      <p className={`text-right `}>{description}</p>
    </div>
  );
}
