import Intro from 'components/Intro';
import Home from 'pages/Home';
import Mint from 'pages/Mint';
import PostMint from 'pages/PostMint';
import MintInfo from 'pages/MintInfo';
import React, {useEffect, useState} from 'react';
import {Route, Routes, useLocation, useNavigate} from 'react-router-dom';
import {getState, providerHandlerReadOnly} from 'web3/contractInteraction';
import configs from './web3/config.json';
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
        if ((mintStatus === 'LIVE' || mintStatus === 'NOT_LIVE') && (location.pathname === '/claim-and-refund')) {
          navigate('/mint')
        }
        if ((mintStatus === 'OVER' || mintStatus === 'REFUND') && (location.pathname === '/mint')) {
          navigate('/claim-and-refund')
        }
      }
      setIsMintPeriod(mintStatus === 'LIVE' || mintStatus === 'NOT_LIVE');
      setIs24HPostMintPeriod(mintStatus === 'OVER');
      setIsPostMintPeriod(mintStatus === 'REFUND' || mintStatus === 'OVER');
    })();
  }, [mintState]);

  return (
    <Routes>
      <Route path="*" element={<Home mintState={mintState} isMintPeriod={isMintPeriod}
                                     isPostMintPeriod={isPostMintPeriod}/>}/>
      <Route path="/mint-info" element={<MintInfo mintState={mintState} isMintPeriod={isMintPeriod}
                                                  isPostMintPeriod={isPostMintPeriod}/>}/>
      <Route path="/mint" element={isMintPeriod ? <Mint routeStatus={mintState}/> : null}/>
      <Route path="/claim-and-refund"
             element={isPostMintPeriod ? <PostMint is24HPostMintPeriod={is24HPostMintPeriod}/> : null}/>
    </Routes>
  );
}

export default App;
