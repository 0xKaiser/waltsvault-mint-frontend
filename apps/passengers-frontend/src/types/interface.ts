import { IProject, IProjectConfig } from '@theatre/core';
import { ethers } from 'ethers';

export interface FlightResponse {
  flight: boolean;
  og: boolean;
  reserve: boolean;
  wait: boolean;
}

export interface AnimationData {
  autoplay?: boolean;
  loop?: boolean;
  objectName: string;
  sheetName: string;
  positionRange?: number;
  scaleRange?: number;
}
export interface AnimationStore {
  project?: IProject;
  setProjectConfig: (id: string, config: IProjectConfig) => void;
}

export enum ListType {
  Master = 1,
  Reserve = 2,
}

type Address = string;
type SignatureKey = string;
export type Signature = [Address, ListType, SignatureKey];
export interface PassengersCheckerResponse {
  address: string;
  listType: ListType;
  signature: Signature;
}

export interface BigNumber {
  _hex: string;
  _isBigNumber: boolean;
}

export interface ReserveListDetails {
  reserveListMintingCount: ethers.BigNumber;
  reserveListMintingLimit: ethers.BigNumber;
  reserveListMintingPrice: ethers.BigNumber;
  reserveListMintingTime: ethers.BigNumber;
}
export interface PublicListDetails {
  mintingCount: ethers.BigNumber;
  mintingLimit: ethers.BigNumber;
  mintingPrice: ethers.BigNumber;
}

export interface MasterListDetails {
  masterListMintingCount: ethers.BigNumber;
  masterListMintingLimit: ethers.BigNumber;
  masterListMintingPrice: ethers.BigNumber;
  masterListMintingTime: ethers.BigNumber;
  reserveListMintingLimit: ethers.BigNumber;
}

export interface AvailableMints {
  reserve?: number;
  master?: number;
  public?: number;
}

export interface EthersError {
  reason: string;
  code: ethers.errors;
  event: string;
  network: ethers.providers.Network;
  detectedNetwork: ethers.providers.Network;
}
