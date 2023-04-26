import { useMemo } from 'react';

import useWindowInnerDimensions from './useWindowInnerDimensions';

import { BREAKPOINTS } from '../global-constants';

export default function useBreakpoints() {
  const { innerWidth } = useWindowInnerDimensions();
  const activeBreakpoint = useMemo(() => {
    if (innerWidth <= BREAKPOINTS.sm) return BREAKPOINTS.sm;
    if (innerWidth <= BREAKPOINTS.md) return BREAKPOINTS.md;
    if (innerWidth <= BREAKPOINTS.lg) return BREAKPOINTS.lg;
    if (innerWidth <= BREAKPOINTS.xl) return BREAKPOINTS.xl;
    return BREAKPOINTS.xxl;
  }, [innerWidth]);
  const isMobile = activeBreakpoint < BREAKPOINTS.md;
  const isTablet = activeBreakpoint < BREAKPOINTS.xl && !isMobile;
  const isDesktop = !isMobile && !isTablet;

  return { isMobile, isTablet, isDesktop, activeBreakpoint };
}
