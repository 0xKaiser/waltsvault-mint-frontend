import BracketsHighlight from 'components/BracketsHighlight';
import NoTextScale from 'components/NoTextScale';
import React, { ButtonHTMLAttributes } from 'react';
import Sound from 'utils/sound';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  small?: boolean;
}

export default function Button({ small = true, children, onClick, ...props }: ButtonProps) {
  function onLocalClick(e: React.MouseEvent<HTMLButtonElement>) {
    Sound.playSfxClick();
    if (onClick) onClick(e);
  }

  const width = small ? 44 : undefined;
  const paddingX = small ? 8 : 24;

  return (
    <button
      {...props}
      type="button"
      onClick={onLocalClick}
      style={{ width, paddingRight: paddingX, paddingLeft: paddingX }}
      className="h-[44px] flex justify-center items-center relative p-[8px]">
      <div className="h-full w-full  flex justify-center items-center">
        {typeof children === 'string' ? (
          <NoTextScale>
            <p className="description">{children}</p>
          </NoTextScale>
        ) : (
          children
        )}
      </div>
      <BracketsHighlight size={10} />
    </button>
  );
}
