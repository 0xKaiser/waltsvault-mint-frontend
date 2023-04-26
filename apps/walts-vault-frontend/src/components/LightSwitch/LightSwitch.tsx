import { ReactComponent as ArrowDown } from 'assets/icons/ic-arrow-down.svg';
import IMG_SWITCH_OFF from 'assets/images/img-switch-off.png';
import IMG_SWITCH_ON from 'assets/images/img-switch-on.png';
import gsap from 'gsap';
import React, { useEffect, useRef } from 'react';
import Sound, { sfxLightsSwitch } from 'utils/sounds';

interface LightSwitchProps {
  on: boolean;
  toggle: () => void;
}
export default function LightSwitch({ on, toggle }: LightSwitchProps) {
  const tipTextRef = useRef(null);
  const tipOn = useRef(true);

  useEffect(() => {
    if (on && tipOn.current && tipTextRef.current) {
      gsap.to(tipTextRef.current, { opacity: 0, duration: 0.3 });
      tipOn.current = true;
    }
  }, [on]);

  function onClick() {
    if (!toggle) return;
    Sound.play(sfxLightsSwitch);
    toggle();
  }

  return (
    <div className="flex items-center flex-col">
      <div className="flex items-center flex-col pointer-events-none" ref={tipTextRef}>
        <p className="button text-white pb-4">Turn on the lights</p>
        <div className="animate-bounce">
          <ArrowDown />
        </div>
      </div>
      <div className="relative ">
        <button onClick={onClick} type="button">
          {on ? <img src={IMG_SWITCH_ON} alt="switch on" /> : <img src={IMG_SWITCH_OFF} alt="switch of" />}
        </button>
        {!on && <div className="cover bg-[rgba(0,0,0,0.35)] lg:bg-[rgba(0,0,0,0.1)] pointer-events-none" />}
      </div>
    </div>
  );
}
