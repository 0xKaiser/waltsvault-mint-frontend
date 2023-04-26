import { BREAKPOINTS } from 'constants/common';

import useBreakpoints from '@twl/common/hooks/useBreakpoints';
import useWindowInnerDimensions from '@twl/common/hooks/useWindowInnerDimensions';
import TWLLogo from 'assets/images/TWL-logo.png';
import DynamicAnimatedText from 'components/DynamicAnimatedText';
import SpinningStar from 'components/SpinningStar';
import TextTypingAnimation from 'components/TextTypingAnimation';
import React, { useCallback, useEffect, useState } from 'react';

import { BIOS_SETUP_TEXT, BOTTOM_INTRO_TEXT, INITIALIZE_TEXT, NUMBER_OF_STAGES } from './Intro.constants';

interface IntroProps {
  onComplete: () => void;
}
export default function Intro({ onComplete }: IntroProps) {
  const [stage, setStage] = useState(0);
  const [firstScreenStage, setFirstScreenStage] = useState(0);
  const { isMobile } = useBreakpoints();
  const { innerHeight: windowHeight, innerWidth: windowWidth } = useWindowInnerDimensions();

  const welcomeText = `Welcome to ${!isMobile ? '' : '<br>'}The White List...`;

  function onContinueFirstScreenStage() {
    setFirstScreenStage(prevSubStage => prevSubStage + 1);
  }

  const continueStage = useCallback(() => {
    setStage(prevStage => prevStage + 1);
  }, []);

  function restart() {
    setStage(-1);
    setFirstScreenStage(-1);
  }

  function prepareBiosSetupText() {
    const lineHeight = 25;
    const numberOfEmptyLines = windowHeight / lineHeight;
    let biosText = BIOS_SETUP_TEXT;
    for (let i = 0; i < numberOfEmptyLines; i += 1) {
      biosText += '<div>&nbsp;<div><br>';
    }
    return biosText;
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (stage !== 0) return;
      const pressedKey = event.key.toUpperCase();

      if (pressedKey === 'Y' && firstScreenStage > 2) {
        continueStage();
      } else if (pressedKey === 'N') {
        restart();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [continueStage, stage, firstScreenStage]);

  useEffect(() => {
    if (stage < 0) {
      setStage(0);
      setFirstScreenStage(0);
    }
    if (stage === NUMBER_OF_STAGES) {
      onComplete();
    }

    if (stage === 1 || stage === 3) {
      setTimeout(() => {
        continueStage();
      }, 3000);
    }
  }, [stage, continueStage, onComplete]);

  function firstIntroStage() {
    return (
      <div className="h-full flex flex-col">
        {stage === 0 && (
          <>
            <div className="flex basis-1/4">
              <DynamicAnimatedText separator="<br>" lineAnimationDuration={0.8} onFinish={onContinueFirstScreenStage}>
                {INITIALIZE_TEXT}
              </DynamicAnimatedText>
            </div>
            <div className="flex basis-1/2 flex-col items-center">
              <div>
                {firstScreenStage >= 1 && (
                  <div className="relative">
                    <div
                      className="absolute w-full h-full bottom-0 bg-black left-0 reveal"
                      onAnimationEnd={onContinueFirstScreenStage}
                    />
                    <img src={TWLLogo} alt="TWL Logo" className="w-fit h-fit" />
                  </div>
                )}
                {firstScreenStage >= 2 && (
                  <div className="flex justify-center">
                    <TextTypingAnimation
                      className="body-small sm:body"
                      duration={2}
                      onComplete={onContinueFirstScreenStage}>
                      Do you want to continue? (Y/N)
                    </TextTypingAnimation>
                  </div>
                )}
                {windowWidth <= BREAKPOINTS.md && firstScreenStage >= 3 && (
                  <div className="flex justify-center">
                    <div className="flex flex-row w-40 justify-between">
                      <div
                        className="w-16 h-16 border flex align-end justify-center mt-8"
                        onClick={continueStage}
                        aria-hidden="true">
                        <TextTypingAnimation delay={0} className="button items-center">
                          Y
                        </TextTypingAnimation>
                      </div>
                      <div
                        className="w-16 h-16 border flex align-end justify-center mt-8"
                        onClick={restart}
                        aria-hidden="true">
                        <TextTypingAnimation
                          delay={0}
                          className="button items-center"
                          onComplete={onContinueFirstScreenStage}>
                          N
                        </TextTypingAnimation>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="body flex basis-1/4 items-end md:items-center">
              {((isMobile && firstScreenStage >= 4) || (!isMobile && firstScreenStage >= 3)) && (
                <DynamicAnimatedText lineAnimationDuration={1} separator="<br>">
                  {BOTTOM_INTRO_TEXT}
                </DynamicAnimatedText>
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  function textWithCursor(text: string) {
    return (
      <div className="flex w-full h-full justify-center items-center text-center">
        <TextTypingAnimation className="body" showCursor>
          {text}
        </TextTypingAnimation>
      </div>
    );
  }

  function thirdIntroStage() {
    return (
      <div className="h-full relative">
        <div className="h-full overflow-y-hidden overflow-x-hidden">
          <DynamicAnimatedText
            lineAnimationDuration={0.01}
            separator="<br>"
            preloadHeight={false}
            loadFromTheBottom
            stagger={0.01}
            onFinish={continueStage}>
            {prepareBiosSetupText()}
          </DynamicAnimatedText>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col md:px-20 md:pt-10 md:pb-27 px-8 pt-10 pb-10 justify-between relative">
      <div className={`pb-8 md:pb-14 ${stage === 2 ? 'absolute' : ''}`}>
        <SpinningStar />
      </div>
      {stage === -1 && <div />}
      {stage === 0 && firstIntroStage()}
      {stage === 1 && textWithCursor('Booting up...')}
      {stage === 2 && thirdIntroStage()}
      {stage === 3 && textWithCursor(welcomeText)}
    </div>
  );
}
