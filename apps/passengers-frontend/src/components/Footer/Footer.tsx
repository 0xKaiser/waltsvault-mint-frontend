import { FOOTER_LEGAL_COPYRIGHT, SOCIAL_MEDIA } from 'constants/common';

import useBreakpoints from '@twl/common/hooks/useBreakpoints';
import useIsElementVisible from '@twl/common/hooks/useIsElementVisible';
import DynamicAnimatedText from 'components/DynamicAnimatedText';
import NavigationLink from 'components/NavigationLink';
import TextTypingAnimation from 'components/TextTypingAnimation';
import React from 'react';

import { INTERSECTION_OBSERVER_OPTIONS, LINK_CLASSES, SMART_CONTRACT_TEXT } from './Footer.constants';

export default function Footer() {
  const [smartContractTextRef, isSmartContractRendered] = useIsElementVisible(INTERSECTION_OBSERVER_OPTIONS);
  const [connectTextRef, isConnectTextRendered] = useIsElementVisible(INTERSECTION_OBSERVER_OPTIONS);
  const [linksRef, isLinksRendered] = useIsElementVisible(INTERSECTION_OBSERVER_OPTIONS);
  const { isMobile } = useBreakpoints();

  function renderLinks() {
    return Object.entries(SOCIAL_MEDIA.whiteList).map(([text, link]) => (
      <NavigationLink
        key={text}
        to={link.link}
        iconComponent={<img src={link.icon} alt={link.alt} className="w-10 sm:w-16 h-10 sm:h-16" />}
        navigationLinkClasses="pb-14 lg:pb-0 items-center"
        className={LINK_CLASSES}>
        {`_${text}`}
      </NavigationLink>
    ));
  }

  return (
    <div className="flex justify-center">
      <div className="flex flex-col w-full 2xl:w-[50vw] mx-8 sm:mx-20">
        <div className="flex flex-col h-full">
          <div className="pb-8 sm:pb-10">
            <DynamicAnimatedText
              separator="<br>"
              lineAnimationDuration={0.1}
              stagger={0.1}
              textRef={smartContractTextRef}
              isTextVisible={isSmartContractRendered}>
              {SMART_CONTRACT_TEXT}
            </DynamicAnimatedText>
          </div>
          <div ref={connectTextRef}>
            {isConnectTextRendered && (
              <div className="w-full">
                {!isMobile ? (
                  <h1 className="flex justify-center">
                    <TextTypingAnimation duration={0.5}>CONNECT</TextTypingAnimation>
                  </h1>
                ) : (
                  <h3 className="flex justify-center mt-8">
                    <TextTypingAnimation duration={0.5}>CONNECT</TextTypingAnimation>
                  </h3>
                )}
              </div>
            )}
          </div>
          <div ref={linksRef}>
            {isLinksRendered && (
              <div className="flex flex-col lg:flex-row w-full pt-9 lg:pt-0 lg:h-48 border border-white items-start lg:items-center pl-8 lg:pl-0 mt-16 lg:mt-8">
                {renderLinks()}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-row my-16">
          <div className="flex flex-1 place-content-center">
            <TextTypingAnimation duration={1} className="body items-center text-center text-white">
              {FOOTER_LEGAL_COPYRIGHT.whiteList}
            </TextTypingAnimation>
          </div>
        </div>
      </div>
    </div>
  );
}
