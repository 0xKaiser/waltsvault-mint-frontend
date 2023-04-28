import Intro from 'components/Intro';
import Home from 'pages/Home';
import Mint from 'pages/Mint';
import PostMint from 'pages/PostMint';
import MintInfo from 'pages/MintInfo';
import React, {useEffect, useState} from 'react';
import {Route, Routes, useLocation, useNavigate} from 'react-router-dom';
import {getState, providerHandlerReadOnly} from 'web3/contractInteraction';
import './index.css';

function App() {
  const [isMintPeriod, setIsMintPeriod] = useState(false); // <=24H since mint started
  const [is24HPostMintPeriod, setIs24HPostMintPeriod] = useState(false); // >24H && <48H since mint started
  const [isPostMintPeriod, setIsPostMintPeriod] = useState(false);
  const [mintState, setMintState] = useState('');// >48H since mint started
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    (async () => {
      await providerHandlerReadOnly();
      console.log('fetching mint status.....')
      const mintStatus = await getState();
      setMintState(mintStatus)
      console.log('mintStatus----', mintStatus)
      console.log('fetched')
      if (mintStatus.length) {
        if (mintStatus === 'LIVE' && (location.pathname === '/mintInfo' || location.pathname === '/post-mint')) {
          navigate('/mint')
        }
        if ((mintStatus === 'OVER' || mintStatus === 'REFUND') && (location.pathname === '/mint' || location.pathname === '/mintInfo')) {
          navigate('/post-mint')
        }
        if (mintStatus === 'NOT_LIVE' && (location.pathname === '/mint' || location.pathname === '/post-mint')) {
          navigate('/mintInfo')
        }
      }
      setIsMintPeriod(mintStatus === 'LIVE');
      setIs24HPostMintPeriod(mintStatus === 'OVER');
      setIsPostMintPeriod(mintStatus === 'REFUND' || mintStatus === 'OVER');
    })();
  }, [mintState]);

  return (
    <Routes>
      <Route path="*" element={<Home mintState={mintState} isMintPeriod={isMintPeriod}
                                     isPostMintPeriod={isPostMintPeriod}/>}/>
      <Route path="/mintInfo" element={mintState === 'NOT_LIVE' ? <MintInfo/> : null}/>
      <Route path="/mint" element={isMintPeriod ? <Mint/> : null}/>
      <Route path="/post-mint"
             element={isPostMintPeriod ? <PostMint is24HPostMintPeriod={is24HPostMintPeriod}/> : null}/>
    </Routes>
  );
}

export default App;
