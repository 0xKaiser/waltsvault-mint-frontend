import { SOCIAL_MEDIA } from 'constants/common';

import IC_LINKEDIN from 'assets/icons/ic-linkedin.svg';
import IC_TWITTER from 'assets/icons/twitter_passenger.svg';
import AiSam from 'assets/images/team/AI Sam.jpg';
import AlexMerritt from 'assets/images/team/Alex Merritt.jpg';
import AndyRidgway from 'assets/images/team/Andy Ridgway.jpg';
import Atlas from 'assets/images/team/Atlas.jpg';
import ConnorG3 from 'assets/images/team/ConnorG3.jpg';
import Grega from 'assets/images/team/Grega Trobec.jpg';
import JacksonKemp from 'assets/images/team/Jackson.jpg';
import Moonrise from 'assets/images/team/Moonrise.jpg';
import Samantha from 'assets/images/team/Samantha.jpg';
import Woof from 'assets/images/team/Woof.jpg';

export const TEAM_CARD_ACTIVE_SCALE = 1.7;
export const TEAM_CARD_SIZE = { w: 253, h: 253 };
const TWITTER = { icon: IC_TWITTER, alt: 'twitter' };
const LINKEDIN = { icon: IC_LINKEDIN, alt: 'twitter' };

export const TEAM = [
  {
    name: 'ConnorG3',
    title: 'Founder',
    avatar: ConnorG3,
    social: [{ ...TWITTER, link: 'https://twitter.com/ConnorGee_ETH' }],
  },
  {
    name: 'Halfbaked',
    title: 'Community Management',
    avatar: Samantha,
  },
  {
    name: 'Alex Merritt',
    title: 'Fleet Logistics',
    avatar: AlexMerritt,
    social: [{ ...LINKEDIN, link: 'https://uk.linkedin.com/in/alexjmerritt' }],
  },
  {
    name: 'Atlas',
    title: 'Technical Engineer',
    avatar: Atlas,
  },
  {
    name: 'Andy Ridgway',
    title: 'Lore Master',
    avatar: AndyRidgway,
  },
  {
    name: 'Moonrise',
    title: 'Operations',
    avatar: Moonrise,
  },
  {
    name: 'Grega Trobec',
    title: 'UI/UX',
    avatar: Grega,
    social: [{ ...LINKEDIN, link: 'https://www.linkedin.com/in/grega-trobec-05386371' }],
  },
  {
    name: 'Jackson Kemp',
    title: 'Creative Director',
    avatar: JacksonKemp,
    social: [
      { ...LINKEDIN, link: 'https://www.linkedin.com/in/jackson-kemp-831bb8164' },
      { ...TWITTER, link: 'https://twitter.com/UltraJack2020' },
    ],
  },
  {
    name: 'CRC',
    title: 'Lead Dev',
    avatar: Woof,
    social: [{ ...TWITTER, link: 'https://twitter.com/boosts?s=11&t=mA129-DzwEbMMhMJxblmmA' }],
  },
  {
    name: 'S.A.M',
    title: 'Nova’s AI',
    avatar: AiSam,
    social: [{ ...TWITTER, link: SOCIAL_MEDIA.passenger.twitter.link }],
  },
];
