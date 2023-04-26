import { useEffect, useRef, useState } from 'react';

export default function useElementSize<T extends HTMLElement>() {
  const [size, setSize] = useState([0, 0]);
  const ref = useRef<T>(null);

  useEffect(() => {
    function onResize() {
      if (!ref.current) return;

      const { clientHeight, clientWidth } = ref.current;

      setSize(state => {
        if (state[0] === clientWidth && state[1] === clientHeight) return state;
        return [clientWidth, clientHeight];
      });
    }

    onResize();

    if (ref.current) ref.current.onload = onResize;
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return [ref, size] as [typeof ref, typeof size];
}
