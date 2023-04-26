import { TOTAL_TOKENS_SUPPLY } from 'constants/common';

import NoTextScale from 'components/NoTextScale';
import React, { useMemo, useState } from 'react';
import { AvailableMints, ListType } from 'types/interface';

import CountBadgeButton from '../CountBadgeButton';
import DecoratedMintButton from '../DecoratedMintButton';

export interface MintSelectionProps {
  mint: (count: number) => void;
  tokensMinted: number | null;
  availableMints?: AvailableMints;
  listType?: ListType;
  isPublicPhase: boolean | null;
  flightSpots: number;
}
export default function MintSelection(props: MintSelectionProps) {
  const { mint, tokensMinted, availableMints, isPublicPhase, listType, flightSpots } = props;
  const [mintAmount, setMintAmount] = useState(1);

  const hasMultipleSpots = flightSpots > 1;

  const title = useMemo(() => {
    if (flightSpots > 1) return 'select how many passengers you want to min';
    if (isPublicPhase) return 'only one token remaining!';
    if (availableMints?.reserve === 1 && listType === ListType.Master)
      return 'master list has been depleted: you can only mint 1x passenger';
    if (availableMints?.reserve === 1 && listType === ListType.Reserve)
      return 'only one token remaining on the reserve list!';
    if (availableMints?.master === 1) return 'reserved list has been depleted: you can only mint 1x passenger';

    return 'unknown state';
  }, [availableMints, flightSpots, isPublicPhase, listType]);

  function onMint() {
    mint(mintAmount);
  }

  const getKey = (index: number) => `key_${index}`;
  const onClick = (index: number) => () => setMintAmount(index + 1);

  return (
    <div className="flex flex-col items-center gap-10 max-w-[50%]">
      <NoTextScale>
        <div className="text-center w-full caption-small uppercase text-primary-blue">{title}</div>
      </NoTextScale>
      {hasMultipleSpots && (
        <div className="flex gap-10">
          {Array.from({ length: flightSpots }).map((_, index) => (
            <CountBadgeButton onClick={onClick(index)} key={getKey(index)} selected={mintAmount === index + 1}>
              {index + 1}
            </CountBadgeButton>
          ))}
        </div>
      )}
      <DecoratedMintButton onClick={onMint} totalSupply={TOTAL_TOKENS_SUPPLY} numberOfMinted={tokensMinted || 0}>
        START MINT
      </DecoratedMintButton>
    </div>
  );
}
