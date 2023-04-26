import React, { useEffect, useRef } from 'react';

export default function useSkipFirstEffect(effect: React.EffectCallback, dependencyList: React.DependencyList) {
  const isFirstRef = useRef(true);

  useEffect(() => {
    if (isFirstRef.current) {
      isFirstRef.current = false;
      return;
    }
    effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencyList);
}
