import {ReactComponent as BrokenPencilBlack} from 'assets/icons/ic-broken-pencil-black.svg';
import {ReactComponent as Delimeter} from 'assets/icons/ic-delimeter.svg';
import {ReactComponent as EnterDecorationBlack} from 'assets/icons/ic-enter-decoration-black.svg';
import {ReactComponent as PaintbrushBlack} from 'assets/icons/ic-paintbrush-black.svg';
import {ReactComponent as Palette} from 'assets/icons/ic-palette.svg';
import {ReactComponent as MintErrorBackdrop} from 'assets/images/backdrops/img-mint-error-backdrop.svg';
import {ReactComponent as MintTotalBackdrop} from 'assets/images/backdrops/img-mint-total-backdrop.svg';
import {ReactComponent as MintTotalBigBackdrop} from 'assets/images/backdrops/img-mint-total-big-backdrop.svg';
import EllipseGradient from 'assets/images/img-ellipse-gradient.png';
import BG_VIDEO from 'assets/videos/WV-bg-team.mp4';
import Footer from 'components/Footer';
import Menu from 'components/Menu';
import {useEffect, useState} from 'react';
import config from '../../web3/config.json';
import {useAccount, useNetwork, useSwitchNetwork, useSigner, useProvider} from 'wagmi';
import {useWeb3Modal} from '@web3modal/react';

import {
  getIsApproved,
  getMintPrice,
  getRavendaleTokens,
  getResSpotFCFS,
  getResSpotVL,
  getState,
  getUsedResFCFS,
  getUsedResVL,
  placeOrder,
  providerHandler,
  setApproval,
} from '../../web3/contractInteraction';
import {getOrderSignature, getRefundSignature} from '../../utils/backendApi';
import Counter from 'components/Counter/Counter';

