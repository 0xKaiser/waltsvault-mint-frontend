import NoTextScale from 'components/NoTextScale';
import React, { ButtonHTMLAttributes } from 'react';
import Sound from 'utils/sound';

interface FlightListButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  secondary?: boolean;
  children?: string;
}

function FlightListButton(props: FlightListButtonProps) {
  const { secondary, children, onClick, disabled, ...rest } = props;

  const height = secondary ? 48 : 92;

  function onLocalClick(e: React.MouseEvent<HTMLButtonElement>) {
    if (!onClick) return;

    Sound.playFlightSfxButton();
    onClick(e);
  }

  const cursor = disabled ? 'not-allowed' : undefined;

  return (
    <button
      {...rest}
      disabled={disabled}
      onClick={onLocalClick}
      className="flex min-w-[370px] relative justify-center items-center px-10 disabled:opacity-30"
      style={{ height, cursor }}
      type="button">
      <div className="cover bg-primary-blue opacity-20" />
      <div className="left-0 absolute h-full">
        <ButtonDecoration />
      </div>
      <div className="right-0 absolute h-full rotate-180">
        <ButtonDecoration />
      </div>
      <div className="caption text-primary-blue scale-75 md:scale-100">
        <NoTextScale>{children}</NoTextScale>
      </div>
    </button>
  );
}

function ButtonDecoration() {
  return (
    <div className="absolute h-full w-[9px] bg-primary-blue">
      <div className="absolute top-[-6px] h-[9px] w-[28px] bg-primary-blue" />
      <div className="absolute bottom-[-6px] h-[9px] w-[28px] bg-primary-blue" />
      <div className="absolute left-[-10px] h-[calc(100%+12px)] top-[-6px] flex items-center">
        <div className="absolute right-0 h-[3px] w-[24px] bg-primary-blue" />
        <div className="h-full w-[3px] bg-primary-blue" />
      </div>
    </div>
  );
}

export default FlightListButton;
