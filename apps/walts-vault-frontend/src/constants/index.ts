import { ReactComponent as IcDiscord } from 'assets/icons/ic-discord.svg';
import { ReactComponent as IcTwitter } from 'assets/icons/ic-twitter.svg';
import { ReactComponent as AboutBackdrop } from 'assets/images/backdrops/img-about-backdrop.svg';
import { ReactComponent as TeamBackdrop } from 'assets/images/backdrops/img-team-backdrop.svg';
import { ReactComponent as VisionBackdrop } from 'assets/images/backdrops/img-vision-backdrop.svg';
import { ReactComponent as VwBackdrop } from 'assets/images/backdrops/img-vw-backdrop.svg';

export const TABLE_SIZE = { width: 2636, height: 1651 };
export const TABLE_TARGET_SIZE = {
  zoomOut: { width: 1920, height: 1080 },
  nftZoom: { height: 740 },
  subPageZoom: { height: 600 },
  mobile: { width: 700 },
  mobileSubPageZoom: { width: 600 },
};

export enum AppState {
  NFT_FOCUS,
  DEFAULT,
  SUB_PAGE,
}

export const PAGE_ROUTE = {
  vault: {
    path: '/',
    name: 'Walt’s Vault',
    backdrop: VwBackdrop,
  },
  vision: {
    path: '/vision',
    name: 'Vision',
    backdrop: VisionBackdrop,
  },
  about: {
    path: '/about',
    name: 'About',
    backdrop: AboutBackdrop,
  },
  team: {
    path: '/team',
    name: 'Team',
    backdrop: TeamBackdrop,
  },
};

export const SOCIAL_MEDIA_LINKS = [
  {
    to: 'https://mclxxmii.xyz',
    text: 'Discord',
    Icon: IcDiscord,
  },
  {
    to: 'https://twitter.com/waltsvault_nft',
    text: 'Twitter',
    Icon: IcTwitter,
  },
];
