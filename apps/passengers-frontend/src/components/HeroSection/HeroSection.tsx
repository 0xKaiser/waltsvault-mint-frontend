import useBreakpoints from '@twl/common/hooks/useBreakpoints';
import TextTypingAnimation from 'components/TextTypingAnimation';
import React, { useEffect, useState } from 'react';

const INITIATE_CAMERA_TEXT = '//initiate camera';
const FIND_HUMAN_TEXT = '//find human';

export default function HeroSection() {
  const [date, setDate] = useState(new Date());
  const [coordinate, setCoordinate] = useState('100.100');
  const { isMobile } = useBreakpoints();
  const formattedTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 1000);

    function handleWindowMouseMove(event: MouseEvent) {
      setCoordinate(`${event.clientX}.${event.clientY}`);
    }

    window.addEventListener('mousemove', handleWindowMouseMove);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handleWindowMouseMove);
    };
  }, []);

  return (
    <div className="body absolute top-40 mx-8 sm:mx-20">
      <div className="h-screen">
        {isMobile && <TextTypingAnimation duration={0.4}>{INITIATE_CAMERA_TEXT}</TextTypingAnimation>}
        <TextTypingAnimation duration={0.4}>{FIND_HUMAN_TEXT}</TextTypingAnimation>
        {!isMobile && (
          <>
            <TextTypingAnimation duration={0.4} delay={0.4}>
              {formattedTime}
            </TextTypingAnimation>
            <TextTypingAnimation duration={0.4} delay={0.8}>
              {formattedDate}
            </TextTypingAnimation>
            <TextTypingAnimation duration={0.4} delay={1.2}>
              {coordinate}
            </TextTypingAnimation>
            <TextTypingAnimation duration={0.4} delay={1.2}>
              /
            </TextTypingAnimation>
            <TextTypingAnimation delay={1}>[TWL]</TextTypingAnimation>
          </>
        )}
      </div>
    </div>
  );
}
