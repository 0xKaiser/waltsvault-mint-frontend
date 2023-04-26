import React, { createContext, useMemo } from 'react';

import useWebGl from '../../hooks/useWebGl';
import ImagesCanvasClass from '../../rendering-engine/images-canvas';

interface ImagesCanvasProps {
  children: React.ReactNode;
}

interface State {
  imagesCanvas?: ImagesCanvasClass;
}

export const ImagesCanvasContext = createContext<State>({});

export default function ImagesCanvas(props: ImagesCanvasProps) {
  const { children } = props;
  const [containerRef, imagesCanvas] = useWebGl(ImagesCanvasClass);

  const state = useMemo(
    () => ({
      imagesCanvas: (imagesCanvas as ImagesCanvasClass) || undefined,
    }),
    [imagesCanvas],
  );

  return (
    <ImagesCanvasContext.Provider value={state}>
      <div className="fixed top-0 left-0 w-screen h-screen pointer-events-none" ref={containerRef} />
      {children}
    </ImagesCanvasContext.Provider>
  );
}
