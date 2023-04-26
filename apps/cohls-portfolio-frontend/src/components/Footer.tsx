import React from 'react';
import IC_DISCORD from '../assets/images/ic-discord.svg';
import IC_FOUNDATION from '../assets/images/ic-foundation.svg';
// import IC_INSTAGRAM from '../assets/images/ic-instagram.svg';
import IC_MAIL from '../assets/images/ic-mail.svg';
import IC_TWITTER from '../assets/images/ic-twitter.svg';
import IC_WALTS_VAULT from '../assets/images/ic-walts-vault.svg';
import DIVIDER from '../assets/images/divider.png';

const socials = [
  { icon: IC_WALTS_VAULT, link: 'https://waltsvault.xyz' },
  { icon: IC_TWITTER, link: 'https://twitter.com/Cohl_world' },
  // { icon: IC_INSTAGRAM, link: ':)' },
  { icon: IC_FOUNDATION, link: 'https://foundation.app/@CohlWorld' },
  { icon: IC_MAIL, link: 'mailto:cohlworld@proton.me' },
  { icon: IC_DISCORD, link: 'https://mclxxmii.xyz' },
];

export const Footer = () => (
  <div className="h-[140px] w-full flex flex-col justify-center items-center my-[38px]">
    <img src={DIVIDER} alt="divider" />
    <div className="mt-[36px] flex">
      {socials.map(social =>
        social.link ? (
          <a className="mr-[16px]" href={social.link} target="_blank" rel="noreferrer">
            <img src={social.icon} alt="icon" />
          </a>
        ) : (
          <img className="mr-[16px]" src={social.icon} alt="icon" />
        ),
      )}
    </div>
  </div>
);
