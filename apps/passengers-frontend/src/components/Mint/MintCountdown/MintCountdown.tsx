import { DEBUG_KEY, PHASE_1_START } from 'constants/common';

import useCountdown from 'hooks/useCountdown';
import useQuery from 'hooks/useQuery';
import React, { useMemo } from 'react';

interface MintCountdownProps {
  children: React.ReactNode;
}

function toStr(number: number = 0) {
  if (number >= 10) return String(number);
  return `0${number}`;
}

export default function MintCountdown({ children }: MintCountdownProps) {
  const { duration, isCompleted } = useCountdown(PHASE_1_START);

  const query = useQuery();
  const isDebug = query.get('debug-key') === DEBUG_KEY;
  const countdownActive = !isCompleted && !isDebug;

  const formattedTime = useMemo(() => {
    const { hours, minutes, seconds } = duration;

    return `${toStr(hours)}:${toStr(minutes)}:${toStr(seconds)}`;
  }, [duration]);

  return (
    <div className="passengers h-screen w-screen bg-black flex flex-col justify-center items-center text-white">
      <div className="description">PHASE I STARTS IN:</div>
      {countdownActive ? <p className="numbers">{formattedTime}</p> : children}
    </div>
  );
}
