/* eslint-disable react/jsx-no-comment-textnodes */
import useBreakpoints from '@twl/common/hooks/useBreakpoints';
import IMG_PASSENGER_BADGE from 'assets/images/passengers/img_passenger_badge_3.png';
import BracketsHighlight from 'components/BracketsHighlight';
import ContentContainer from 'components/ContentContainer';
import ContentParagraph from 'components/ContentParagraph';
import ContentSection from 'components/ContentSection';
import ContentSeparator from 'components/ContentSeparator';
import PassengersSocialButtons from 'components/PassengersSocialButtons';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { LOG_PAGE_HEADER, LOG_PAGE_LOG, LOG_PAGE_SECTIONS } from './LogPage.constants';

export default function LogPage() {
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

  function renderSections() {
    return (
      <>
        {LOG_PAGE_SECTIONS.map(({ title, description, paragraphs }, index) => (
          <React.Fragment key={title}>
            <ContentSection title={title} description={description}>
              {paragraphs.map(paragraph => (
                <ContentParagraph key={paragraph.title} title={paragraph.title}>
                  {paragraph.content}
                </ContentParagraph>
              ))}
            </ContentSection>
            {index < LOG_PAGE_SECTIONS.length - 1 && <ContentSeparator />}
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
        {renderTitle(LOG_PAGE_HEADER.title)}
        <ContentSeparator />
        <div className="description  pb-16">{LOG_PAGE_HEADER.subtitle}</div>
        <div className="description pb-16">{LOG_PAGE_HEADER.description}</div>
        <div className="p-5 w-full relative mb-16">
          <div className="w-full p-6 text-black bg-primary-blue">
            <div className="caption-small pb-3">{LOG_PAGE_LOG.title}</div>
            <p className="text-black">{LOG_PAGE_LOG.description}</p>
          </div>
          <BracketsHighlight />
        </div>
        {renderSections()}
        <div className="mt-20">
          <PassengersSocialButtons />
        </div>
      </ContentContainer>
    </div>
  );
}
