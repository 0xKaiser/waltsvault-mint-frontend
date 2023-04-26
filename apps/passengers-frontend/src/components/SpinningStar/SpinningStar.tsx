import STAR from 'assets/icons/star.svg';
import React from 'react';

export default function SpinningStar() {
  return <img src={STAR} alt="spinning star" className="sm:w-20 w-16 animate-[spin_5s_linear_infinite]" />;
}
