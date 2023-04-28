import Intro from 'components/Intro';
import Home from 'pages/Home';
import Mint from 'pages/Mint';
import PostMint from 'pages/PostMint';
import MintInfo from 'pages/MintInfo';
import React, {useEffect, useState} from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {getState, providerHandlerReadOnly} from 'web3/contractInteraction';
import {mainnet, goerli} from 'wagmi/chains';
import {EthereumClient, w3mConnectors, w3mProvider} from '@web3modal/ethereum';
import {Web3Modal} from '@web3modal/react';
import {WagmiConfig, configureChains, createClient} from 'wagmi';
import configs from './web3/config.json';
import './index.css';

function App() {
  const [isMintPeriod, setIsMintPeriod] = useState(false); // <=24H since mint started
  const [is24HPostMintPeriod, setIs24HPostMintPeriod] = useState(false); // >24H && <48H since mint started
  const [isPostMintPeriod, setIsPostMintPeriod] = useState(false);
  const [mintState, setMintState] = useState('');// >48H since mint started

  useEffect(() => {
    (async () => {
      await providerHandlerReadOnly();
      const mintStatus = await getState();
      setMintState(mintStatus)

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

  const variables: any = {
    '--w3m-background-color': 'rgb(20,20,20)',
    '--w3m-accent-color': '#fff',
    '--w3m-color-bg-2': 'rgb(20,20,20)',
    '--w3m-accent-fill-color': 'rgb(20,20,20)'
  }

  return (
    <BrowserRouter>
      <WagmiConfig client={wagmiClient}>
        <Routes>
          <Route path="*" element={<Home mintState={mintState} isMintPeriod={isMintPeriod} isPostMintPeriod={isPostMintPeriod}/>}/>
          {
            configs.MINT_INFO ? <Route path="/mintInfo" element={<MintInfo/>}/> :
              <>
                {isMintPeriod && <Route path="/mint" element={<Mint/>}/>}
                {isPostMintPeriod && (
                  <Route path="/post-mint" element={<PostMint is24HPostMintPeriod={is24HPostMintPeriod}/>}/>
                )}
              </>
          }
        </Routes>
      </WagmiConfig>
      <Web3Modal themeVariables={variables} ethereumClient={ethereumClient} projectId={projectId} themeMode="dark"/>
      <Intro/>
    </BrowserRouter>
  );
}

export default App;
