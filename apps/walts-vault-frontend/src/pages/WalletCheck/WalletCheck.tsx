import EllipseGradient from '../../assets/images/img-ellipse-gradient.png';
import BG_VIDEO from '../../assets/videos/WV-bg-team.mp4';
import { ReactComponent as BrokenPencilBlack } from 'assets/icons/ic-broken-pencil-black.svg';
import { ReactComponent as EnterDecorationBlack } from 'assets/icons/ic-enter-decoration-black.svg';
import { ReactComponent as Palette } from 'assets/icons/ic-palette.svg';
import { ReactComponent as MintErrorBackdrop } from 'assets/images/backdrops/img-mint-error-backdrop.svg';
import { ReactComponent as MintTotalBigBackdrop } from 'assets/images/backdrops/img-mint-total-big-backdrop.svg';
import { ReactComponent as PaintbrushBlack } from 'assets/icons/ic-paintbrush-black.svg';
import { ReactComponent as Delimeter } from 'assets/icons/ic-delimeter.svg';
import Menu from '../../components/Menu';
import Footer from '../../components/Footer';
import { useEffect, useState } from 'react';
import { useAccount, useNetwork, useProvider, useSigner, useSwitchNetwork } from 'wagmi';

import config from '../../web3/config.json';
import { useWeb3Modal } from '@web3modal/react';
import { getOrderSignature } from 'utils/backendApi';
import { providerHandler, getRavendaleBalance } from 'web3/contractInteraction';

export default function WalletCheck() {
    const { address, isConnected } = useAccount();
    const { chain } = useNetwork();
    const { open } = useWeb3Modal();
    const { data } = useSigner();
    const { switchNetwork } = useSwitchNetwork();
    const provider = useProvider();

    const [allocatedSpots, setAllocatedSpots] = useState(0);
    const [ravendaleTokens, setRavendaleTokens] = useState(0);

    const [step, setStep] = useState(0);
    const [step0Status, setStep0Status] = useState('initial'); // initial loading error completed
    const [step1Status, setStep1Status] = useState('initial'); // initial loading error completed
    const [errorMessage, setErrorMessage] = useState('Hmmm, something went wrong');
    const [successMessage, setSuccessMessage] = useState('Successfully Minted');

    const accountSetup = async () => {
        setStep(0);
        setStep0Status('loading');

        if (data) {
            console.log('Mint/accountSetup~ data: ', true);
            await providerHandler(data, provider);
        }

        const ravendaleBalance = await getRavendaleBalance(address || '');
        setRavendaleTokens(ravendaleBalance);

        const orderSignature = await getOrderSignature(address);
        setAllocatedSpots(orderSignature ? orderSignature.signature[1] : 0);

        setStep(1);
        setStep0Status('completed');
    }

    useEffect(() => {
        if (address && data && chain?.id === config.chainID) accountSetup();
    }, [address, data]);

    useEffect(() => {
        if (!isConnected) {
            setStep(0);
            setStep0Status('initial');
        }
    }, [isConnected]);

    const handleChainChange = async () => {
        const chainID = config.chainID;
        if (chain !== undefined && chain.id !== chainID) {
            setStep(0);
            setStep0Status('loading');
            switchNetwork?.(chain.id);
        } else {
            setStep(1);
            setStep0Status('completed');
        }
    };

    useEffect(() => {
        if (chain) handleChainChange();
    }, [chain]);

    function renderLoading(subTitle: string, isLoading: boolean, width: string) {
        return (
            <div className="flex flex-col md:flex-row gap-4 items-center animation">
                <PaintbrushBlack />
                <h3 className={`${width} text-h3 whitespace-nowrap ${isLoading && 'loading'}`}>{subTitle}</h3>
            </div>
        );
    }

    function renderError(title: string, subTitle: string) {
        return (
            <div className="flex flex-col items-center max-w-[90vw] animation">
                <BrokenPencilBlack />
                <br />
                <h3 className="text-[20px] md:text-[40px] whitespace-nowrap">{title}</h3>
                <div className="max-w-[100%] relative flex items-center text-center w-[800px]">
                    <MintErrorBackdrop className="max-w-[100vw] mx-auto" />
                    <h2 className="absolute top-[5px] w-[100%] text-[30px] md:text-[64px] text-white whitespace-nowrap mx-auto">
                        {subTitle}
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

    function renderStep0() {
        if (step0Status === 'error') {
            return renderError('Hmmm, something went wrong', 'Error: Unable to Connect');
        }
        if (step0Status === 'loading') {
            if (chain !== undefined && chain.id !== config.chainID) {
                return renderLoading('Switch to Ethereum Mainnet', false, 'chain');
            } else {
                return renderLoading('Connecting Wallet', true, 'connect');
            }
        }
        return (
            <>
                <div className="flex items-center animation">
                    <EnterDecorationBlack />
                    <button className="px-10" type="button" onClick={connectWallet}>
                        <h1 className="text-black">Connect</h1>
                    </button>
                    <EnterDecorationBlack className="rotate-180" />
                </div>
                <h3 className="text-h4 mt-[-2%]">Follow Your Dreams</h3>
            </>
        );
    }

    function renderStep1() {
        return (
            <div className="flex flex-col items-center max-w-[90vw] my-14 animation">
                {/* {ravendaleTokens > 0 &&
                    <>
                        <div
                            className={`flex row items-center justify-between w-[75%]`}>
                            <div className="flex flex-col">
                                <span className="text-[42px]">Ravendale</span>
                            </div>
                            <span className="text-[26px]">
                                {ravendaleTokens}
                            </span>
                        </div>
                        <Delimeter
                            className={`max-w-[100%] my-[10px]`}
                        />
                    </>
                } */}
                {(allocatedSpots || ravendaleTokens) &&
                    <>
                        <Palette className='my-[1rem]'/>
                        <br />
                        <div className="max-w-[100%] relative flex items-center text-center w-[600px]">
                            <MintTotalBigBackdrop className="mx-auto" />
                            <h2 className="absolute top-[5px] w-[100%] text-[38px] md:text-[44px] text-white whitespace-nowrap mx-auto">
                                Hey, you've got {allocatedSpots + ravendaleTokens} Vault List spot{(allocatedSpots + ravendaleTokens) > 1 ? 's!' : '!'}
                            </h2>
                        </div>
                    </>
                }
                {(allocatedSpots === 0 && ravendaleTokens === 0) &&
                    <>
                        {/* <BrokenPencilBlack /> */}
                        <Palette className='my-[1rem]'/>
                        <br />
                        <div className="max-w-[100%] relative flex items-center text-center w-[600px]">
                            {/* <MintErrorBackdrop className="max-w-[100vw] mx-auto" /> */}
                            <MintTotalBigBackdrop className="mx-auto" />
                            <h2 className="absolute top-[5px] w-[100%] text-[38px] md:text-[44px] text-white whitespace-nowrap mx-auto">
                                You are on the FCFS list
                            </h2>
                        </div>
                    </>
                }
            </div>
        )
    }

    return (
        <div className="h-screen w-screen flex items-center justify-center">
            <img
                className="absolute h-[100vh] xl:h-[auto] m-auto min-w-[100vw] xl:min-w-[1200px]"
                src={EllipseGradient}
                alt="ellipse"
            />
            <video autoPlay className="w-full h-full object-cover object-center" loop muted playsInline>
                <source src={BG_VIDEO} type="video/mp4" />
            </video>
            <Menu />
            <div className="cover flex flex-col justify-center items-center">
                {step === 0 ? renderStep0() : renderStep1()}
            </div>
            <Footer />
        </div>
    )
}