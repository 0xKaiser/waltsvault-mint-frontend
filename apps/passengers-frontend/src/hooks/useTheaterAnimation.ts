import { onChange, val } from '@theatre/core';
import { useContext, useEffect, useMemo } from 'react';

import { AnimationContext } from './useTheaterContext';

export default function useTheaterAnimation(sheetName: string, options?: { onComplete?: () => void }) {
  const { project } = useContext(AnimationContext);

  const sheet = useMemo(() => project?.sheet(sheetName), [project, sheetName]);

  const play = () => {
    sheet?.sequence.play();
  };
  const pause = () => {
    sheet?.sequence.pause();
  };

  useEffect(() => {
    if (!options || !sheet || !options.onComplete) return undefined;

    const unsubscribe = onChange(sheet.sequence.pointer.playing, playing => {
      if (!playing && sheet.sequence.position >= val(sheet.sequence.pointer.length)) options.onComplete!();
    });

    return unsubscribe;
  }, [options, sheet]);

  /**
   * @param time The current time in seconds
   */
  const setCurrentTime = (time: number) => {
    if (sheet) sheet.sequence.position = time;
  };

  return { play, pause, setCurrentTime };
}
