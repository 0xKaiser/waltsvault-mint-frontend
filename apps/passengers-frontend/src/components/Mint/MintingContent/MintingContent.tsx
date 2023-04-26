import { MintState, TOTAL_TOKENS_SUPPLY } from 'constants/common';

import FlightListButton from 'components/FlightList/FlightListButton';
import FlightListStatusBox from 'components/FlightList/FlightListStatusBox';
import NoTextScale from 'components/NoTextScale';
import React, { memo } from 'react';

import DecoratedMintButton from '../DecoratedMintButton';
import MintSelection from '../MintSelection';
import { MintSelectionProps } from '../MintSelection/MintSelection';

export interface MintingContentProps extends MintSelectionProps {
  startMintingSequence: () => void;
  mintState: MintState;
  networkName?: string;
  address?: string;
  isError: boolean;
  isWarning: boolean;
}

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
const OPEN_SEA_BUTTON = [AlreadyMintedPhase2, AllPassengersMinted];
const INITIAL_STATE = [NotConnected, WalletError];

export default memo((props: MintingContentProps) => {
  const { startMintingSequence, mintState, tokensMinted, networkName, address, isError, isWarning, ...rest } = props;
  const MIN_STATUSES: Record<string, { title: string; content: string }> = {
    [NoSpotsFoundWarning]: { title: 'no spot found', content: 'waiting for public phase' },
    [ReserveListDepletedWarning]: { title: 'reserved list has been depleted', content: 'waiting for public phase' },
    [ConnectionError]: { title: 'system error', content: 'connection failed' },
    [AlreadyMintedPhase1]: { title: 'you have already minted', content: 'waiting for public phase' },
    [AlreadyMintedPhase2]: { title: 'you have already minted', content: '' },
    [MintingError]: { title: 'system error', content: 'minting unsuccessful' },
    [NotConnected]: { title: '', content: '' },
    [Connecting]: { title: 'sequence initiated', content: 'loading...' },
    [CanMint]: { title: '', content: '' },
    [MintingInProgress]: { title: 'minting in progress', content: 'loading...' },
    [MintingSuccessful]: { title: 'congratulations passenger', content: 'minting successful' },
    [AllPassengersMinted]: { title: 'all passengers have been launched. the mint is completed', content: '' },
    [NetworkMismatchError]: { title: 'network error', content: `switch to ${networkName} network` },
    [WalletError]: { title: 'system error, try again', content: 'wallet unreachable' },
  };

  const showOpenSea = OPEN_SEA_BUTTON.includes(mintState);
  const showInitiateButton = INITIAL_STATE.includes(mintState);
  const isWalletError = mintState === WalletError;

  function openOpenSea() {
    window.open('https://opensea.io/collection/passengersnft');
  }

  function renderContent() {
    const { content, title } = MIN_STATUSES[mintState];

    if (mintState === CanMint) return <MintSelection tokensMinted={tokensMinted} {...rest} />;
    if (showOpenSea)
      return (
        <div className="flex flex-col items-center gap-10 max-w-[45%]">
          <NoTextScale>
            <div className="text-center w-full caption-small uppercase text-primary-blue">{title}</div>
          </NoTextScale>
          <DecoratedMintButton
            onClick={openOpenSea}
            numberOfMinted={tokensMinted || 0}
            totalSupply={TOTAL_TOKENS_SUPPLY}>
            GO TO OPENSEA
          </DecoratedMintButton>
        </div>
      );
    if (showInitiateButton)
      return (
        <div className="flex flex-col items-center gap-8">
          {isWalletError && (
            <FlightListStatusBox error title={title}>
              {content}
            </FlightListStatusBox>
          )}
          <FlightListButton onClick={startMintingSequence} title="WELCOME RECRUIT">
            INITIATE MINTING SEQUENCE
          </FlightListButton>
        </div>
      );

    return (
      <FlightListStatusBox warning={isWarning} error={isError} title={title}>
        {content}
      </FlightListStatusBox>
    );
  }

  return (
    <div className="h-screen w-screen flex justify-center items-center scale-125 md:scale-100">
      <div className="relative flex justify-center items-center">
        {renderContent()}
        {!!address && (
          <div className="description w-full text-center text-white absolute top-[-40px]">
            <NoTextScale>{address.substring(0, 8)}</NoTextScale>
          </div>
        )}
      </div>
    </div>
  );
});
