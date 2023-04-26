import { ethers, utils } from 'ethers';
import { Provider, Contract } from 'ethers-multicall';

import config from './config.json';
import abi from './abi.json';
import ravendaleAbi from './ravendaleAbi.json';

let provider: ethers.providers.JsonRpcProvider, ethcallProvider: Provider, contract: ethers.Contract,
  ravendaleContract: ethers.Contract;

export const providerHandler = async () => {
  provider = new ethers.providers.Web3Provider(window.ethereum);
  const account = await provider.listAccounts();
  const address = account[0];
  const signer = provider.getSigner();

  ethcallProvider = new Provider(provider);
  await ethcallProvider.init();

  contract = new ethers.Contract(config.contractAddress, abi, signer);
  ravendaleContract = new ethers.Contract(config.ravendaleContractAddress, ravendaleAbi, signer);

  return address;
};

export const providerHandlerReadOnly = async () => {
  const provider = new ethers.providers.JsonRpcProvider(config.rpcProvider);
  contract = new ethers.Contract(config.contractAddress, abi, provider);
};

export const getRavendaleTokens = async (address: string) => {
  try {
    const ravendaleSupply = await ravendaleContract.totalSupply().then((res: ethers.BigNumber) => {
      return res.toNumber();
    });
    const userBalance = await ravendaleContract.balanceOf(address).then((res: ethers.BigNumber) => {
      return res.toNumber();
    });
    const lockedTokens = await contract.getTokensLockedByAddr(address).then((res: ethers.BigNumber[]) => {
      const tokens: number[] = [];
      res.forEach(token => tokens.push(token.toNumber()));
      return tokens;
    });

    let userTokens = [];

    for (let i = 0; i < lockedTokens.length; i++) {
      userTokens.push({
        tokenId: lockedTokens[i],
        locked: true,
      });
    }

    if (userBalance > 0) {
      const multicallContract = new Contract(config.ravendaleContractAddress, ravendaleAbi);

      let multicallArray = [];
      for (let i = 1; i <= ravendaleSupply; i++) {
        const n = multicallContract.ownerOf(i);
        multicallArray.push(n);
      }

      const resultArray = await ethcallProvider.all(multicallArray);

      let i = 0;
      while (i < ravendaleSupply) {
        if (address.toUpperCase() === resultArray[i].toUpperCase()) {
          userTokens.push({
            tokenId: i + 1,
            locked: false,
          });
        }
        i++;
      }

      userTokens.sort((a, b) => (a.tokenId > b.tokenId) ? 1 : -1);
      return userTokens;
    } else {
      userTokens.sort((a, b) => (a.tokenId > b.tokenId) ? 1 : -1);
      return userTokens;
    }
  } catch (e) {
    console.log('[ERROR] CONINT/getRavendaleTokens: ', e);
    return [];
  }
};

export const getState = async () => {
  const n = await contract.state();

  switch (n) {
    default:
      return 'NOT_LIVE';
    case 0:
      return 'NOT_LIVE';
    case 1:
      return 'LIVE';
    case 2:
      return 'OVER';
    case 3:
      return 'REFUND';
  }
};

export const getResSpotVL = async () => {
  const n = await contract.MAX_RES_PER_ADDR_VL();
  return n.toNumber();
};

export const getResSpotFCFS = async () => {
  const n = await contract.MAX_RES_PER_ADDR_FCFS();
  return n.toNumber();
};

export const getUsedResVL = async (address: string) => {
  const n = await contract.resByAddr_VL(address);
  return n.toNumber();
};

export const getUsedResFCFS = async (address: string) => {
  const n = await contract.resByAddr_FCFS(address);
  return n.toNumber();
};

export const getMintPrice = async () => {
  const n = await contract.PRICE_PER_RES();
  return utils.formatEther(n.toString());
};

export const getIsApproved = async (address: string) => {
  const n = await ravendaleContract.isApprovedForAll(address, config.contractAddress);
  return n;
};

export const getClaimedRefund = async (address: string) => {
  const n = await contract.hasClaimedRefund(address);
  return n;
};

// Write Functions
export const setApproval = async () => {
  const n = await ravendaleContract.setApprovalForAll(config.contractAddress, true);
  await n.wait();
  return n;
};

export const placeOrder = async (account: any, price: number, tokensToLock: number[], signature: any[], amountVL: number, amountFCFS: number) => {

  let signer;
  if (amountVL <= 0 || signature === undefined) {
    signer = [
      1682315415,
      0,
      account,
      '0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    ];
  } else {
    signer = signature;
  }

  const n = await contract.placeOrder(
    tokensToLock,
    signer,
    amountVL,
    amountFCFS,
    { value: utils.parseEther(((amountVL + amountFCFS) * price).toFixed(5).toString()) },
  );
  await n.wait();
  return n;
};

export const refund = async (signature: any[]) => {
  const n = await contract.claimRefund(signature);
  await n.wait();
  return n;
};