export default function Home() {
  const {isConnected, address, status} = useAccount();
  const {open} = useWeb3Modal();
  const {chain} = useNetwork();
  const {switchNetwork} = useSwitchNetwork()
  const {data} = useSigner()
  const provider = useProvider()

  // UI States
  const [step, setStep] = useState(0);
  const [step0Status, setStep0Status] = useState('initial'); // initial loading error completed
  const [step1Status, setStep1Status] = useState('initial'); // initial loading error completed
  const [errorMessage, setErrorMessage] = useState('Hmmm, something went wrong');

  // Mint Logic States
  const [signature, setSignature] = useState({order: [], refund: []});
  const [mintState, setMintState] = useState('NOT_LIVE');

  const [ravendaleTokens, setRavendaleTokens] = useState<{ tokenId: number, locked: boolean }[]>([]);
  const [isApproved, setIsApproved] = useState(false);
  const [selectedTokens, setSelectedTokens] = useState<number[]>([]);

  const [vaultData, setVaultData] = useState({allocatedSpots: 0, reservationPerSpot: 0, usedReservations: 0});
  const [vaultAmount, setVaultAmount] = useState(0);
  const [maxVaultMint, setMaxVaultMint] = useState(0);

  const [maxFCFSMint, setMaxFCFSMint] = useState(0);
  const [FCFSAmount, setFCFSAmount] = useState(0);

  const [mintPrice, setMintPrice] = useState('');

  function renderError(title: string, subTitle: string) {
    return (
      <div className="flex flex-col items-center max-w-[90vw]">
        <BrokenPencilBlack/>
        <br/>
        <h3 className="text-[20px] md:text-[40px] whitespace-nowrap">{title}</h3>
        <div className="max-w-[100%] relative flex items-center text-center w-[800px]">
          <MintErrorBackdrop className="max-w-[100vw] mx-auto"/>
          <h2
            className="absolute top-[5px] w-[100%] text-[30px] md:text-[64px] text-white whitespace-nowrap mx-auto">{subTitle}</h2>
        </div>
      </div>
    );
  }

  function renderLoading(subTitle: string, isLoading: boolean, width: string) {
    return (
      <div className="flex flex-col md:flex-row gap-4 items-center animation">
        <PaintbrushBlack/>
        <h3
          className={`${width} text-h3 whitespace-nowrap ${isLoading && 'loading'}`}>{subTitle}</h3>
      </div>
    );
  }

  const handleChainChange = async () => {
    const chainID = config.chainID;
    if (chain !== undefined && chain.id !== chainID) {
      setStep(0);
      setStep0Status('loading');
      await switchNetwork?.(chain.id)
    } else {
      setStep(1);
      setStep0Status('completed');
    }
  };

  useEffect(() => {
    if (chain) handleChainChange();
  }, [chain]);

  async function connectWallet() {
    setStep0Status('loading');

    try {
      await open();
    } catch (e) {
      setStep0Status('error');
      setTimeout(() => {
        setStep0Status('initial');
      });
    }
  }

  const toggleSelect = (tokenId: number) => {
    if (selectedTokens.includes(tokenId)) {
      setSelectedTokens(selectedTokens.filter((token) => token !== tokenId));
    } else {
      setSelectedTokens([...selectedTokens, tokenId]);
    }
  };

  const getMaxVaultMint = () => {
    // X1
    const selectedRD = selectedTokens.length;

    // X2
    const lockedTokens = ravendaleTokens?.filter(token => token.locked === true).length;

    const totalAllocatedSpots = selectedRD + lockedTokens + vaultData.allocatedSpots;
    const maxReservations = totalAllocatedSpots * vaultData.reservationPerSpot;
    const maxMint = maxReservations - vaultData.usedReservations;
    if (maxMint < vaultAmount) {
      setVaultAmount(maxMint)
    }
    setMaxVaultMint(maxMint);
  };

  useEffect(() => {
    getMaxVaultMint();
  }, [selectedTokens, vaultData]);

  const updateAccount = async () => {
    // Get Mint State
    const state = await getState();
    setMintState(state);

    // Get Ravendale Data
    const ravendale = await getRavendaleTokens(address || '');
    setRavendaleTokens(ravendale);

    // Get Vault List Mint Data

    // X5
    const usedReservationsVL = await getUsedResVL(address || '');
    setVaultData({...vaultData, usedReservations: usedReservationsVL});

    // Get FCFS Mint Data
    // G1
    const reservationPerUser = await getResSpotFCFS();
    // G2
    const usedReservationsFCFS = await getUsedResFCFS(address || '');

    setMaxFCFSMint(reservationPerUser - usedReservationsFCFS);

    setFCFSAmount(0);
    setVaultAmount(0);
    setSelectedTokens([]);
  };

  const mintHandler = async () => {
    if ((selectedTokens.length + vaultAmount + FCFSAmount) > 0)
      try {
        setStep1Status('loading');
        if (!isApproved && selectedTokens.length > 0) {
          await setApproval();

          const approval = await getIsApproved(address || '');
          setIsApproved(approval);
        }
        const orderSignature = await getOrderSignature(address);
        await placeOrder(
          address,
          Number(mintPrice),
          selectedTokens,
          orderSignature.signature,
          mintState === 'LIVE' ? vaultAmount : 0,
          mintState === 'LIVE' ? FCFSAmount : 0,
        );
        await updateAccount();
        setStep1Status('completed');
      } catch (e: any) {
        console.log(e);

        setErrorMessage(
          e.code === 'INSUFFICIENT_FUNDS'
            ? 'Wallet does not have enough balance'
            : e.code === 'ACTION_REJECTED'
            ? 'Transaction Rejected'
            : 'Hmmm, something went wrong',
        );

        setStep1Status('error');
        setTimeout(() => {
          setStep1Status('initial');
        }, 5000);
      }
    else console.log('Nothing to Mint!');
  };

  useEffect(() => {
    if (address && data) accountSetup();
  }, [address, data]);

  // Show Connect Wallet Screen
  // If user disconnects
  useEffect(() => {
    if (!isConnected) {
      setStep(0);
      setStep0Status('initial');
    }
  });

  const accountSetup = async () => {
    setStep(0);
    setStep0Status('loading');
    if (data) {
      await providerHandler(data, provider);
    }

    // Get User Signature form API
    const orderSignature = await getOrderSignature(address);
    const refundSignature = await getRefundSignature(address);
    setSignature({
      order: orderSignature.signature,
      refund: refundSignature.signature,
    });

    // Get Mint State
    const state = await getState();
    setMintState(state);

    // Get Ravendale Data
    const ravendale = await getRavendaleTokens(address || '');
    setRavendaleTokens(ravendale);

    // Check approval
    if (ravendale.length > 0) {
      const approval = await getIsApproved(address || '');
      setIsApproved(approval);
    } else {
      setIsApproved(true);
    }

    // Get Vault List Mint Data
    // X3
    const allocatedSpots = orderSignature ? orderSignature.spots.spotsOne : 0;
    // X4
    const reservationPerSpot = await getResSpotVL();
    // X5
    const usedReservationsVL = await getUsedResVL(address || '');

    setVaultData({
      allocatedSpots: allocatedSpots,
      reservationPerSpot: reservationPerSpot,
      usedReservations: usedReservationsVL,
    });

    // Get FCFS Mint Data
    // G1
    const reservationPerUser = await getResSpotFCFS();
    // G2
    const usedReservationsFCFS = await getUsedResFCFS(address || '');

    setMaxFCFSMint(reservationPerUser - usedReservationsFCFS);

    // Get Mint Price
    const price = await getMintPrice();
    setMintPrice(price);

    setVaultAmount(0)
    setFCFSAmount(0)
    setSelectedTokens([])
    setStep(1);
    setStep0Status('completed');
  };

  function renderStep0() {
    if (step0Status === 'error') {
      return renderError('Hmmm, something went wrong', 'Error: Unable to Connect');
    }
    if (step0Status === 'loading') {
      if (chain !== undefined && chain.id !== config.chainID) {
        return renderLoading('Switch to Goerli Testnet', false, 'chain');
      } else {
        return renderLoading('Connecting Wallet', true, 'connect');
      }
    }
    return (
      <>
        <div className="flex items-center">
          <EnterDecorationBlack/>
          <button className="px-10" type="button" onClick={connectWallet}>
            <h1 className="text-black">Connect</h1>
          </button>
          <EnterDecorationBlack className="rotate-180"/>
        </div>
        <h3 className="text-h4 mt-[-2%]">Follow Your Dreams</h3>
      </>
    );
  }

  function renderStep1() {
    if (step1Status === 'error') {
      return renderError(errorMessage, 'Please Try Again');
    }
    if (step1Status === 'loading') {
      return renderLoading('In Progress', true, 'progress');
    }
    if (step1Status === 'completed') {
      return (
        <div className="flex flex-col items-center max-w-[90vw]">
          <Palette/>
          <br/>
          <h3 className="text-[20px] md:text-[40px] whitespace-nowrap">Congrats Dreamer!</h3>
          <div className="max-w-[100%] relative flex items-center text-center w-[800px]">
            <MintTotalBigBackdrop className="mx-auto"/>
            <h2 className="absolute top-[5px] w-[100%] text-[38px] md:text-[64px] text-white whitespace-nowrap mx-auto">
              Successfully Reserved
            </h2>
          </div>
        </div>
      );
    }
    return (
      <div className="flex flex-col select-none max-w-[90vw]">
        {/* Ravendale Section */}
        {ravendaleTokens.length > 0 &&
        <>
          <div className="flex flex-col md:flex-row justify-start md:justify-between">
            <div className="flex flex-col">
              <span className="text-[42px]">Ravendale</span>
              <span className="text-[20px] mt-[-16px]">Select Tokens from Wallet</span>
            </div>
            <div
              className="w-[280px] scrollbar-hide flex flex-wrap gap-[12px] md:self-center max-h-[102px] overflow-y-auto">
              {ravendaleTokens.map(token => (
                <div
                  key={token.tokenId}
                  className={`
                      w-[43px] h-[43px] flex items-center justify-center cursor-pointer
                      ${selectedTokens.includes(token.tokenId) ? 'border-2 border-black' : token.locked ? 'border border-gray-400 border-opacity-50' : 'border border-gray-400 '} 
                      ${selectedTokens.includes(token.tokenId) || token.locked ? '' : 'hover'}
                    `}
                  onClick={() => {
                    if (!token.locked) toggleSelect(token.tokenId);
                  }}
                >
                  <span
                    className={`text-[20px] ${token.locked && 'text-[gray] text-opacity-50'}`}>{token.tokenId}</span>
                </div>
              ))}
            </div>
          </div>
          <Delimeter className="max-w-[100%] my-[16px]"/>
        </>
        }
        <div className={`flex row items-center justify-between ${maxVaultMint <= 0 && 'disabled'}`}>
          <div className="flex flex-col">
            <span className="text-[42px]">Vault List</span>
            <span className="text-[20px] mt-[-16px]">available: {maxVaultMint}</span>
          </div>
          <Counter
            style={0}
            maxCount={maxVaultMint}
            count={vaultAmount}
            setCount={setVaultAmount}
          />
        </div>
        <Delimeter className="max-w-[100%] my-[16px]"/>
        <div className={`flex row items-center justify-between ${maxFCFSMint <= 0 && 'disabled'}`}>
          <div className="flex flex-col">
            <span className="text-[42px]">FCFS</span>
            <span className="text-[20px] mt-[-16px]">available: {maxFCFSMint}</span>
          </div>
          <Counter
            style={1}
            maxCount={maxFCFSMint}
            count={FCFSAmount}
            setCount={setFCFSAmount}
          />
        </div>
        <Delimeter className="max-w-[100%] my-[16px]"/>
        <div className="flex flex-col items-center mx-auto mt-[16px] relative">
          <MintTotalBackdrop className="absolute z-0"/>
          <div className="text-[20px] text-white leading-[47px] mx-auto mt-[-11px] z-10">
            no. of mints: {selectedTokens.length + vaultAmount + FCFSAmount}
          </div>
          <div
            className="text-[32px] text-white leading-[47px] mx-auto mt-[-27px] z-10">Price: {((vaultAmount + FCFSAmount) * Number(mintPrice)).toFixed(2)} eth
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div
            className={`flex flex-row items-center ${(selectedTokens.length + vaultAmount + FCFSAmount) <= 0 && 'disabled'}`}>
            <EnterDecorationBlack className="w-[33px]"/>
            <button className="px-3" type="button" onClick={mintHandler}>
              <h1
                className="text-black text-[64px]">{!isApproved && selectedTokens.length > 0 ? 'Approve' : 'Confirm'}</h1>
            </button>
            <EnterDecorationBlack className="rotate-180 w-[33px]"/>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <img className="absolute h-[100vh] xl:h-[auto] m-auto min-w-[100vw] xl:min-w-[1200px]" src={EllipseGradient}
           alt="ellipse"/>
      <video autoPlay className="w-full h-full object-cover object-center" loop muted playsInline>
        <source src={BG_VIDEO} type="video/mp4"/>
      </video>
      <Menu/>
      <div className="cover flex flex-col justify-center items-center">
        {step === 0 ? renderStep0() : renderStep1()}
      </div>
      <Footer/>
    </div>
  );
}
