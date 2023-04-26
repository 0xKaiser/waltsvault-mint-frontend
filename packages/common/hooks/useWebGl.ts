import { useEffect, useRef, useState } from 'react';
import WebGlCanvas from 'rendering-engine/webgl-canvas';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function useWebGl<T extends WebGlCanvas>(WebGl: Object, ...args: unknown[]) {
  const canvas = useRef<HTMLDivElement>(null);
  const [webGlCanvas, setWebGlCanvas] = useState<WebGlCanvas | null>(null);
  useEffect(() => {
    if (!canvas.current) throw new Error('Element is not defined!');

    // @ts-ignore
    // eslint-disable-next-line no-new
    const currentCanvas = new WebGl(canvas.current, ...args);
    setWebGlCanvas(currentCanvas);

    return () => {
      // @ts-ignore
      if (currentCanvas) currentCanvas.dispose();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // @ts-ignore
  return [canvas, webGlCanvas] as [typeof canvas, T];
}
