import Intro from 'components/Intro';
import Home from 'pages/Home';
import Mint from 'pages/Mint';
import PostMint from 'pages/PostMint';
import MintInfo from 'pages/MintInfo';
import React, {useEffect, useState} from 'react';
import { Route, Routes, useNavigate} from 'react-router-dom';
import {getState, providerHandlerReadOnly} from 'web3/contractInteraction';
import configs from './web3/config.json';
import './index.css';

function App() {
  const [isMintPeriod, setIsMintPeriod] = useState(false); // <=24H since mint started
  const [is24HPostMintPeriod, setIs24HPostMintPeriod] = useState(false); // >24H && <48H since mint started
  const [isPostMintPeriod, setIsPostMintPeriod] = useState(false);
  const [mintState, setMintState] = useState('');// >48H since mint started
  const navigate = useNavigate()

  useEffect(() => {
    (async () => {
      await providerHandlerReadOnly();
      console.log('fetching mint status.....')
      const mintStatus = await getState();
      setMintState(mintStatus)
      console.log('mintStatus----',mintStatus)
      console.log('fetched')

      setIsMintPeriod(mintStatus === 'LIVE');
      setIs24HPostMintPeriod(mintStatus === 'OVER');
      setIsPostMintPeriod(mintStatus === 'REFUND' || mintStatus === 'OVER');
    })();
  }, []);

  return (
    <Routes>
      <Route path="*" element={<Home mintState={mintState} isMintPeriod={isMintPeriod}
                                     isPostMintPeriod={isPostMintPeriod}/>}/>
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
  );
}

export default App;
