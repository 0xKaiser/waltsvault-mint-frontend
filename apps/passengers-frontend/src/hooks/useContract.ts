import { PASSENGER_ADDRESS, PASSENGER_MINTER_ADDRESS, POOLING_INTERVAL, TOTAL_TOKENS_SUPPLY } from 'constants/common';

import passenger from 'assets/web3/passenger-abi.json';
import passengerMinter from 'assets/web3/passenger-minter-abi.json';
import { ethers } from 'ethers';
import { useEffect, useMemo, useState } from 'react';
import { AvailableMints, EthersError, ListType, PassengersCheckerResponse } from 'types/interface';
import PassengerMintContractHandler from 'utils/passengers-mint-contract-handler';

export default function useContract(
  signer?: ethers.Signer | null,
  address?: string,
  flightData?: PassengersCheckerResponse,
) {
  const [isPublicPhase, setIsPublicPhase] = useState<boolean | null>(null);
  const [availableMints, setAvailableMints] = useState<AvailableMints>();
  const [nftPrice, setNftPrice] = useState<ethers.BigNumber>();
  const [isLoadingContractData, setIsLoadingContractData] = useState(false);
  const [userAlreadyMinted, setUserAlreadyMinted] = useState(false);
  const [tokensMinted, setTokensMinted] = useState<number | null>(null);
  const [error, setError] = useState<EthersError>();
  const [remainingSupply, setRemainingSupply] = useState(Number.POSITIVE_INFINITY);

  const isLoading = (tokensMinted === null && !error) || (isLoadingContractData && !availableMints);
  const isNetworkMismatchError = error && error.detectedNetwork.chainId !== error.network.chainId;
  const networkName = error?.network.name;
  const allTokensMinted = (tokensMinted || 0) >= TOTAL_TOKENS_SUPPLY || remainingSupply === 0;

  const contractsHandler = useMemo(() => {
    if (!signer) return undefined;

    return PassengerMintContractHandler(
      new ethers.Contract(PASSENGER_ADDRESS, passenger, signer),
      new ethers.Contract(PASSENGER_MINTER_ADDRESS, passengerMinter, signer),
    );
  }, [signer]);

  // pool for public phase status
  useEffect(() => {
    if (isPublicPhase || !contractsHandler) return undefined;

    async function poolPublicPhase() {
      if (!contractsHandler) return;

      try {
        const isPublic = await contractsHandler.isPublicMinting();
        if (isPublic !== isPublicPhase) setIsPublicPhase(isPublic);
      } catch (err) {
        console.error(err);
        setError(err as EthersError);
      }
    }

    poolPublicPhase();
    const interval = setInterval(poolPublicPhase, POOLING_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, [isPublicPhase, contractsHandler]);

  // pool for minted tokens
  useEffect(() => {
    if (!contractsHandler || allTokensMinted) return undefined;

    async function loadTokensMinted() {
      if (!contractsHandler) return;

      contractsHandler.totalSupply().then(res => setTokensMinted(res.toNumber()));
      if (isPublicPhase) {
        const publicDetails = await contractsHandler.publicMintingDetails();
        setRemainingSupply(publicDetails.mintingCount.toNumber());
      } else {
        const [master, reserve] = await Promise.all([
          contractsHandler.masterListDetails(),
          contractsHandler.reserveListDetails(),
        ]);

        setRemainingSupply(master.masterListMintingCount.toNumber() + reserve.reserveListMintingCount.toNumber());
      }
    }

    loadTokensMinted();
    const interval = setInterval(loadTokensMinted, POOLING_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, [contractsHandler, allTokensMinted, isPublicPhase]);

  useEffect(() => {
    async function getContractData() {
      try {
        if (!contractsHandler || isPublicPhase === null || !address) return;
        setIsLoadingContractData(true);

        const userHasuserAlreadyMinted = isPublicPhase
          ? await contractsHandler.publicMintTransactionTracker(address)
          : await contractsHandler.whitelistMintTransactionTracker(address);

        if (userHasuserAlreadyMinted) {
          setUserAlreadyMinted(true);
          return;
        }

        if (isPublicPhase) {
          const { mintingCount, mintingLimit, mintingPrice } = await contractsHandler.publicMintingDetails();

          setNftPrice(mintingPrice);
          setAvailableMints({ public: Math.min(mintingLimit.toNumber(), mintingCount.toNumber()) });
        } else if (flightData?.listType === ListType.Master) {
          const [masterDetails, reserveDetails] = await Promise.all([
            contractsHandler.masterListDetails(),
            contractsHandler.reserveListDetails(),
          ]);
          const { masterListMintingPrice, masterListMintingLimit, masterListMintingCount, reserveListMintingLimit } =
            masterDetails;
          const { reserveListMintingCount } = reserveDetails;

          setNftPrice(masterListMintingPrice);
          setAvailableMints({
            master: Math.min(masterListMintingLimit.toNumber(), masterListMintingCount.toNumber()),
            reserve: Math.min(reserveListMintingLimit.toNumber(), reserveListMintingCount.toNumber()),
          });
        } else {
          const { reserveListMintingPrice, reserveListMintingLimit, reserveListMintingCount } =
            await contractsHandler.reserveListDetails();

          setNftPrice(reserveListMintingPrice);
          setAvailableMints({
            reserve: Math.min(reserveListMintingLimit.toNumber(), reserveListMintingCount.toNumber()),
          });
        }
      } catch (err) {
        console.error(err);
        setError(err as EthersError);
      } finally {
        setIsLoadingContractData(false);
      }
    }
    getContractData();
  }, [contractsHandler, flightData, isPublicPhase, address]);

  useEffect(() => {
    if (!address || !contractsHandler) return undefined;

    // clear all data in case the user changes/disconnects his wallet
    return () => {
      setNftPrice(undefined);
      setAvailableMints(undefined);
      setError(undefined);
      setIsPublicPhase(null);
      setUserAlreadyMinted(false);
      setTokensMinted(null);
      setIsPublicPhase(null);
      setRemainingSupply(Number.POSITIVE_INFINITY);
    };
  }, [address, contractsHandler]);

  const flightSpots = useMemo(() => {
    if (!availableMints) return 0;
    return Object.values(availableMints).reduce((acc, cur) => acc + (cur || 0), 0) as number;
  }, [availableMints]);

  return {
    contractsHandler,
    isPublicPhase,
    availableMints,
    nftPrice,
    isLoading,
    userAlreadyMinted,
    tokensMinted,
    allTokensMinted,
    error,
    isNetworkMismatchError,
    networkName,
    flightSpots,
  };
}
