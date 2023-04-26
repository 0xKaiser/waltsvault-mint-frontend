import BracketsHighlight from 'components/BracketsHighlight';
import NoTextScale from 'components/NoTextScale';
import useCountdown from 'hooks/useCountdown';
import React, { useMemo } from 'react';

interface CountdownProps {
  date: string | Date;
}

export default function Countdown({ date }: CountdownProps) {
  const { duration, isCompleted } = useCountdown(date);

  const formattedDuration = useMemo(() => {
    const { hours, minutes, seconds } = duration;
    function toStr(number: number = 0) {
      if (number >= 10) return String(number);
      return `0${number}`;
    }
    return `${toStr(hours)}:${toStr(minutes)}:${toStr(seconds)}`;
  }, [duration]);

  if (isCompleted) return null;

  return (
    <div className="relative flex justify-center items-center w-[120px] h-[45px]">
      <div>
        <NoTextScale>
          <div className="description-medium text-white">{formattedDuration}</div>
        </NoTextScale>
      </div>
      <BracketsHighlight size={10} />
    </div>
  );
}
