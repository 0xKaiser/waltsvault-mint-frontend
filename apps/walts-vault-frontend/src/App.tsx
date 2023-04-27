import Intro from 'components/Intro';
import Home from 'pages/Home';
import Mint from 'pages/Mint';
import PostMint from 'pages/PostMint';
import React, {useEffect, useState} from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {getState, providerHandlerReadOnly} from 'web3/contractInteraction';
import {mainnet, goerli} from 'wagmi/chains';
import {EthereumClient, w3mConnectors, w3mProvider} from '@web3modal/ethereum';
import {Web3Modal} from '@web3modal/react';
import {WagmiConfig, configureChains, createClient} from 'wagmi';
import configs from './web3/config.json';

function App() {
  const [isMintPeriod, setIsMintPeriod] = useState(false); // <=24H since mint started
  const [is24HPostMintPeriod, setIs24HPostMintPeriod] = useState(false); // >24H && <48H since mint started
  const [isPostMintPeriod, setIsPostMintPeriod] = useState(false); // >48H since mint started

  useEffect(() => {
    (async () => {
      await providerHandlerReadOnly();
      const mintStatus = await getState();

      setIsMintPeriod(mintStatus === 'LIVE');
      setIs24HPostMintPeriod(mintStatus === 'OVER');
      setIsPostMintPeriod(mintStatus === 'REFUND' || mintStatus === 'OVER');
    })();
  }, []);

  const projectId = configs.PROJECT_ID;
  const chains = [goerli];
  const {provider} = configureChains(chains, [w3mProvider({projectId})]);
  const wagmiClient = createClient({
    autoConnect: true,
    connectors: w3mConnectors({version: 1, projectId, chains}),
    provider,
  });
  const ethereumClient: any = new EthereumClient(wagmiClient, chains);

  return (
    <BrowserRouter>
      <WagmiConfig client={wagmiClient}>
        <Routes>
          <Route path="*" element={<Home isMintPeriod={isMintPeriod} isPostMintPeriod={isPostMintPeriod}/>}/>
          {isMintPeriod && <Route path="/mint" element={<Mint/>}/>}
          {isPostMintPeriod && (
            <Route path="/post-mint" element={<PostMint is24HPostMintPeriod={is24HPostMintPeriod}/>}/>
          )}
        </Routes>
      </WagmiConfig>
      <Web3Modal ethereumClient={ethereumClient} projectId={projectId} themeMode="light"/>
      <Intro/>
    </BrowserRouter>
  );
}

export default App;
