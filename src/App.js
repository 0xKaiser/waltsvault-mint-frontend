import { useEffect, useState } from 'react';
import { useMetaMask } from 'metamask-react'

import './app.scss';

import Counter from './Components/Counter/Counter';

import { getClaimedRefund, getIsApproved, getMintPrice, getRavendaleTokens, getResSpotFCFS, getResSpotVL, getState, getUsedResFCFS, getUsedResVL, placeOrder, providerHandler, refund, setApproval } from './web3/contractInteraction';
import { getOrderSignature, getRefundSignature } from './utils/backendApi';

function App() {
  const { account, status, connect } = useMetaMask();

  const [signature, setSignature] = useState({order: null, refund: null});
  const [mintState, setMintState] = useState("NOT_LIVE");
  const [claimedRefund, setClaimedRefund] = useState(false);
  
  const [ravendaleTokens, setRavendaleTokens] = useState(null);
  const [isApproved, setIsApproved] = useState(false);
  const [selectedTokens, setSelectedTokens] = useState([]);

  const [vaultData, setVaultData] = useState({allocatedSpots: 0, reservationPerSpot: 0, usedReservations: 0});
  const [vaultAmount, setVaultAmount] = useState(0);
  const [maxVaultMint, setMaxVaultMint] = useState(0);

  const [maxFCFSMint, setMaxFCFSMint] = useState(0);
  const [FCFSAmount, setFCFSAmount] = useState(0);

  const [mintPrice, setMintPrice] = useState(0);

  const toggleSelect = (tokenId) => {
    if (selectedTokens.includes(tokenId)) {
      setSelectedTokens(selectedTokens.filter(token => token !== tokenId))
    } else {
      setSelectedTokens([...selectedTokens, tokenId]);
    }
  }

  const getMaxVaultMint = () => {
    // X1
    const selectedRD = selectedTokens.length;

    // X2
    const lockedTokens = ravendaleTokens?.filter(token => token.locked === true).length;

    const totalAllocatedSpots = selectedRD + lockedTokens + vaultData.allocatedSpots;
    const maxReservations = totalAllocatedSpots * vaultData.reservationPerSpot;

    const maxMint = maxReservations - vaultData.usedReservations;

    setMaxVaultMint(maxMint);
  }

  useEffect(() => {
    getMaxVaultMint();
  }, [selectedTokens, vaultData]);

  const approvalHandler = async () => {
    try {
      await setApproval();

      const approval = await getIsApproved(account);
      setIsApproved(approval);

      return approval;
    } catch (e) {
      console.log('Approval Error', e);
      throw e;
    }
  }

  const mintHandler = async () => {
    if ((selectedTokens.length + vaultAmount + FCFSAmount) > 0)
      try {
        await placeOrder(
          mintPrice,
          selectedTokens, 
          signature.order,
          mintState === 'LIVE' ? vaultAmount : 0,
          mintState === 'LIVE' ? FCFSAmount : 0
        )
      } catch (e) {
        console.log(e);
      }
    else console.log('Nothing to Mint!')
  }

  const refundHandler = async () => {
    try {
      await refund(signature.refund);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (status === 'connected')
      accountSetup();
  }, [account]);

  const accountSetup = async () => {
    await providerHandler();

    // Get User Signature form API
    const orderSignature = await getOrderSignature(account);
    const refundSignature = await getRefundSignature(account);
    console.log(orderSignature, refundSignature);
    setSignature({
      order: orderSignature,
      refund: refundSignature
    });

    // Get Mint State
    const state = await getState();
    setMintState(state);

    if (state === 'OVER' || state === 'REFUND') {
      const refunded = await getClaimedRefund(account);
      setClaimedRefund(refunded);
    }
    
    // Get Ravendale Data
    const ravendale = await getRavendaleTokens(account);
    setRavendaleTokens(ravendale);

    // Check approval
    if (ravendale.length > 0) {
      const approval = await getIsApproved(account);
      setIsApproved(approval);
    } else {
      setIsApproved(true);
    }

    // Get Vault List Mint Data

    // X3: TODO: API
    const allocatedSpots = 0;
    // X4
    const reservationPerSpot = await getResSpotVL(); 
    // X5
    const usedReservationsVL = await getUsedResVL(account);

    setVaultData({
      allocatedSpots: allocatedSpots,
      reservationPerSpot: reservationPerSpot,
      usedReservations: usedReservationsVL
    });

    // Get FCFS Mint Data

    // G1
    const reservationPerUser = await getResSpotFCFS();
    // G2
    const usedReservationsFCFS = await getUsedResFCFS(account);

    setMaxFCFSMint(reservationPerUser - usedReservationsFCFS);

    // Get Mint Price
    const price = await getMintPrice();
    setMintPrice(price);
  }

  if (status !== 'connected') return (
    <div className="connect-screen">
      <div className="connect-container">
        <h1>Walt's Vault</h1>
        <button onClick={connect}>CONNECT</button>
      </div>
    </div>
  );
  
  else return (
    <div className="app">
      <header>
        <h1>Walt's Vault</h1>
      </header>
      <div className="main">
        <div className="mint-container">
        {mintState === 'NOT_LIVE' && 
          <div className="error">
            <h1>MINT NOT STARTED</h1>
          </div>
        }
        
        {mintState === 'LIVE' && <>
          <div className="ravendale-container">
            <h2>Ravendale</h2>
            <div className="token-grid">
              {ravendaleTokens?.map((token) => {
                return (
                  <div 
                    key={token.tokenId} 
                    className="token" 
                    id={token.locked ? "locked" : selectedTokens.includes(token.tokenId) ? "selected" : ""}
                    onClick={() => {if (!token.locked) toggleSelect(token.tokenId)}}
                  >
                    #{token.tokenId}
                  </div>
              )})}
            </div>
          </div>

          <div className="vault-container">
            <h2>
              Vault List <br/>
              <span>Available: {maxVaultMint}</span>
            </h2>
            <Counter 
              maxCount={maxVaultMint}
              count={vaultAmount}
              setCount={setVaultAmount}
            />
          </div>
          
          <div className="fcfs-container">
            <h2>
              FCFS <br />
              <span>Available: {maxFCFSMint}</span>
            </h2>
            <Counter 
              maxCount={maxFCFSMint}
              count={FCFSAmount}
              setCount={setFCFSAmount}
            />
          </div>

          <div className="total-mints">
            <p>No of Mints {selectedTokens.length + vaultAmount + FCFSAmount}</p>
            <h2>Price: {((vaultAmount + FCFSAmount) * mintPrice).toFixed(2)} ETH</h2>
          </div>

          <div className="btn-container">
            <button
              onClick={() => {
                if (isApproved) mintHandler();
                else approvalHandler();
              }}
            >
              {isApproved ? "MINT" : "APPROVE"}
            </button>
          </div>
        </>}

        {(mintState === 'OVER' || mintState === 'REFUND') &&
          <div className="claim-container">
          <h2>Ravendale</h2>
            <div className="token-grid">
              {ravendaleTokens?.map((token) => {
                return (
                  <div 
                    key={token.tokenId} 
                    className="token" 
                    id={token.locked ? "locked" : selectedTokens.includes(token.tokenId) ? "selected" : ""}
                    onClick={() => {if (!token.locked) toggleSelect(token.tokenId)}}
                  >
                    #{token.tokenId}
                  </div>
              )})}
            </div>
            {(ravendaleTokens && ravendaleTokens.length > 0) ? <button onClick={mintHandler}>CLAIM</button> : <p>No Ravendales Detected in This Wallet</p>}
          </div>
        }

        {mintState === 'REFUND' &&
          <div className="refund-container">
            <h2>
              Refund <br />
              <span>Refund Amount: 1 ETH</span>
            </h2>
            {claimedRefund ? 
              <p>Refund Claimed</p> :
              <button onClick={refundHandler}>CLAIM</button>
            }
          </div>
        }

        </div>
      </div>
    </div>
  );
}

export default App;
