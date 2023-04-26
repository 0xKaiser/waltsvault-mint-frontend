import { ENABLE_GUI } from 'constants/common';

import extension from '@theatre/r3f/dist/extension';
import studio from '@theatre/studio';
import { Web3ModalEthereum } from '@web3modal/ethereum';
import AnimationContextProvider from 'components/AnimationContextProvider/AnimationContextProvider';
import { GUI } from 'dat.gui';
import GSAP from 'gsap';
import LogPage from 'pages/LogPage';
import PassengersPage from 'pages/PassengersPage';
import PrivacyPolicyPage from 'pages/PrivacyPolicyPage';
import TermsPage from 'pages/TermsPage';
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import * as THREE from 'three';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';

const chains = [process.env.NODE_ENV === 'development' ? chain.goerli : chain.mainnet];

const { provider } = configureChains(chains, [
  Web3ModalEthereum.walletConnectRpc({ projectId: '4870200702514d9191fc713d0f1f455c' }),
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors: Web3ModalEthereum.defaultConnectors({ appName: 'web3Modal', chains }),
  provider,
});

GSAP.defaults({
  ease: 'power2',
  duration: 2.6,
  overwrite: true,
});

window.eventDispatcher = new THREE.EventDispatcher();
window.gui = new GUI();
window.virtualScrollX = 0;
window.virtualScrollY = 0;

if (process.env.NODE_ENV === 'development') {
  studio.initialize();
  studio.extend(extension);
}

// TODO: conditionally hide GUI on development, staging and production branch
if (!ENABLE_GUI) window.gui.hide();

function App() {
  return (
    <AnimationContextProvider>
      <WagmiConfig client={wagmiClient}>
        <Routes>
          <Route path="/" element={<PassengersPage />} />
          <Route path="/log" element={<LogPage />} />
          <Route path="/terms-and-conditions" element={<TermsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          {/* <Route path="/mint" element={<MintPage />} /> */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </WagmiConfig>
    </AnimationContextProvider>
  );
}

export default App;
