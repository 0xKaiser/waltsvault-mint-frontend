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
    console.log('==> [enter] CONINT/getRavendaleTokens');

    try {
        const userBalance = await ravendaleContract.balanceOf(address).then((res) => {return res.toNumber()});
        const lockedTokens = await contract.getTokensLockedByAddr(address);
        console.log('[log] getRavendaleTokens/userBalance: ', userBalance);
        console.log('[log] getRavendaleTokens/lockedTokens: ', lockedTokens);

        let userTokens = [];
        
        for(let i=0; i<lockedTokens.length; i++){
            tokens.push({
                tokenId: lockedTokens[i],
                locked: true
            });
        }

        if (userBalance > 0) {
            const multicallContract = new Contract(config.ravendaleContractAddress, ravendaleAbi);
    
            let multicallArray = [];
            for (let i = 0; i < config.ravendaleSupply; i++) {
                const n = multicallContract.ownerOf(i);
                multicallArray.push(n);
            }
    
            const resultArray = await ethcallProvider.all(multicallArray);
    
            let i = 0;
            while (i < config.ravendaleSupply) {
                if (address.toUpperCase() === resultArray[i].toUpperCase()) {
                    userTokens.push({
                        tokenId: i,
                        locked: false
                    });
                }
                i++;
            }
            console.log('[output] getRavendaleTokens/userTokens: ', userTokens);
            console.log('<== [exit] CONINT/getRavendaleTokens');
            
            return userTokens;
        } else {
            console.log('<== [exit] CONINT/getRavendaleTokens');
            return userTokens;
        }
    } catch (e) {
        console.log('[ERROR] CONINT/getRavendaleTokens: ',e);
        console.log('<== [exit] CONINT/getRavendaleTokens');
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