import { useEffect, useRef, useState } from 'react';

export default function useIsElementVisible(options: IntersectionObserverInit) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    function interserctionObserverCallback(entries: IntersectionObserverEntry[]) {
      const [entry] = entries;
      setIsVisible(entry.isIntersecting);
      if (isRendered || entry.isIntersecting) {
        setIsRendered(true);
      }
    }
    const observer = new IntersectionObserver(interserctionObserverCallback, options);
    const ref = elementRef.current;
    if (ref) observer.observe(ref);

    return () => {
      if (ref) observer.unobserve(ref);
    };
  }, [elementRef, options, isRendered]);

  return [elementRef, isRendered, isVisible] as [typeof elementRef, boolean, boolean];
}
