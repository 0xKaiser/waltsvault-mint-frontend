import { useEffect, useState } from 'react';
import { useMetaMask } from 'metamask-react'

import './app.scss';

import Counter from './Components/Counter/Counter';

import { getIsApproved, getMintPrice, getRavendaleTokens, getResSpotFCFS, getResSpotVL, getUsedResFCFS, getUsedResVL, placeOrder, providerHandler, setApproval } from './web3/contractInteraction';

function App() {
  const { account, status, connect } = useMetaMask();
  
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
    console.log(`X1: ${selectedRD} X2: ${lockedTokens} X3: ${vaultData.allocatedSpots} X4: ${vaultData.reservationPerSpot} X5: ${vaultData.usedReservations}`);
    console.log(`Y1: ${totalAllocatedSpots} Y2: ${maxReservations}`)

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
          {signature: "NA"},
          vaultAmount,
          FCFSAmount
        )
      } catch (e) {
        console.log(e);
      }
    else console.log('Nothing to Mint!')
  }

  useEffect(() => {
    if (status === 'connected')
      accountSetup();
  }, [account]);

  const accountSetup = async () => {
    await providerHandler();
    
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
    const allocatedSpots = 2;
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
            <h2>Price: {(vaultAmount + FCFSAmount) * mintPrice} ETH</h2>
          </div>

          <div className="btn-container">
            <button
              onClick={() => {
                if (isApproved) console.log('MINT');
                else approvalHandler();
              }}
            >
              {isApproved ? "MINT" : "APPROVE"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
