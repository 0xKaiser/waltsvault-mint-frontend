import useWindowInnerDimensions from '@twl/common/hooks/useWindowInnerDimensions';
import { TEAM_CARD_ACTIVE_SCALE, TEAM_CARD_SIZE } from 'components/TeamSection/TeamSection.constants';
import { useCallback, useMemo } from 'react';

export default function useTeamDimensions() {
  const { innerWidth } = useWindowInnerDimensions();

  const dimensions = useMemo(() => {
    const maxWidth = innerWidth * 0.3;
    const cardWidth = Math.min(TEAM_CARD_SIZE.w, maxWidth);
    const cardHeight = TEAM_CARD_SIZE.h * (cardWidth / TEAM_CARD_SIZE.w);
    const cardMargin = Math.min(60, cardWidth * 0.25);
    const scaledWidth = cardWidth * TEAM_CARD_ACTIVE_SCALE;
    const scaledHeight = cardHeight * TEAM_CARD_ACTIVE_SCALE;

    return {
      cardWidth,
      cardHeight,
      maxWidth,
      cardMargin,
      slotWidth: 2 * cardMargin + cardWidth,
      scaledWidth,
      scaledHeight,
    };
  }, [innerWidth]);
  const getCardYTransform = useCallback((scale: number) => (dimensions.cardHeight * (scale - 1)) / 2, [dimensions]);

  return [dimensions, getCardYTransform] as [typeof dimensions, typeof getCardYTransform];
}
