import { ethers } from 'ethers';
import { useCallback, useState } from 'react';
import { ListType, PassengersCheckerResponse } from 'types/interface';
import PassengerMintContractHandler from 'utils/passengers-mint-contract-handler';

export default function useMintAction(
  handler?: ReturnType<typeof PassengerMintContractHandler>,
  flightData?: PassengersCheckerResponse,
  isPublicPhase?: boolean | null,
  nftPrice?: ethers.BigNumber,
) {
  const [isSuccessfulMint, setIsSuccessfulMint] = useState(false);
  const [isMintError, setIsMintError] = useState(false);
  const [isMinting, setIsMinting] = useState(false);

  const { listType, signature } = flightData ?? {};

  const startMint = useCallback(
    async (amount: number) => {
      if (!handler || isPublicPhase === null || !nftPrice) {
        console.error('Trying to mint with insufficient data!', handler, listType, isPublicPhase, nftPrice);
        return;
      }
      const { mintPublic, mintMasterList, mintReserveList } = handler;

      try {
        setIsMinting(true);
        if (isPublicPhase) {
          await mintPublic(amount, nftPrice);
        } else {
          const fn = listType === ListType.Master ? mintMasterList : mintReserveList;
          await fn(amount, nftPrice, signature!);
        }
        setIsSuccessfulMint(true);
      } catch (err) {
        console.error(err);
        setIsMintError(true);
      } finally {
        setIsMinting(false);
      }
    },
    [handler, listType, isPublicPhase, signature, nftPrice],
  );

  return {
    isSuccessfulMint,
    isMinting,
    isMintError,
    startMint,
  };
}
