import { PASSENGERS_API } from 'constants/common';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { PassengersCheckerResponse } from 'types/interface';
import { useAccount, useConnect, chain, useSigner } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

import useContract from './useContract';
import useMintAction from './useMintAction';

function getChecker(address: string) {
  return axios.post<PassengersCheckerResponse>(`${PASSENGERS_API}/signer/unique`, { address });
}

export default function useMintData() {
  const { address, isConnected } = useAccount();
  const {
    connect,
    isLoading: isLoadingWallet,
    error: walletError,
  } = useConnect({
    connector: new InjectedConnector({
      chains: [chain.goerli],
    }),
  });
  const { data: signer, error: signerError, isLoading: isLoadingSigner } = useSigner();
  const [flightData, setFlightData] = useState<PassengersCheckerResponse | undefined>();
  const [isLoadingData, setIsLoadingData] = useState(false);

  const {
    contractsHandler,
    isPublicPhase,
    nftPrice,
    isLoading: isLoadingContractData,
    error: contractError,
    isNetworkMismatchError,
    ...contractData
  } = useContract(signer, address, flightData);

  const { isSuccessfulMint, isMintError, isMinting, startMint } = useMintAction(
    contractsHandler,
    flightData,
    isPublicPhase,
    nftPrice,
  );

  // Fetch the flight data when connection is established with the wallet.
  useEffect(() => {
    if (!address) {
      setFlightData(undefined);
      return;
    }

    (async () => {
      try {
        setIsLoadingData(true);
        const { data } = await getChecker(address);
        setFlightData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingData(false);
      }
    })();
  }, [address]);

  const noData = flightData === null;

  const isLoading = isLoadingWallet || isLoadingData || isLoadingSigner;
  const isConnectionError = !!signerError || (!!contractError && !isNetworkMismatchError);

  return {
    isNetworkMismatchError,
    connect,
    address,
    isConnected,
    isLoading,
    isConnectionError,
    flightData,
    noData,
    isPublicPhase,
    isSuccessfulMint,
    isMintError,
    isMinting,
    startMint,
    walletError,
    isLoadingContractData,
    ...contractData,
  };
}
