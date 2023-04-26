/* eslint-disable react/jsx-no-comment-textnodes */
import useBreakpoints from '@twl/common/hooks/useBreakpoints';
import IMG_PASSENGER_BADGE from 'assets/images/passengers/img_passenger_badge_3.png';
import BracketsHighlight from 'components/BracketsHighlight';
import ContentContainer from 'components/ContentContainer';
import ContentSeparator from 'components/ContentSeparator';
import PassengersSocialButtons from 'components/PassengersSocialButtons';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { TERMS_PAGE_HEADER, TERMS_OF_SERVICE_SECTIONS, TERMS_OF_USE_SECTIONS } from './TermsPage.constants';

export default function TermsPage() {
  const navigate = useNavigate();
  const { isDesktop, isMobile } = useBreakpoints();

  // Removes global font scaling since it is not desired on this page....
  useEffect(() => {
    document.documentElement.style.fontSize = '100%';

    return () => {
      document.documentElement.style.fontSize = '';
    };
  }, []);

  function goHome() {
    navigate('/');
  }

  function renderSections(isTermsOfUse: boolean) {
    return (
      <>
        {(isTermsOfUse ? TERMS_OF_USE_SECTIONS : TERMS_OF_SERVICE_SECTIONS).map(({ title, paragraphs }) => (
          <React.Fragment key={title}>
            <div className="mt-8 mb-4 description-medium text-primary-blue lowercase">
              {title}
            </div>
            {paragraphs.map(paragraph => (
              <div className="mb-4 last:mb-0 description">{paragraph}</div>
            ))}
          </React.Fragment>
        ))}
      </>
    );
  }

  function renderTitle(title: string) {
    if (isMobile) return <h3>{title}</h3>;
    return <h2>{title}</h2>;
  }

  return (
    <div className="passengers text-white p-10">
      <div className="w-full flex justify-between pb-20">
        <button className="relative py-3 px-6" onClick={goHome} type="button">
          <p className="description">home</p>
          <BracketsHighlight size={12} />
        </button>
        <PassengersSocialButtons />
      </div>
      {!isDesktop && (
        <div className="w-full flex justify-center mb-12">
          <img className="min-h-[80px] min-w-[80px] animate-spin-slow" src={IMG_PASSENGER_BADGE} alt="spinning badge" />
        </div>
      )}
      <ContentContainer>
        {isDesktop && (
          <div className="absolute top-[0] right-[calc(100%+40px)]">
            <img
              className="min-h-[144px] min-w-[144px] animate-spin-slow"
              src={IMG_PASSENGER_BADGE}
              alt="spinning badge"
            />
          </div>
        )}
        {renderTitle(TERMS_PAGE_HEADER.title)}
        <ContentSeparator />
        <div className="mb-6 caption">{TERMS_PAGE_HEADER.termsOfServiceTitle}</div>
        <div className="mb-8 description">{TERMS_PAGE_HEADER.termsOfServiceSubtitle}</div>
        {renderSections(false)}
        <div className="mt-12 mb-6 caption">{TERMS_PAGE_HEADER.termsOfUseTitle}</div>
        <div className="mb-8 description">{TERMS_PAGE_HEADER.termsOfUseSubtitle}</div>
        {renderSections(true)}
        <div className="mt-20">
          <PassengersSocialButtons />
        </div>
      </ContentContainer>
    </div>
  );
}
