import { useContext, useEffect } from 'react';
import { Event } from 'three';

import useLatest from './useLatest';

import { ImagesCanvasContext } from '../components/ImagesCanvas';

export default function useOnRender(callback: (time: number) => void) {
  const { imagesCanvas } = useContext(ImagesCanvasContext);
  const callbackRef = useLatest(callback);
  useEffect(() => {
    if (!imagesCanvas) return undefined;

    function handlerEvent(event: Event) {
      callbackRef.current(event.time);
    }
    imagesCanvas.eventDispatcher.addEventListener('onRender', handlerEvent);

    return () => imagesCanvas.eventDispatcher.removeEventListener('onRender', handlerEvent);
  }, [imagesCanvas, callback, callbackRef]);
}
