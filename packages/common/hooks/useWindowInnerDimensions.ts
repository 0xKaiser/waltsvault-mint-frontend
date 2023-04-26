import { useEffect, useState } from 'react';

export default function useWindowInnerDimensions() {
  const { innerHeight, innerWidth } = window;
  const [dimensions, setDimensions] = useState({ innerHeight, innerWidth });

  useEffect(() => {
    function onResize() {
      setDimensions({ innerHeight: window.innerHeight, innerWidth: window.innerWidth });
    }
    window.addEventListener('resize', onResize);

    return () => window.removeEventListener('resize', onResize);
  }, []);

  return dimensions;
}
