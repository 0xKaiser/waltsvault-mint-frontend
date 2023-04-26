import Modal from '@twl/common/components/Modal';
import useBreakpoints from '@twl/common/hooks/useBreakpoints';
import NavigationLink from 'components/NavigationLink';
import NavigationRoute from 'components/NavigationRoute';
import NoiseBackground from 'components/NoiseBackground';
import SpinningStar from 'components/SpinningStar';
import TextTypingAnimation from 'components/TextTypingAnimation';
import React, { useCallback, useState } from 'react';

import { Links, PAGE_ROUTES, SOCIAL_MEDIA_LINKS } from './Header.constants';

export default function Header() {
  const [renderIndex, setRenderIndex] = useState(0);

  const [isModalOpened, setIsModalOpened] = useState(false);
  const { isMobile } = useBreakpoints();

  const onGsapComplete = useCallback(() => {
    setRenderIndex(prevRenderIndex => prevRenderIndex + 1);
  }, []);

  function renderLinks(links: Links[]) {
    return links.map((link, index) => {
      const linkComponent =
        link.type === 'pageRoute' ? (
          <NavigationRoute
            key={link.text}
            to={link.to}
            onComplete={onGsapComplete}
            border={link.border}
            className={!isMobile ? link.desktopClasses : link.mobileClasses}>
            {link.text}
          </NavigationRoute>
        ) : (
          <NavigationLink
            key={link.text}
            to={link.to}
            className={!isMobile ? link.desktopClasses : link.mobileClasses}
            navigationLinkClasses="w-full flex justify-end"
            border={link.border}
            onComplete={onGsapComplete}>
            {link.text}
          </NavigationLink>
        );
      const shouldRender: Boolean =
        link.type === 'pageRoute' ? renderIndex >= index : renderIndex >= index + PAGE_ROUTES.length;
      return shouldRender && linkComponent;
    });
  }

  function onModalClickHandler() {
    setRenderIndex(0);
    setIsModalOpened(prevDisplayMobileMenu => !prevDisplayMobileMenu);
  }

  function renderMobileNavBar() {
    return (
      <div className="fixed flex flex-col w-full items-center">
        <div className="flex flex-col w-full h-full px-8">
          <div className={`flex flex-row w-full ${isModalOpened ? 'justify-end' : 'justify-between mt-10'}`}>
            <SpinningStar />
            <div className="flex justify-center items-center">
              <div className="pointer-events-auto" onClick={onModalClickHandler} aria-hidden="true">
                <TextTypingAnimation className="button items-center">_menu</TextTypingAnimation>
              </div>
              <Modal isOpen={isModalOpened}>
                <NoiseBackground>
                  <div className="px-8">
                    <div className="flex flex-row justify-end">
                      <div
                        className="w-16 h-16 border flex align-end justify-center mt-8"
                        onClick={onModalClickHandler}
                        aria-hidden="true">
                        <div className="button-large flex items-center">X</div>
                      </div>
                    </div>
                    <div className="flex flex-col h-full justify-between pb-14 ">
                      <div className="flex flex-col pt-[15vh]">{renderLinks(PAGE_ROUTES)}</div>
                      <div className="flex flex-col h-full mt-28">{renderLinks(SOCIAL_MEDIA_LINKS)}</div>
                    </div>
                  </div>
                </NoiseBackground>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderDesktopNavBar() {
    return (
      <div className="flex w-screen h-full ">
        <div className="flex flex-row w-full justify-between mx-20">
          <div className="mt-10">
            <SpinningStar />
          </div>
          <div className="mt-20 z-100 pointer-events-auto">
            <div>{renderLinks(PAGE_ROUTES)}</div>
            <div>{renderLinks(SOCIAL_MEDIA_LINKS)}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed flex flex-col w-full items-center pointer-events-none z-10">
      {isMobile ? renderMobileNavBar() : renderDesktopNavBar()}
    </div>
  );
}
