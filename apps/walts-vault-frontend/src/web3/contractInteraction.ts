import { ethers, utils } from 'ethers';
import { Provider, Contract } from 'ethers-multicall';

import config from './config.json';
import abi from './mintControllerAbi.json';
import vaultAbi from './vaultAbi.json';
import ravendaleAbi from './ravendaleAbi.json';

let ethcallProvider: Provider, contract: ethers.Contract,
  ravendaleContract: ethers.Contract;

export const providerHandler = async (signer: any, provider: any) => {
  ethcallProvider = new Provider(provider);
  await ethcallProvider.init();

  contract = new ethers.Contract(config.mintControllerContractAddress, abi, signer);
  ravendaleContract = new ethers.Contract(config.ravendaleContractAddress, ravendaleAbi, signer);

  return true;
};

export const providerHandlerReadOnly = async () => {
  const provider = new ethers.providers.JsonRpcProvider(config.rpcProvider);
  contract = new ethers.Contract(config.mintControllerContractAddress, abi, provider);
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

export const getMintTime = async () => {
  const multicallContract = new Contract(config.mintControllerContractAddress, abi);

  const multicallArray = [
    multicallContract.START_TIME_RD(),
    multicallContract.END_TIME_RD(),
    multicallContract.START_TIME_VL(),
    multicallContract.END_TIME_VL(),
    multicallContract.START_TIME_PUBLIC(),
    multicallContract.END_TIME_PUBLIC()
  ];

  const resultArray = await ethcallProvider.all(multicallArray);

  const mintTimes = {
    START_RD: resultArray[0],
    END_RD: resultArray[1],
    START_VL: resultArray[2],
    END_VL: resultArray[3],
    START_PUBLIC: resultArray[4],
    END_PUBLIC: resultArray[5],
  }

  return mintTimes;
}

export const getMintsPerRD = async () => {
  const n = await contract.MAX_MINTS_PER_TOKEN_RD();
  return n;
};

export const getResSpotVL = async () => {
  const n = await contract.MAX_MINTS_PER_SPOT_VL();
  return n;
};

export const getResSpotFCFS = async () => {
  const n = await contract.MAX_MINTS_PER_ADDR_PUBLIC();
  return n;
};

export const getUsedResVL = async (address: string) => {
  const n = await contract.vlMintsBy(address);
  return n.toNumber();
};

export const getUsedResFCFS = async (address: string) => {
  const n = await contract.publicMintsBy(address);
  return n.toNumber();
};

export const getMaxAmountForSale = async () => {
  const n = await contract.MAX_AMOUNT_FOR_SALE();
  return n;
}

export const getAmountSold = async () => {
  const n = await contract.amountSold();
  return n;
}

export const getMintPrice = async () => {
  const n = await contract.PRICE();
  return utils.formatEther(n.toString());
};

export const getIsApproved = async (address: string) => {
  const n = await ravendaleContract.isApprovedForAll(address, config.mintControllerContractAddress);
  return n;
};

// Write Functions
export const setApproval = async () => {
  const n = await ravendaleContract.setApprovalForAll(config.mintControllerContractAddress, true);
  await n.wait();
  return n;
};

export const placeOrder = async (account: any, price: number, tokensToLock: number[], signature: any[], amountRD: number, amountVL: number, amountFCFS: number) => {

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

  const n = await contract.mint(
    amountRD,
    amountVL,
    amountFCFS,
    tokensToLock,
    signer,
    { value: utils.parseEther(((amountVL + amountFCFS) * price).toFixed(5).toString()) },
  );
  await n.wait();
  return n;
};