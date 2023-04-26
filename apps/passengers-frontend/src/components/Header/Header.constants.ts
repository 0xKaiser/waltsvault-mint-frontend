import { Pages, SOCIAL_MEDIA } from 'constants/common';

export interface Links {
  text: string;
  to: string;
  border: boolean;
  desktopClasses: string;
  mobileClasses: string;
  type: 'pageRoute' | 'link';
}

export const DESKTOP_LINK_CLASSES = 'pr-4 justify-end mt-4 w-60 h-11 button items-center';
export const MOBILE_LINK_CLASSES = 'w-full button-large text-center items-center justify-center h-20 mt-9 ';
export const MOBILE_LINK_CLASSES_SMALL = 'flex button justify-end items-center align-end mb-12';

export const PAGE_ROUTES: Links[] = [
  {
    to: Pages.passengers,
    text: '_passengers',
    border: true,
    desktopClasses: DESKTOP_LINK_CLASSES,
    mobileClasses: MOBILE_LINK_CLASSES,
    type: 'pageRoute',
  },
  {
    to: Pages.waltsVault,
    text: '_walts*vault',
    border: true,
    desktopClasses: DESKTOP_LINK_CLASSES,
    mobileClasses: MOBILE_LINK_CLASSES,
    type: 'pageRoute',
  },
];

export const SOCIAL_MEDIA_LINKS: Links[] = [
  {
    to: SOCIAL_MEDIA.whiteList.discord.link,
    text: '_discord',
    border: false,
    desktopClasses: DESKTOP_LINK_CLASSES,
    mobileClasses: MOBILE_LINK_CLASSES_SMALL,
    type: 'link',
  },
  {
    to: SOCIAL_MEDIA.whiteList.twitter.link,
    text: '_twitter',
    border: false,
    desktopClasses: DESKTOP_LINK_CLASSES,
    mobileClasses: MOBILE_LINK_CLASSES_SMALL,
    type: 'link',
  },
  {
    to: SOCIAL_MEDIA.whiteList.email.link,
    text: '_email',
    border: false,
    desktopClasses: DESKTOP_LINK_CLASSES,
    mobileClasses: MOBILE_LINK_CLASSES_SMALL,
    type: 'link',
  },
];
