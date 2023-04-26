import DISCORD_ICON from 'assets/icons/discord.png';
import { ReactComponent as DISCORD_PASSENGER_ICON } from 'assets/icons/discord_passenger.svg';
import EMAIL_ICON from 'assets/icons/email.png';
import { ReactComponent as OPENSEA_PASSENGER_ICON } from 'assets/icons/opensea_passenger.svg';
import TWITTER_ICON from 'assets/icons/twitter.png';
import { ReactComponent as TWITTER_PASSENGER_ICON } from 'assets/icons/twitter_passenger.svg';

export const VIEW_PORT_INTERSECTION_TAG = 'view-port-intersection';
export const VIRTUAL_SCROLL_EASING_DURATION = 0.5;
export const THREE_HTML_DISTANCE_MULTIPLIER = 1;

export enum Pages {
  passengers = '/passengers',
  waltsVault = '/walts',
}

export const SOCIAL_MEDIA = {
  whiteList: {
    discord: { link: 'http://discord.gg/the-whitelist', icon: DISCORD_ICON, alt: 'discord' },
    twitter: { link: 'https://twitter.com/_thewhitelist_', icon: TWITTER_ICON, alt: 'twitter' },
    email: { link: 'mailto:#', icon: EMAIL_ICON, alt: 'email' },
  },
  passenger: {
    discord: { link: 'https://discord.gg/passengers', icon: DISCORD_PASSENGER_ICON, alt: 'discord' },
    twitter: { link: 'https://twitter.com/Passengers_NFT', icon: TWITTER_PASSENGER_ICON, alt: 'twitter' },
    opensea: { link: 'https://opensea.io/collection/passengersgenesis', icon: OPENSEA_PASSENGER_ICON, alt: 'opensea' },
    // email: { link: 'mailto:info@passengers.space', icon: EMAIL_PASSENGER_ICON, alt: 'email' },
  },
};

export const FOOTER_LEGAL_COPYRIGHT = {
  whiteList: 'THE WHITE LIST © ALL RIGHTS RESERVED.',
  passenger: 'PASSENGERS. ALL RIGHTS RESERVED.',
};

export enum BREAKPOINTS {
  sm = 640,
  md = 768,
  lg = 1024,
  xl = 1280,
  xxl = 1536,
}

export enum LocalStorageKeys {
  MUTE = 'mute',
}

export const ENABLE_GUI = false;

export enum FlightState {
  'EnterScreen',
  'Console',
  'CheckingProgress',
  'NoDataFound',
  'FlightSpots',
}

export enum ProjectNames {
  MintCorridor = 'mint-corridor',
}

export enum SheetNames {
  Scene = 'scene',
  SkyBox = 'skyBox',
  EnterAnimation = 'enterAnimation',
}

export const COLORS = {
  'primary-blue': '#00f0ff',
  'primary-dark': '#80818D',
  error: '#FF3A83',
  warning: '#FEB113',
};

export const PASSENGERS_API = 'https://passengersmint.0xytocin.online';

export enum MintPhase {
  Phase1,
  Phase2,
}

export const PHASE_1_START = new Date('21 Dec 2022 16:00:00 GMT');

export const PASSENGER_ADDRESS = String(process.env.REACT_APP_PASSENGER_ADDRESS);
export const PASSENGER_MINTER_ADDRESS = String(process.env.REACT_APP_PASSENGER_PASSENGER_MINTER_ADDRESS);

export enum MintState {
  NoSpotsFoundWarning = 'NO_SPOTS_FOUND_ERROR',
  ReserveListDepletedWarning = 'RESERVE_LIST_DEPLETED_WARNING',
  ConnectionError = 'CONNECTION_ERROR',
  MintingError = 'MINTING_ERROR',
  NetworkMismatchError = 'NETWORK_MISMATCH_ERROR',
  NotConnected = 'NOT_CONNECTED',
  Connecting = 'CONNECTING',
  CanMint = 'CAN_MINT',
  MintingInProgress = 'MINTING_IN_PROGRESS',
  MintingSuccessful = 'MINTING_SUCCESSFUL',
  AlreadyMintedPhase1 = 'ALREADY_MINTED_PHASE_1',
  AlreadyMintedPhase2 = 'ALREADY_MINTED_PHASE_2 ',
  AllPassengersMinted = 'ALL_PASSENGERS_MINTED',
  WalletError = 'WALLET_ERROR',
}

export const MASTER_LIST_SUPPLY = 5000;
export const RESERVE_LIST_SUPPLY = 3500;
export const TOTAL_TOKENS_SUPPLY = MASTER_LIST_SUPPLY + RESERVE_LIST_SUPPLY;

export const POOLING_INTERVAL = 5000; // ms

export const DEBUG_KEY = 't9X9uSkCjphEItU';
