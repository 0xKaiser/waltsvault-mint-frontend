import React from 'react';
import WORK_1 from '../assets/work/1.mp4';
import WORK_2 from '../assets/work/2.jpg';
import WORK_3 from '../assets/work/3.mp4';
import WORK_4 from '../assets/work/4.mp4';
import WORK_5 from '../assets/work/5.mp4';
import WORK_6 from '../assets/work/6.mp4';
import WORK_7 from '../assets/work/7.mp4';
import WORK_8 from '../assets/work/8.jpg';
import WORK_9 from '../assets/work/9.mp4';
import WORK_10 from '../assets/work/10.jpg';
import WORK_11 from '../assets/work/11.jpg';
import { useWindowSize } from '../utils/useWindowSize';

export const MyWork = () => {
  const { width } = useWindowSize();
  const isMobile = width <= 650;

  return (
    <div className="w-full max-w-[908px] flex flex-col px-[24px]">
      <div className="w-full mb-[3px]">
        <video autoPlay muted loop playsInline src={WORK_1} />
      </div>

      <div className={`w-full flex ${isMobile ? 'flex-col' : ''}`}>
        <div className={`flex-1 flex flex-col ${isMobile ? '' : 'mr-[3px]'}`}>
          <div className="w-full flex mb-[3px]">
            <div className="flex-1 mr-[3px]">
              <img src={WORK_2} alt="work2" />
            </div>
            <div className="flex-1">
              <video autoPlay muted loop playsInline src={WORK_3} />
            </div>
          </div>
          <div className="w-full flex mb-[3px]">
            <div className="flex-1 mr-[3px]">
              <video autoPlay muted loop playsInline src={WORK_4} />
            </div>
            <div className="flex-1">
              <video autoPlay muted loop playsInline src={WORK_5} />
            </div>
          </div>
        </div>
        <div className={`flex-1 ${isMobile ? 'mb-[3px]' : ''}`}>
          <video autoPlay muted loop playsInline src={WORK_6} />
        </div>
      </div>

      <div className={`w-full flex ${isMobile ? 'flex-col' : ''}`}>
        <div className={`flex-1 ${isMobile ? 'mb-[3px]' : 'mr-[3px]'}`}>
          <video autoPlay muted loop playsInline src={WORK_7} />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="w-full flex mb-[3px]">
            <div className="flex-1 mr-[3px]">
              <img src={WORK_8} alt="work1" />
            </div>
            <div className="flex-1">
              <video autoPlay muted loop playsInline src={WORK_9} />
            </div>
          </div>
          <div className="w-full flex">
            <div className="flex-1 mr-[3px]">
              <img src={WORK_10} alt="work1" />
            </div>
            <div className="flex-1">
              <img src={WORK_11} alt="work1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
