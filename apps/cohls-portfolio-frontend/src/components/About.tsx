import React from 'react';
import ABOUT from '../assets/videos/about.mp4';

export const About = () => (
  <div className="w-full max-w-[448px] flex flex-col px-[24px]">
    <video autoPlay muted loop playsInline src={ABOUT} />
    <br />
    <span className="text-center text-p1">
      <p>
        Born with a brush in my hand, I’ve always been drawn to any canvas that will have me. Being a human of the 21st
        century, the internet became my playground for exploring how the iconic art that shaped our culture can evolve
        for a digital age.
      </p>
      <br />
      <p>
        My interest in the wonders of animation came about by reading tales from one of my late family members, he was a
        true pioneer. My uncle worked at Disney and inspired me to follow in his path. Having a hearing disability,
        storytelling and animation naturally spoke to me. Ever since, I’ve been exploring how I can apply such a
        timeless style to a new type of medium. One that would satisfy the innovative spirit inside me.
      </p>
      <br />
      <p>Then, when I discovered NFTs, I knew I found a way the magic could live forever.</p>
    </span>
    <span className="mt-[32px] text-p1 text-center">FOR INQUIRIES</span>
    <a className="mt-[8px] text-cta text-center cursor-pointer" href="mailto:cohlworld@proton.me">
      cohlworld@proton.me
    </a>
  </div>
);
