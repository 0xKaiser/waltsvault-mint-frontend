import ImagesCanvas from '@twl/common/components/ImagesCanvas';
import useWebGl from '@twl/common/hooks/useWebGl';
import EarthSceneContainer from 'components/EarthSceneContainer';
import Footer from 'components/Footer';
import Header from 'components/Header';
import HeroSection from 'components/HeroSection';
import Intro from 'components/Intro';
import NavigationCardsContainer from 'components/NavigationCardsContainer';
import SmartContract from 'components/SmartContract';
import SmoothScroll from 'components/SmoothScroll';
import React, { useState } from 'react';
import TwlLogo from 'rendering-engine/classes/twl-logo';

function TWLPage() {
  const [twlLogoContainer] = useWebGl(TwlLogo);
  return (
    <ImagesCanvas>
      <Header />
      <SmoothScroll>
        <div className="flex flex-auto flex-col">
          <div className="relative">
            <HeroSection />
            <div ref={twlLogoContainer} className="flex h-[100vh]" />
          </div>
          <SmartContract />
          <EarthSceneContainer scrollStart={100} />
          <NavigationCardsContainer />
          <Footer />
        </div>
      </SmoothScroll>
    </ImagesCanvas>
  );
}

export default function LandingPage() {
  const [isIntroComplete, setIsIntroComplete] = useState(false);

  function onIntroComplete() {
    setIsIntroComplete(true);
  }

  return !isIntroComplete ? <Intro onComplete={onIntroComplete} /> : <TWLPage />;
}
