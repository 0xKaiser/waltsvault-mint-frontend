import { ReactComponent as ImgMintButton } from 'assets/images/img-mint-button.svg';
import NoTextScale from 'components/NoTextScale';
import React from 'react';

interface DecoratedMintButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  totalSupply: number;
  numberOfMinted: number;
}
export default function DecoratedMintButton(props: DecoratedMintButtonProps) {
  const { totalSupply, numberOfMinted, children, ...rest } = props;
  return (
    <div className="flex flex-col items-center gap-4">
      <button {...rest} className="relative" type="button">
        <ImgMintButton />
        <div className="cover flex justify-center items-center">
          <div className="caption pt-[6px]">
            <NoTextScale>{children}</NoTextScale>
          </div>
        </div>
      </button>
      <div className="description text-primary-blue">
        <NoTextScale>
          {numberOfMinted}/{totalSupply}
        </NoTextScale>
      </div>
    </div>
  );
}
