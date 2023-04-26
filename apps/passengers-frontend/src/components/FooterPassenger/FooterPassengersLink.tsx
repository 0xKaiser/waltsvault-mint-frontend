import { ReactComponent as Box } from 'assets/icons/box.svg';
import React, { useState } from 'react';
import Sound from 'utils/sound';

interface FooterPassengersLinkProps {
  text: string;
  to: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
}
export default function FooterPassengersLink({ text, to, Icon }: FooterPassengersLinkProps) {
  const [isHovered, setIsHovered] = useState(false);
  function onHoverHandler() {
    setIsHovered(true);
  }
  function onLeaveHandler() {
    setIsHovered(false);
  }
  function onClick() {
    Sound.playSfxClick();
    window.open(to);
  }
  return (
    <div
      className="flex flex-1 relative text-white hover:text-black  md:max-w-[30vw]"
      onMouseEnter={onHoverHandler}
      onMouseLeave={onLeaveHandler}
      onFocus={onHoverHandler}>
      <button type="button" onClick={onClick} key={text} className="absolute flex w-full h-full items-center">
        <div className="flex flex-row w-full justify-center gap-6">
          <Icon className={isHovered ? 'fill-black' : ''} />
          <div className="self-center">{text}</div>
        </div>
      </button>
      <Box className={`flex flex-1 max-h-[150px] md:max-h-[unset] ${isHovered ? 'fill-primary-blue' : ''}`} />
    </div>
  );
}
