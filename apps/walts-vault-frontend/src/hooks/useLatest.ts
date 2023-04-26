import { useEffect, useRef } from 'react';

export default function useLatest<T>(value: T) {
  const latestRef = useRef<T>(value);

  useEffect(() => {
    latestRef.current = value;
  }, [value]);

  return latestRef;
}
