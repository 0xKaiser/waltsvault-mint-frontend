import { MintState, ProjectNames, SheetNames } from 'constants/common';

import { Canvas } from '@react-three/fiber';
import { getProject, onChange } from '@theatre/core';
import useBreakpoints from '@twl/common/hooks/useBreakpoints';
import { ReactComponent as PageDecoration } from 'assets/images/img-flight-list-page-decoration.svg';
import mintSceneState from 'assets/theater/mint-corridor.theatre-project-state.json';
import Button from 'components/Button';
import MintCountdown from 'components/Mint/MintCountdown';
import MintLoadingScreen from 'components/Mint/MintLoadingScreen';
import MintPhaseIndicator from 'components/Mint/MintPhaseIndicator/MintPhaseIndicator';
import PassengersSocialButtons from 'components/PassengersSocialButtons';
import MintScene from 'components/react-three-fiber/MintScene';
import useMintData from 'hooks/useMintData';
import useMintPageAudio from 'hooks/useMintPageAudio';
import React, { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { ListType } from 'types/interface';
import Sound, { audio } from 'utils/sound';

const {
  NoSpotsFoundWarning,
  ReserveListDepletedWarning,
  ConnectionError,
  AlreadyMintedPhase1,
  AlreadyMintedPhase2,
  MintingError,
  NotConnected,
  Connecting,
  CanMint,
  MintingInProgress,
  MintingSuccessful,
  AllPassengersMinted,
  NetworkMismatchError,
  WalletError,
} = MintState;
const WARNING_STATUSES = [NoSpotsFoundWarning, ReserveListDepletedWarning, AlreadyMintedPhase1];
const ERROR_STATUSES = [ConnectionError, MintingError, NetworkMismatchError];

export type MintPageState = 'canEnter' | 'traveling' | 'mint';

const project = getProject(ProjectNames.MintCorridor, { state: mintSceneState });
const enterAnimationSheet = project.sheet(SheetNames.EnterAnimation);

export default function MintPage() {
  const mintData = useMintData();
  const {
    flightData,
    isLoading,
    isConnected,
    connect,
    isConnectionError,
    isPublicPhase,
    isSuccessfulMint,
    isMintError,
    isMinting,
    startMint,
    userAlreadyMinted,
    allTokensMinted,
    tokensMinted,
    availableMints,
    isNetworkMismatchError,
    networkName,
    walletError,
    isLoadingContractData,
    address,
    flightSpots,
  } = mintData;
  const navigate = useNavigate();

  const { isMobile } = useBreakpoints();

  const [userEntered, setUserEntered] = useState(false);
  const [enterAnimationCompleted, setEnterAnimationCompleted] = useState(false);
  const [corridorLoaded, setCorridorLoaded] = useState(false);
  const [hologramLoaded, setHologramLoaded] = useState(false);
  const [cameraPanningEnabled, setCameraPanningEnabled] = useState(false);

  const mintState: MintState = useMemo(() => {
    if (isLoading) return Connecting;
    if (allTokensMinted) return AllPassengersMinted;
    if (isNetworkMismatchError) return NetworkMismatchError;
    if (isConnectionError) return ConnectionError;
    if (walletError) return WalletError;
    if (!isConnected) return NotConnected;
    if (isLoadingContractData) return Connecting;
    if (userAlreadyMinted && !isPublicPhase) return AlreadyMintedPhase1;
    if (userAlreadyMinted && isPublicPhase) return AlreadyMintedPhase2;
    if (!isPublicPhase && !flightData) return NoSpotsFoundWarning;
    if (isMinting) return MintingInProgress;
    if (isSuccessfulMint) return MintingSuccessful;
    if (isMintError) return MintingError;
    if (flightSpots === 0 && flightData?.listType === ListType.Reserve && !isPublicPhase)
      return ReserveListDepletedWarning;
    if (flightSpots === 0) {
      console.error('Impossible state reached!');
      return ConnectionError;
    }

    return CanMint;
  }, [
    isLoading,
    flightData,
    isMintError,
    isMinting,
    isSuccessfulMint,
    isConnected,
    isConnectionError,
    isPublicPhase,
    userAlreadyMinted,
    allTokensMinted,
    isNetworkMismatchError,
    walletError,
    isLoadingContractData,
    flightSpots,
  ]);

  const isError = useMemo(() => ERROR_STATUSES.includes(mintState), [mintState]);
  const isWarning = useMemo(() => WARNING_STATUSES.includes(mintState), [mintState]);

  const { mutedAudio, toggleAudio } = useMintPageAudio({
    userEntered,
    enterAnimationCompleted,
    mintState,
    isWalletError: !!walletError,
    isError,
    isWarning,
  });

  const positionTriggeredRef = useRef(false);
  const cameraPanningTriggeredRef = useRef(false);
  async function onEnter() {
    setUserEntered(true);
    audio.sfxAirLockOpen.play();
    audio.flightSfxAmbience.play();

    const remove = onChange(enterAnimationSheet.sequence.pointer.position, position => {
      if (position >= 6 && !positionTriggeredRef.current) {
        positionTriggeredRef.current = true;
        setEnterAnimationCompleted(true);
      }
      if (position >= 2 && !cameraPanningTriggeredRef.current) {
        cameraPanningTriggeredRef.current = true;
        setCameraPanningEnabled(true);
      }
    });

    await enterAnimationSheet.sequence.play();

    remove();
  }

  function mint(count: number) {
    Sound.playFlightSfxButton();
    startMint(count);
  }

  function goHome() {
    navigate('/');
  }

  return (
    <MintCountdown>
      <div className="passengers fixed bg-black top-0 w-screen h-screen overflow-hidden">
        <div id="canvas-container" className="h-full w-full">
          <Canvas
            dpr={1}
            className="h-full w-full"
            gl={{ preserveDrawingBuffer: true, physicallyCorrectLights: true, outputEncoding: THREE.sRGBEncoding }}>
            <MintScene
              onEnter={onEnter}
              mint={mint}
              mintState={mintState}
              startMintingSequence={connect}
              setCorridorLoaded={setCorridorLoaded}
              setHologramLoaded={setHologramLoaded}
              cameraPanningEnabled={cameraPanningEnabled && !isMobile}
              tokensMinted={tokensMinted}
              availableMints={availableMints}
              isPublicPhase={isPublicPhase}
              listType={flightData?.listType}
              networkName={networkName}
              address={address}
              flightSpots={flightSpots}
              isError={isError}
              isWarning={isWarning}
            />
          </Canvas>
        </div>
        <div className="pointer-events-none">
          <div className="fixed top-0 w-full h-[10%] bg-gradient-to-t from-[rgba(12,255,255,0)] to-[rgb(0,240,255)] opacity-20" />
          <div className="fixed bottom-0 w-full h-[10%] bg-gradient-to-b from-[rgba(12,255,255,0)] to-[rgb(0,240,255)] opacity-20" />
          <div className="fixed top-10 right-10 left-10 flex justify-between pointer-events-auto">
            <Button onClick={goHome} small={false}>
              home
            </Button>
            <div className="flex-1  px-8 items-center hidden md:flex">
              <div className="w-full relative">
                <PageDecoration />
                <div className="absolute bottom-[1px] left-[100px] right-8 h-[1px] bg-primary-blue" />
              </div>
            </div>
            <div className="flex flex-grow-0 pointer-events-auto">
              <PassengersSocialButtons muteButton muted={mutedAudio} onToggleMusic={toggleAudio} />
            </div>
          </div>
        </div>
        <div className="absolute bottom-10 left-10">
          <MintPhaseIndicator isPublicPhase={isPublicPhase} />
        </div>
        <MintLoadingScreen corridorLoaded={corridorLoaded} hologramLoaded={hologramLoaded} />
      </div>
    </MintCountdown>
  );
}
