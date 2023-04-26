import { FOOTER_LEGAL_COPYRIGHT, SOCIAL_MEDIA } from 'constants/common';

import useBreakpoints from '@twl/common/hooks/useBreakpoints';
import React from 'react';

import FooterPassengersLink from './FooterPassengersLink';

function FooterPassenger() {
  const { isMobile } = useBreakpoints();

  return (
    <div className="flex flex-col h-screen w-screen justify-center items-center passengers">
      <h1>CONNECT</h1>
      <div className={`flex flex-col max-w-full w-full md:flex-row justify-between items-center pt-16 px-6 + ${isMobile ? 'pb-12' : 'pb-24'}`}>
        {Object.entries(SOCIAL_MEDIA.passenger).map(([text, link]) => (
          <div key={link.alt} className="mb-8 md:mb-0">
            <FooterPassengersLink to={link.link} Icon={link.icon} text={text} />
          </div>
        ))}
      </div>
      <p className="mb-4 text-white">
        <a className='underline' href='/privacy-policy'>privacy policy</a> 
        &thinsp;
        and
        &thinsp;
        <a className='underline' href='/terms-and-conditions'>terms and conditions</a>
        &thinsp;
        apply.
      </p>
      <p className="text-white">{FOOTER_LEGAL_COPYRIGHT.passenger}</p>
    </div>
  );
}

export default FooterPassenger;
