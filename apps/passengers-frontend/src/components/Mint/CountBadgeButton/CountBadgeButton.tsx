import { COLORS } from 'constants/common';

import { ReactComponent as IcRectangle } from 'assets/icons/ic-clipped-rectangle.svg';
import NoTextScale from 'components/NoTextScale';
import React from 'react';

interface CountBadgeButtonProps extends Omit<React.HtmlHTMLAttributes<HTMLButtonElement>, 'type'> {
  children: number;
  selected?: boolean;
}
export default function CountBadgeButton(props: CountBadgeButtonProps) {
  const { children, selected, ...rest } = props;
  return (
    <button {...rest} className={`relative h-[64px] w-[64px] flex justify-center items-center `} type="button">
      <div className="cover fill-red-500">
        <IcRectangle fill={selected ? COLORS['primary-blue'] : 'transparent'} />
      </div>
      <NoTextScale>
        <p className={`relative ${selected ? 'text-black' : 'text-primary-blue'}`}>{children}X</p>
      </NoTextScale>
    </button>
  );
}
