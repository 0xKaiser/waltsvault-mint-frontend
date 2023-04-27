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
import React, {useState, useEffect} from 'react';

import config from '../../web3/config.json';
import {
  getClaimedRefund,
  getIsApproved,
  getMintPrice,
  getRavendaleTokens,
  getUsedResFCFS,
  getUsedResVL,
  placeOrder,
  providerHandler,
  refund,
  setApproval,
} from '../../web3/contractInteraction';
import {getOrderSignature, getRefundSignature} from '../../utils/backendApi';
import {useAccount, useNetwork, useSwitchNetwork, useSigner, useProvider, useDisconnect} from 'wagmi';
import {useWeb3Modal} from '@web3modal/react';

export default function Home({is24HPostMintPeriod}: { is24HPostMintPeriod: boolean }) {
  const {isConnected, address, status} = useAccount();
  const {open} = useWeb3Modal();
  const {chain} = useNetwork();
  const {switchNetwork} = useSwitchNetwork()
  const {data} = useSigner()
  const provider = useProvider()

  const [step, setStep] = useState(0);
  // 0 - connect
  // 1 - select claim or refund
  // 2 - claim ravendale
  // 3 - refund
  const [step0Status, setStep0Status] = useState('initial'); // initial loading error completed
  const [step2Status, setStep2Status] = useState('initial'); // initial loading error completed
  const [step3Status, setStep3Status] = useState('initial'); // initial loading error completed
  const [step2ErrorMessage, setStep2ErrorMessage] = useState('Hmmm, something went wrong');
  const [step3ErrorMessage, setStep3ErrorMessage] = useState('Hmmm, something went wrong');

  // Mint Logic States
  const [signature, setSignature] = useState({order: [], refund: []});
  const [claimedRefund, setClaimedRefund] = useState(false);
  const [refundAmount, setRefundAmount] = useState(0);
  const [reservations, setReservations] = useState(0);
  const [allocatedMerkels, setAllocatedMerkels] = useState(0);

  const [ravendaleTokens, setRavendaleTokens] = useState<{ tokenId: number, locked: boolean }[]>([]);
  const [isApproved, setIsApproved] = useState(false);
  const [selectedTokens, setSelectedTokens] = useState<number[]>([]);

  const [mintPrice, setMintPrice] = useState('');

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

  function renderError(title: string, subTitle: string) {
    return (
      <div className="flex flex-col items-center max-w-[90vw]">
        <BrokenPencilBlack/>
        <br/>
        {title.length > 0 && <h3 className="text-[20px] md:text-[40px] whitespace-nowrap">{title}</h3>}
        <div className="max-w-[100%] relative flex items-center text-center w-[800px]">
          <MintErrorBackdrop className="max-w-[100%] mx-auto"/>
          <h2
            className="absolute top-[5px] w-[100%] text-[30px] md:text-[64px] text-white whitespace-nowrap mx-auto">{subTitle}</h2>
        </div>
      </div>
    );
  }

  function renderLoading(subTitle: string) {
    return (
      <div className="flex flex-col md:flex-row items-center">
        <PaintbrushBlack/>
        <h3 className="text-h3 ml-[5%] whitespace-nowrap">{subTitle}</h3>
      </div>
    );
  }

  function render24HPostMint() {
    return (
      <div className="flex flex-col items-center max-w-[90vw]">
        <Palette/>
        <br/>
        <h3 className="text-[20px] md:text-[40px] whitespace-nowrap">Mint Has Successfully Completed</h3>
        <div className="max-w-[100%] relative flex items-center text-center w-[800px]">
          <MintTotalBigBackdrop className="max-w-[100%] w-[750px] mx-auto"/>
          <h2 className="absolute top-[5px] w-[100%] text-[34px] md:text-[64px] text-white whitespace-nowrap mx-auto">
            Allocation is Being Assigned
          </h2>
        </div>
      </div>
    );
  }

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

  const refundHandler = async () => {
    setStep3Status('loading');
    try {
      await refund(signature.refund);
      await updateAccount();
      setStep3Status('completed');
    } catch (e) {
      console.log(e);
      setStep3ErrorMessage('Could not process refund');
      setStep3Status('error');
      setTimeout(() => {
        setStep3Status('initial');
      }, 5000);
    }
  };

  const mintHandler = async () => {
    if ((selectedTokens.length) > 0)
      try {
        setStep2Status('loading');
        await placeOrder(
          address,
          Number(mintPrice),
          selectedTokens,
          signature.order,
          0,
          0,
        );
        await updateAccount();
        setStep2Status('completed');
      } catch (e: any) {
        console.log(e);
        setStep2ErrorMessage(
          e.code === 'INSUFFICIENT_FUNDS'
            ? 'Wallet does not have enough balance'
            : e.code === 'ACTION_REJECTED'
            ? 'Transaction Rejected'
            : 'Hmmm, something went wrong',
        );
        setStep2Status('error');
        setTimeout(() => {
          setStep2Status('initial');
        }, 5000);
      }
    else console.log('Nothing to Mint!');
  };

  const approvalHandler = async () => {
    setStep2Status('loading');
    try {
      await setApproval();

      const approval = await getIsApproved(address || '');
      setIsApproved(approval);

    } catch (e) {
      console.log('Approval Error', e);
      // throw e;
    }
    setStep2Status('initial');
  };

  useEffect(() => {
    if (address && data) accountSetup();
  }, [address, data]);

  useEffect(() => {
    if (!isConnected) {
      setStep(0);
      setStep0Status('initial');
    }
  });

  const updateAccount = async () => {
    const refunded = await getClaimedRefund(address || '');
    setClaimedRefund(refunded);

    // Get Ravendale Data
    const ravendale = await getRavendaleTokens(address || '');
    setRavendaleTokens(ravendale);

    // Get Vault List Mint Data
    const usedReservationsVL = await getUsedResVL(address || '');

    // Get FCFS Mint Data
    const usedReservationsFCFS = await getUsedResFCFS(address || '');

    setReservations(usedReservationsFCFS + usedReservationsVL);

    // Refund Amount
    setRefundAmount((usedReservationsVL + usedReservationsFCFS) - signature.refund[1]);
  };

  const accountSetup = async () => {
    setStep(0);
    setStep0Status('loading');
    await providerHandler(data, provider);

    // Get User Signature form API
    const orderSignature = await getOrderSignature(address);
    const refundSignature = await getRefundSignature(address);
    setSignature({
      order: orderSignature.signature,
      refund: refundSignature.signature,
    });

    const refunded = await getClaimedRefund(address || '');
    setClaimedRefund(refunded);

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
    const usedReservationsVL = await getUsedResVL(address || '');

    // Get FCFS Mint Data
    const usedReservationsFCFS = await getUsedResFCFS(address || '');

    setReservations(usedReservationsVL + usedReservationsFCFS);

    setAllocatedMerkels(refundSignature.amountAllocated);

    // Refund Amount
    setRefundAmount((usedReservationsVL + usedReservationsFCFS) - refundSignature ? refundSignature.amountAllocated : (usedReservationsVL + usedReservationsFCFS));

    // Get Mint Price
    const price = await getMintPrice();
    setMintPrice(price);

    setStep(1);
    setStep0Status('completed');
  };

  function renderStep0() {
    if (step0Status === 'error') {
      return renderError('Hmmm, something went wrong', 'Error: Unable to Connect');
    }
    if (step0Status === 'loading') {
      if (chain !== undefined && chain.id !== config.chainID) {
        return renderLoading('Switch to Goerli Testnet');
      } else {
        return renderLoading('Connecting Wallet...');
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
    return (
      <>
        <div className="flex flex-col md:flex-row items-center max-w-[90vw]">
          <div className="flex items-center">
            <EnterDecorationBlack/>
            <button className="px-10" type="button" onClick={() => {
              setStep(2);
              if (ravendaleTokens.length === 0) setStep2Status('error');
            }}>
              <h1 className="text-black">Claim</h1>
            </button>
            <EnterDecorationBlack className="rotate-180"/>
          </div>
          <span className="text-[38px] md:text-[64px] mx-[32px]">or</span>
          <div className="flex items-center">
            <EnterDecorationBlack/>
            <button className="px-10" type="button" onClick={() => {
              setStep(3);
              if (refundAmount <= 0 || claimedRefund || reservations <= 0) setStep3Status('error');
            }}>
              <h1 className="text-black">Refund</h1>
            </button>
            <EnterDecorationBlack className="rotate-180"/>
          </div>
        </div>
        <span className="text-[20px] md:text-[38px] leading-10 mx-[32px]  items-center text-center">
          Ravendale Keepers can claim their Free Merkel
          <br/>
          or
          <br/>
          You can now request a refund for your Unallocated Reservation!
        </span>
      </>
    );
  }

  const toggleSelect = (tokenId: number) => {
    if (selectedTokens.includes(tokenId)) {
      setSelectedTokens(selectedTokens.filter((token) => token !== tokenId));
    } else {
      setSelectedTokens([...selectedTokens, tokenId]);
    }
  };

  function renderStep2() {
    if (step2Status === 'error') {
      if (ravendaleTokens.length === 0) return renderError('', 'No Ravendales Detected in This Wallet');
      else return renderError(step2ErrorMessage, 'Please Try Again');
    }
    if (step2Status === 'loading') {
      return renderLoading('In Progress...');
    }
    if (step2Status === 'completed') {
      return (
        <div className="flex flex-col items-center max-w-[90vw]">
          <Palette/>
          <br/>
          <h3 className="text-[20px] md:text-[40px] whitespace-nowrap">Congrats Dreamer!</h3>
          <div className="max-w-[100%] relative flex items-center text-center w-[800px]">
            <MintTotalBigBackdrop className="mx-auto"/>
            <h2 className="absolute top-[5px] w-[100%] text-[38px] md:text-[64px] text-white whitespace-nowrap mx-auto">
              Successfully Claimed
            </h2>
          </div>
        </div>
      );
    }
    return (
      <div className="flex flex-col select-none max-w-[90vw]">
        <div className="flex flex-col md:flex-row justify-start md:justify-between">
          <div className="flex flex-col">
            <span className="text-[42px]">Ravendale</span>
            <span className="text-[20px] mt-[-16px]">Select Tokens from Wallet</span>
          </div>
          <div className="w-[280px] scrollbar-hide flex flex-wrap gap-[12px] md:self-center max-h-[102px] overflow-y-auto">
            {ravendaleTokens.map(token => (
              <div
                key={token.tokenId}
                className={`
                      w-[43px] h-[43px] flex items-center justify-center cursor-pointer
                      ${selectedTokens.includes(token.tokenId) ? 'border-2 border-black' : 'border border-gray-400'}
                    `}
                onClick={() => {
                  if (!token.locked) toggleSelect(token.tokenId);
                }}
              >
                <span className={`text-[20px] ${token.locked && 'text-[gray]'}`}>{token.tokenId}</span>
              </div>
            ))}
          </div>
        </div>
        <Delimeter className="max-w-[100%] my-[16px]"/>
        <div className="flex flex-col items-center mx-auto mt-[16px] relative">
          <MintTotalBackdrop className="absolute z-0"/>
          <div className="text-[32px] text-white leading-[47px] mx-auto z-10">no. of
            mints: {selectedTokens.length}</div>
        </div>
        <div className="flex flex-col items-center">
          <div className={`flex flex-row items-center ${isApproved && selectedTokens.length <= 0 && 'disabled'}`}>
            <EnterDecorationBlack className="w-[33px]"/>
            <button className="px-3" type="button" onClick={() => {
              if (isApproved) mintHandler();
              else approvalHandler();
            }}>
              <h1 className="text-black text-[64px]">{isApproved ? 'Claim' : 'Approve'}</h1>
            </button>
            <EnterDecorationBlack className="rotate-180 w-[33px]"/>
          </div>
        </div>
      </div>
    );
  }

  function renderStep3() {
    if (step3Status === 'error') {
      if (reservations <= 0) return renderError('', 'No Reservation Detected');
      else if (refundAmount === 0) return renderError('', 'Not Eligible for Refund');
      else if (claimedRefund) return renderError('', 'Refund already claimed');
      else return renderError(step3ErrorMessage, 'Please Try Again');
    }
    if (step3Status === 'loading') {
      return renderLoading('In Progress...');
    }
    if (step3Status === 'completed') {
      return (
        <div className="flex flex-col items-center max-w-[90vw]">
          <Palette/>
          <br/>
          <h3 className="text-[20px] md:text-[40px] whitespace-nowrap">The Dream doesn’t end here</h3>
          <div className="max-w-[100%] relative flex items-center text-center w-[800px]">
            <MintTotalBigBackdrop className="mx-auto"/>
            <h2 className="absolute top-[5px] w-[100%] text-[38px] md:text-[64px] text-white whitespace-nowrap mx-auto">
              Successfully Refunded
            </h2>
          </div>
        </div>
      );
    }
    return (
      <div className="flex flex-col select-none max-w-[90vw]">
        <h3 className="text-h2 whitespace-nowrap">Allocated Merkels: {allocatedMerkels}</h3>
        <div className="flex flex-col items-center mx-auto mt-[16px] relative">
          <MintTotalBackdrop className="absolute z-0"/>
          <div className="text-[32px] text-white leading-[47px] mx-auto mt-[-2px] z-10">
            Refund Amount: {refundAmount * Number(mintPrice)} eth
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex flex-row items-center">
            <EnterDecorationBlack className="w-[33px]"/>
            <button className="px-3" type="button" onClick={refundHandler}>
              <h1 className="text-black text-[64px]">Refund</h1>
            </button>
            <EnterDecorationBlack className="rotate-180 w-[33px]"/>
          </div>
        </div>
      </div>
    );
  }

  function renderContent() {
    if (is24HPostMintPeriod) return render24HPostMint();
    if (step === 0) return renderStep0();
    if (step === 1) return renderStep1();
    if (step === 2) return renderStep2();
    if (step === 3) return renderStep3();
    return null;
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <img className="absolute m-auto min-w-[100vw] xl:min-w-[1200px]" src={EllipseGradient} alt="ellipse"/>
      <video autoPlay className="w-full h-full object-cover object-center" loop muted playsInline>
        <source src={BG_VIDEO} type="video/mp4"/>
      </video>
      <Menu/>
      <div className="cover flex flex-col justify-center items-center">{renderContent()}</div>
      <Footer/>
    </div>
  );
}
