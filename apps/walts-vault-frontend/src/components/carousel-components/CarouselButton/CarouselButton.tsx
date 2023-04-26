import useBreakpoints from '@twl/common/hooks/useBreakpoints';
import { ReactComponent as IC_ARROW_LEFT } from 'assets/icons/ic-arrow-left.svg';
import { ReactComponent as IC_ARROW_RIGHT } from 'assets/icons/ic-arrow-right.svg';
import React from 'react';

interface CarouselButtonProps {
  disabled?: boolean;
  direction: 'left' | 'right';
  onClick?: () => void;
  arrowsOffset?: number;
  arrowSize?: number;
}
export default function CarouselButton(props: CarouselButtonProps) {
  const { disabled, direction, onClick, arrowsOffset, arrowSize } = props;

  const { isDesktop } = useBreakpoints();
  const defaultArrowsOffset = isDesktop ? 8 : 60;
  const offset = arrowsOffset === undefined ? defaultArrowsOffset : arrowsOffset;

  const directions = {
    left: direction === 'right' ? undefined : offset,
    right: direction === 'right' ? offset : undefined,
  };

  const directionalClasses = '';
  const Image = direction === 'right' ? IC_ARROW_RIGHT : IC_ARROW_LEFT;

  function onClickLocal() {
    if (onClick) onClick();
  }

  return (
    <button
      disabled={disabled}
      type="button"
      className={`relative transition-all  active:scale-75 disabled:opacity-50 flex-shrink-0 h-[90px] lg:h-[60px] ${directionalClasses} z-20`}
      style={{ ...directions, height: arrowSize }}
      onClick={onClickLocal}>
      <Image className="h-full" />
    </button>
  );
}
