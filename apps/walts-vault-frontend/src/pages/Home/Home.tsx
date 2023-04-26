import { AppState, PAGE_ROUTE } from 'constants/index';

import AnimatedRoutes from 'components/AnimatedRoutes';
import NftCarousel from 'components/carousel-components/NftCarousel';
import Footer from 'components/Footer';
import Menu from 'components/Menu';
import Table from 'components/Table';
import About from 'pages/About';
import Team from 'pages/Team';
import Vision from 'pages/Vision';
import React, { useMemo, useState } from 'react';
import { Navigate, Route, useLocation } from 'react-router-dom';

export default function Home({ isMintPeriod, isPostMintPeriod }: { isMintPeriod: boolean; isPostMintPeriod: boolean }) {
  const [zoomIn, setZoomIn] = useState(false);
  const [lightOn, setLightsOn] = useState(false);
  const { pathname } = useLocation();

  const appState = useMemo(() => {
    if (pathname !== PAGE_ROUTE.vault.path) return AppState.SUB_PAGE;
    return zoomIn ? AppState.NFT_FOCUS : AppState.DEFAULT;
  }, [zoomIn, pathname]);

  function toggleNftFocus() {
    setZoomIn(state => !state);
  }

  function toggleLight() {
    setLightsOn(state => !state);
  }

  return (
    <div className="h-screen w-screen">
      <Menu isMintPeriod={isMintPeriod} isPostMintPeriod={isPostMintPeriod} />
      <Table appState={appState} lightOn={lightOn} toggleLight={toggleLight}>
        <AnimatedRoutes>
          <Route
            path={PAGE_ROUTE.vault.path}
            element={<NftCarousel lightOn={lightOn} toggleNftFocus={toggleNftFocus} />}
          />
          <Route path={PAGE_ROUTE.vision.path} element={<Vision />} />
          <Route path={PAGE_ROUTE.about.path} element={<About />} />
          <Route path={PAGE_ROUTE.team.path} element={<Team lightOn={lightOn} />} />
          <Route path="*" element={<Navigate to={PAGE_ROUTE.vault.path} />} />
        </AnimatedRoutes>
      </Table>
      <Footer />
    </div>
  );
}
