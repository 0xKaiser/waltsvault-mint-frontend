import { SOCIAL_MEDIA_LINKS } from 'constants/index';

import React from 'react';

export default function SocialIcons() {
  return (
    <div className="relative flex flex-1 flex-row justify-start items-center h-16">
      <div className="relative flex flex-row gap-10 px-7 items-center">
        {SOCIAL_MEDIA_LINKS.map(({ text, to, Icon }) => (
          <a href={to} target="_blank" key={text} rel="noreferrer">
            <Icon className="h-[30px]" />
          </a>
        ))}
      </div>
    </div>
  );
}
