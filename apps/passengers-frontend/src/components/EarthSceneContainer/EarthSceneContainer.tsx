import { BREAKPOINTS } from 'constants/common';

import PinnedContainer from '@twl/common/components/PinnedContainer';
import useWebGl from '@twl/common/hooks/useWebGl';
import useWindowInnerDimensions from '@twl/common/hooks/useWindowInnerDimensions';
import { AppEventsType } from '@twl/common/types/types';
import { calculateNormalizedScroll } from '@twl/common/utils/math';
import dottedSquare from 'assets/images/dotted_square.png';
import GSAP from 'gsap';
import React, { useCallback, useEffect, useRef } from 'react';
import EarthScene from 'rendering-engine/classes/earth-scene';

type EarthSceneContainerProps = {
  scrollStart: number;
};

const SCALE_DURATION = 100;
const ZOOM_DURATION = 100;
const MORPH_DURATION = 100;
const SCROLL_EARTH_DURATION = 100;

const SCALE_START = 100;
const ZOOM_START = SCALE_START + SCALE_DURATION;
const MORPH_START = ZOOM_START + ZOOM_DURATION;
const SCROLL_EARTH_START = MORPH_START + MORPH_DURATION;

const INNER_PADDING = 25;
const MIN_HEIGHT = 25;

// Calculate from scroll earth start + duration since some of the animations might overlap in the feature.
const TOTAL_DURATION = SCROLL_EARTH_START + SCROLL_EARTH_DURATION;

const PADDING_TEXTS = ['SHAPING WEB', 'THROUGH', 'STORYTELLING,', 'EXPERIENCES', 'AND COMMUNITY'];

export default function EarthSceneContainer(props: EarthSceneContainerProps) {
  const { scrollStart } = props;
  const [earthSceneContainer, webGlScene] = useWebGl(
    EarthScene,
    { start: scrollStart + ZOOM_START, duration: ZOOM_DURATION },
    { start: scrollStart + MORPH_START, duration: MORPH_DURATION },
  );
  const containerWrapperRef = useRef<HTMLDivElement | undefined>();
  const { innerWidth: windowWidth } = useWindowInnerDimensions();

  useEffect(() => {
    if (!webGlScene) return;
    webGlScene.resize();
  }, [webGlScene]);

  const updateContainerSize = useCallback(() => {
    if (!containerWrapperRef.current) return;

    const minWidth = Math.min(window.innerWidth * 0.8, 1200);
    const minHeight = MIN_HEIGHT;
    const maxWidth = window.innerWidth * 2 + INNER_PADDING * 2 + 4;
    const maxHeight = window.innerHeight + INNER_PADDING * 2 + 4;

    const normalizedScroll = calculateNormalizedScroll(scrollStart + SCALE_START, SCALE_DURATION);
    const width = minWidth + (maxWidth - minWidth) * normalizedScroll;
    const height = minHeight + (maxHeight - minHeight) * normalizedScroll;

    GSAP.to(containerWrapperRef.current, {
      duration: 0.5,
      height,
      width,
    });
  }, [scrollStart]);

  useEffect(() => {
    window.eventDispatcher.addEventListener(AppEventsType.onVirtualScroll, updateContainerSize);
    return () => window.eventDispatcher.removeEventListener(AppEventsType.onVirtualScroll, updateContainerSize);
  }, [scrollStart, updateContainerSize]);

  useEffect(() => {
    window.addEventListener('resize', updateContainerSize);

    return window.removeEventListener('resize', updateContainerSize);
  }, [updateContainerSize]);

  function onContainerRef(element: HTMLDivElement) {
    containerWrapperRef.current = element;
    updateContainerSize();
  }

  function paddingDivText() {
    const mappedPaddingText = PADDING_TEXTS.map(text => {
      if (windowWidth < BREAKPOINTS.md) {
        return <h3 key={text}>{text}</h3>;
      }
      if (windowWidth < BREAKPOINTS.xl) {
        return <h2 key={text}>{text}</h2>;
      }
      return <h1 key={text}>{text}</h1>;
    });
    return (
      <div className="flex items-end">
        <div className="flex flex-col mx-8 md:mx-20">
          <img src={dottedSquare} alt="Dotted Square" className="w-16 h-16 md:w-32 md:h-32 mb-10" />
          {mappedPaddingText}
        </div>
      </div>
    );
  }

  return (
    <PinnedContainer pinDuration={TOTAL_DURATION} paddingDivChildren={paddingDivText()}>
      <div className="flex flex-1 justify-center items-center h-screen overflow-hidden">
        <div
          ref={onContainerRef}
          className="w-screen h-screen box-content border-white border-2"
          style={{ padding: INNER_PADDING }}>
          <div className="overflow-hidden h-full w-full">
            <div ref={earthSceneContainer} className="h-screen w-screen" />
          </div>
        </div>
      </div>
    </PinnedContainer>
  );
}
