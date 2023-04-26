import { ethers } from 'ethers';
import { MasterListDetails, PublicListDetails, ReserveListDetails, Signature } from 'types/interface';

export default function PassengerMintContractHandler(
  passengerContract: ethers.Contract,
  passengerMintContract: ethers.Contract,
) {
  const isPublicMinting = () => passengerMintContract.isPublicMinting() as Promise<boolean>;
  const masterListDetails = () => passengerMintContract.masterList() as Promise<MasterListDetails>;
  const reserveListDetails = () => passengerMintContract.reserveList() as Promise<ReserveListDetails>;
  const publicMintingDetails = () => passengerMintContract.publicMint() as Promise<PublicListDetails>;
  const whitelistMintTransactionTracker = (walletAddress: string): Promise<boolean> =>
    passengerMintContract.whitelistMintTransactionTracker(walletAddress);
  const publicMintTransactionTracker = (walletAddress: string): Promise<boolean> =>
    passengerMintContract.publicMintTransactionTracker(walletAddress);
  const totalSupply = () => passengerContract.totalSupply() as Promise<ethers.BigNumber>;
  // Mint Functions
  // Error handling should be done on calling side for error messages
  // pricePerNFT is in ether string, you can get the value from the ListDetails function and then parse it to ether by ethers.utils.FormatEther(value)
  const mintMasterList = async (amount: number, pricePerNFT: ethers.BigNumber, signature: Signature) => {
    const tx = await passengerMintContract.mintMasterList(amount, signature, {
      value: pricePerNFT.mul(amount),
    });
    await tx.wait();
    return tx;
  };
  const mintReserveList = async (amount: number, pricePerNFT: ethers.BigNumber, signature: Signature) => {
    const tx = await passengerMintContract.mintReserveList(amount, signature, {
      value: pricePerNFT.mul(amount),
    });
    await tx.wait();
    return tx;
  };
  const mintPublic = async (amount: number, pricePerNFT: ethers.BigNumber) => {
    const tx = await passengerMintContract.mintPublic(amount, {
      value: pricePerNFT.mul(amount),
    });
    await tx.wait();
    return tx;
  };

  return {
    isPublicMinting,
    masterListDetails,
    reserveListDetails,
    publicMintingDetails,
    whitelistMintTransactionTracker,
    publicMintTransactionTracker,
    totalSupply,
    mintMasterList,
    mintReserveList,
    mintPublic,
    passengerContract,
    passengerMintContract,
  };
}
