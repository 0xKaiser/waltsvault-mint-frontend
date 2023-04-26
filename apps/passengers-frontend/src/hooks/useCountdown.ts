import { intervalToDuration, isAfter } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';

export default function useCountdown(endDate: Date | string) {
  const countdownDate = useMemo(() => (typeof endDate === 'string' ? new Date(endDate) : endDate), [endDate]);
  const [duration, setDuration] = useState(
    intervalToDuration({
      start: new Date(),
      end: countdownDate,
    }),
  );

  const isCompleted = isAfter(new Date(), countdownDate);

  useEffect(() => {
    if (isCompleted) return undefined;
    const interval = setInterval(() => {
      setDuration(
        intervalToDuration({
          start: new Date(),
          end: countdownDate,
        }),
      );
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [countdownDate, isCompleted]);

  return { duration, isCompleted };
}
