import { BREAKPOINTS } from 'constants/common';

import Modal from '@twl/common/components/Modal';
import useBreakpoints from '@twl/common/hooks/useBreakpoints';
import useWebGl from '@twl/common/hooks/useWebGl';
import useWindowInnerDimensions from '@twl/common/hooks/useWindowInnerDimensions';
import { ReactComponent as IcClose } from 'assets/icons/ic-close.svg';
import { ReactComponent as PassengersLogo } from 'assets/images/passengers-logo.svg';
import Button from 'components/Button';
import EnterBlackHoleButton from 'components/EnterBlackHoleButton';
import PassengersLoadingScreen from 'components/PassengersLoadingScreen/PassengersLoadingScreen';
import PassengersSocialButtons from 'components/PassengersSocialButtons';
import ScrollPrompt from 'components/ScrollPrompt';
import SideNavigation, { SideNavigationHandle } from 'components/SideNavigation/SideNavigation';
import { ThreeHtml } from 'components/ThreeHtml/ThreeHtml';
import gsap from 'gsap';
import useActiveTabDetector from 'hooks/useActiveTabDetector';
import React, { useEffect, useMemo, useRef, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import PassengersScene from 'rendering-engine/passengers/passengers-scene';
import { AppEventsType } from 'types/interfaces';
import { getCameraAnimationProgress, getIntroOpacity } from 'utils/passengers-helpers';
import Sound, { audio } from 'utils/sound';

import {
  HtmlContent,
  HTML_CONTENT,
  INITIAL_PROGRESS_ANIMATION,
  isSection,
  LOGO,
  MAX_SCROLL,
  PassengerState,
  SCROLLING_DISTANCE,
  SCROLL_EASING,
  SIDE_NAVIGATION_CONTENT,
} from './PassengersPage.constants';

import './PassengersPage.scss';

const EDIT_MODE = false;
const DISABLE_BLACK_HOLE = false;

export default function PassengersPage() {
  const [passengersWebGlContainer, passengerScene] = useWebGl<PassengersScene>(PassengersScene, {
    logo: LOGO,
    htmlContent: [...HTML_CONTENT],
    editMode: EDIT_MODE,
    disabledBlackHole: DISABLE_BLACK_HOLE,
  });
  const { isTabActive } = useActiveTabDetector();
  const { isDesktop } = useBreakpoints();
  const { innerHeight } = useWindowInnerDimensions();

  const sideNavigationContainerRef = useRef<HTMLDivElement>(null);
  const sideNavigationRef = useRef<SideNavigationHandle>(null);
  const mobileSideNavigationRef = useRef<SideNavigationHandle>(null);

  const [passengerState, setPassengerState] = useState(PassengerState.loading);
  const [mutedAudio, setMutedAudio] = useState(Sound.getMute());
  const [userHasScrolled, setUserHasScrolled] = useState(false);
  const [activeContent, setActiveContent] = useState<HtmlContent | undefined>();
  const [logoActive, setLogoActive] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // const navigation = useNavigate();

  const playEntrySound = [PassengerState.scrolling, PassengerState.travelAnimation].includes(passengerState);
  useEffect(() => {
    if (!playEntrySound) return undefined;
    Sound.play(audio.entryAudio);
    return () => {
      audio.entryAudio.pause();
    };
  }, [playEntrySound]);

  useEffect(() => {
    Sound.setMute(!isTabActive || (isTabActive && mutedAudio));
  }, [isTabActive, mutedAudio]);

  const initialHeightRef = useRef(window.innerHeight);

  function getMaxScroll() {
    if (window.innerWidth <= BREAKPOINTS.md) return (SCROLLING_DISTANCE - 1) * initialHeightRef.current;
    return (SCROLLING_DISTANCE - 1) * window.innerHeight;
  }

  const scrollHeight = useMemo(() => {
    if (!DISABLE_BLACK_HOLE && passengerState !== PassengerState.scrolling) return 0;
    if (!isDesktop) return initialHeightRef.current * SCROLLING_DISTANCE;
    return innerHeight * SCROLLING_DISTANCE;
  }, [innerHeight, isDesktop, passengerState]);

  const [scrollAnimation, setScrollAnimation] = useState(0);
  useEffect(() => {
    const animation = { value: 0 };
    function handleScroll() {
      if (passengerState !== PassengerState.scrolling) return;
      if (passengerState === PassengerState.scrolling && !userHasScrolled) setUserHasScrolled(true);
      gsap.to(animation, {
        value: (window.scrollY / getMaxScroll()) * MAX_SCROLL,
        duration: SCROLL_EASING,
        onUpdate: () => {
          const scene = passengerScene as PassengersScene;
          const { blackHole } = scene;
          if (!scene || !blackHole) return;

          // eslint-disable-next-line prefer-const
          let [cameraAnimationProgress, newActiveContent] = getCameraAnimationProgress(animation.value);
          setActiveContent(newActiveContent);
          if (EDIT_MODE) cameraAnimationProgress = animation.value;
          const introOpacity = getIntroOpacity(cameraAnimationProgress);

          window.eventDispatcher.dispatchEvent({
            type: AppEventsType.onPassengersScrollProgress,
            progress: animation.value,
          });

          scene.onScrollProgress(cameraAnimationProgress);
          blackHole.setBlacknessOpacity(introOpacity);
          setLogoActive(cameraAnimationProgress < 0.1);
          setScrollAnimation(animation.value);
          if (sideNavigationRef.current) sideNavigationRef.current.onScroll(animation.value);
          if (mobileSideNavigationRef.current) mobileSideNavigationRef.current.onScroll(animation.value);
          if (sideNavigationContainerRef.current)
            sideNavigationContainerRef.current.style.opacity = String(1 - introOpacity);
        },
      });
    }
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [passengerScene, passengerState, userHasScrolled]);

  useEffect(() => {
    if (!passengerScene || !passengerScene.blackHole) return;

    passengerScene.blackHole.onEnterAnimationComplete = () => setPassengerState(PassengerState.userCanEnter);
  }, [passengerScene]);

  useEffect(() => {
    if (!passengerScene || !passengerScene.blackHole) return;

    switch (passengerState) {
      case PassengerState.enterAnimation:
        passengerScene.blackHole.startEnterAnimation();
        break;
      case PassengerState.userCanEnter:
        break;
      case PassengerState.travelAnimation:
        passengerScene.blackHole.startTravelAnimation({
          onUpdate: progress => {
            if (progress > 0.8) setPassengerState(PassengerState.scrolling);
          },
        });
        break;
      case PassengerState.scrolling:
        passengerScene.animateLogoEntry();
        break;
      default:
    }
  }, [passengerState, passengerScene]);

  function enterTheBlackHole() {
    if (passengerState === PassengerState.userCanEnter) setPassengerState(PassengerState.travelAnimation);
  }

  function onLoadingComplete() {
    setPassengerState(PassengerState.enterAnimation);
  }

  function toggleAudio() {
    setMutedAudio(muted => !muted);
  }

  function navigateToSection(progress: number) {
    setMobileMenuOpen(false);
    window.scrollTo({ top: getMaxScroll() * progress, behavior: 'smooth' });
  }

  // function openMint() {
  //   navigation('/mint');
  // }

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  function openMobileMenu() {
    setMobileMenuOpen(true);
  }

  function renderHtmlInScene(content?: HtmlContent) {
    if (!content || activeContent?.progress !== content.progress) return null;
    const { progress, anchor } = content;
    return (
      <ThreeHtml key={progress} transform distanceFactor={1} center webglCanvas={passengerScene} targetObject={anchor}>
        {isSection(content) ? (
          content.render(progress)
        ) : (
          <div className="flex justify-center items-center h-screen flex-col w-screen">
            <div className="w-[100%]">
              <h2 className="text-center">{content.title}</h2>
            </div>
          </div>
        )}
      </ThreeHtml>
    );
  }

  const enterButtonVisible = !DISABLE_BLACK_HOLE && passengerState === PassengerState.userCanEnter;
  const scrollPromptVisible = passengerState === PassengerState.scrolling && !userHasScrolled;
  const sideNavigationEnabled = window.innerWidth >= BREAKPOINTS.sm;
  const mobileMenuEnabled = window.innerWidth < BREAKPOINTS.sm;
  const mobileMenuIcon = mobileMenuEnabled && passengerState === PassengerState.scrolling;

  return (
    <div className="relative passengers pointer-events-none overflow-hidden">
      <div ref={passengersWebGlContainer} className="fixed bg-black top-0 w-screen h-screen overflow-hidden" />
      <div className="flex flex-auto  flex-col">
        <div className="pointer-events-none fixed top-0 left-0 right-0 bottom-0">
          <EnterBlackHoleButton onClick={enterTheBlackHole} visible={enterButtonVisible} />
          {passengerScene && (
            <>
              {HTML_CONTENT.map(html => renderHtmlInScene(html))}
              {passengerState === PassengerState.scrolling && logoActive && (
                <ThreeHtml transform webglCanvas={passengerScene} targetObject={LOGO}>
                  <div className="h-screen w-screen flex justify-center items-center">
                    <PassengersLogo />
                  </div>
                </ThreeHtml>
              )}
            </>
          )}
        </div>
        <div className="fixed top-10 right-10 left-10 pointer-events-auto ">
          <PassengersSocialButtons
            muteButton
            muted={mutedAudio}
            onToggleMusic={toggleAudio}
            openMobileMenu={openMobileMenu}
            mobileMenu={mobileMenuIcon}
          />
        </div>
        {/* <div className="fixed bottom-10 right-10 pointer-events-auto flex gap-4 md:gap-2">
          <button onClick={openMint} type="button" className="h-[44px] p-[8px] relative">
            <p className="description text-center scale-[1.666] md:scale-[1.25] lg:scale-[1] px-10 md:px-2">mint</p>
            <BracketsHighlight size={10} />
          </button>
        </div> */}
        <ScrollPrompt visible={scrollPromptVisible} />
        <div style={{ height: scrollHeight }} />\
      </div>
      {sideNavigationEnabled && (
        <div
          ref={sideNavigationContainerRef}
          className="pointer-events-auto fixed top-0 right-10 h-screen flex items-center opacity-0">
          <SideNavigation
            ref={sideNavigationRef}
            navigateToSection={navigateToSection}
            content={SIDE_NAVIGATION_CONTENT}
            progressScale={1 / MAX_SCROLL}
          />
        </div>
      )}
      {mobileMenuEnabled && (
        <Modal isOpen={mobileMenuOpen}>
          <div ref={sideNavigationContainerRef} className="passengers h-full w-full bg-black flex items-center px-20">
            <SideNavigation
              ref={mobileSideNavigationRef}
              navigateToSection={navigateToSection}
              content={SIDE_NAVIGATION_CONTENT}
              progressScale={1 / MAX_SCROLL}
              initialProgress={scrollAnimation}
            />
            {/* <div className="fixed bottom-10 right-10 left-10 pointer-events-auto flex justify-between flex-row-reverse">
              <button onClick={openMint} type="button" className="h-[44px] p-[8px] relative">
                <p className="description text-center scale-[1.666] md:scale-[1.25] lg:scale-[1] px-10 md:px-2">mint</p>
                <BracketsHighlight size={10} />
              </button>
            </div> */}
            <div className="fixed top-10 right-10">
              <Button onClick={closeMobileMenu}>
                <IcClose />
              </Button>
            </div>
          </div>
        </Modal>
      )}
      <PassengersLoadingScreen
        passengerScene={passengerScene}
        initialAnimationProgress={INITIAL_PROGRESS_ANIMATION}
        onComplete={onLoadingComplete}
      />
    </div>
  );
}
