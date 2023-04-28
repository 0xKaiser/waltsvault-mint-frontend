import GSAP from 'gsap';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import './index.scss';
import App from './App';
import {Web3Modal} from '@web3modal/react';
import Intro from './components/Intro';
import configs from './web3/config.json';
import {goerli} from 'wagmi/chains';
import {WagmiConfig, configureChains, createClient} from 'wagmi';
import {EthereumClient, w3mConnectors, w3mProvider} from '@web3modal/ethereum';

GSAP.defaults({
  ease: 'power2',
  duration: 2.6,
  overwrite: true,
});

const projectId = configs.PROJECT_ID;
const chains = [goerli];
const {provider} = configureChains(chains, [w3mProvider({projectId})]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({version: 1, projectId, chains}),
  provider,
});
const ethereumClient: any = new EthereumClient(wagmiClient, chains);

const variables: any = {
  '--w3m-background-color': 'rgb(20,20,20)',
  '--w3m-accent-color': '#fff',
  '--w3m-color-bg-2': 'rgb(20,20,20)',
  '--w3m-accent-fill-color': 'rgb(20,20,20)'
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <BrowserRouter>
    <WagmiConfig client={wagmiClient}>
      <App/>
    </WagmiConfig>
    <Web3Modal themeVariables={variables} ethereumClient={ethereumClient} projectId={projectId} themeMode="dark"/>
    <Intro/>
  </BrowserRouter>
);
