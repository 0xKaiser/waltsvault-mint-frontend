import { ethers, utils } from "ethers";
import { Contract, Provider } from "ethers-multicall";

import config from "./config.json";
import abi from "./abi.json";
import ravendaleAbi from "./ravendaleAbi.json";

let provider, ethcallProvider, contract, ravendaleContract;

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

export const getRavendaleTokens = async (address) => {
    try {
        const userBalance = await ravendaleContract.balanceOf(address).then((res) => {return res.toNumber()});
        console.log('RBAL', userBalance);

        if (userBalance > 0) {
            const lockedTokens = await contract.getTokensLockedByAddr(address);
            
            const multicallContract = new Contract(config.ravendaleContractAddress, ravendaleAbi);
    
            let multicallArray = [];
            for (let i = 0; i < config.ravendaleSupply; i++) {
                const n = multicallContract.ownerOf(i);
                multicallArray.push(n);
            }
    
            const resultArray = await ethcallProvider.all(multicallArray);
    
            let tokens = [], i = 0;
            while (i < config.ravendaleSupply || tokens.length === userBalance - 1) {
                if (address.toUpperCase() === resultArray[i].toUpperCase()) {
                    tokens.push({
                        tokenId: i,
                        locked: lockedTokens.includes(i)
                    });
                }
                i++;
            }
    
            return tokens;
        } else {
            return [];
        }
    } catch (e) {
        console.log(e);
        return [];
    }
};

export const getResSpotVL = async () => {
    const n = await contract.maxResPerSpot_VL();
    return n.toNumber();
}

export const getResSpotFCFS = async () => {
    const n = await contract.maxResPerAddr_FCFS();
    return n.toNumber();
}

export const getUsedResVL = async (address) => {
    const n = await contract.resByAddr_VL(address);
    return n.toNumber();
}

export const getUsedResFCFS = async (address) => {
    const n = await contract.resByAddr_FCFS(address);
    return n.toNumber();
}

export const getMintPrice = async () => {
    const n = await contract.resPrice();
    return n.toNumber();
}

export const getIsApproved = async (address) => {
    const n = await ravendaleContract.isApprovedForAll(address, config.contractAddress);
    return n;
}

// Write Functions
export const setApproval = async () => {
    const n = await ravendaleContract.setApprovalForAll(config.contractAddress, true);
    await n.wait();
    return n;
}

export const placeOrder = async (price, tokensToLock, signature, amountVL, amountFCFS) => {
    const n = await contract.placeOrder(
        tokensToLock, 
        signature, 
        amountVL, 
        amountFCFS, 
        {value: utils.parseEther(((amountVL + amountFCFS) * price).toFixed(5).toString())}
    );
    await n.wait();
    return n;
}