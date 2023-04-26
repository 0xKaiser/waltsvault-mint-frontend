import useBreakpoints from '@twl/common/hooks/useBreakpoints';
import gsap from 'gsap';
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { MathUtils } from 'three';
import { lerp } from 'three/src/math/MathUtils';

const NAVIGATION_HEIGHT = 250;
const NAVIGATION_POINT_SIZE = 21;
const INDICATOR_POINT_SIZE = 11;
const NAVIGATION_POINT_SCALE = 1.63;
const POINT_SCALE = 1.72;
const TITLE_VISIBLE_THRESHOLD = 0.2;
const TRANSITION_DURATION = 0.2;

interface SideNavigationProps {
  content: { progress: number; title: string }[];
  progressScale: number;
  navigateToSection: (progress: number) => void;
  initialProgress?: number;
}

export interface SideNavigationHandle {
  onScroll: (progress: number) => void;
}

export default forwardRef<SideNavigationHandle, SideNavigationProps>((props: SideNavigationProps, ref) => {
  const { content, progressScale, navigateToSection, initialProgress } = props;
  const [progress, setProgress] = useState(initialProgress ?? 0);

  useImperativeHandle(ref, () => ({
    onScroll: p => setProgress(p * progressScale),
  }));

  const scaledContent = useMemo(
    () => content.map(c => ({ ...c, progress: c.progress * progressScale })),
    [content, progressScale],
  );

  return (
    <div className="relative w-[1px] bg-white flex justify-center" style={{ height: NAVIGATION_HEIGHT }}>
      {scaledContent.map(({ progress: pointLocation, title }) => (
        <SectionNavigationPoint
          navigateToSection={navigateToSection}
          key={title}
          title={title}
          pointLocation={pointLocation}
          progress={progress}
        />
      ))}
      <ProgressIndicator content={scaledContent} progress={progress} />
    </div>
  );
});

interface SectionNavigationPointInterface {
  pointLocation: number;
  progress: number;
  title: string;
  navigateToSection: (progress: number) => void;
}
function SectionNavigationPoint(props: SectionNavigationPointInterface) {
  const { progress, pointLocation, title, navigateToSection } = props;
  const [hoverScaleFactor, setHoverScaleFactor] = useState(0);
  const animationRef = useRef(0);
  const scaleFactor = Math.max(hoverScaleFactor, getScaleFactor(pointLocation, progress));
  const scale = lerp(1, NAVIGATION_POINT_SCALE, scaleFactor);
  const top = MathUtils.lerp(-NAVIGATION_POINT_SIZE, NAVIGATION_HEIGHT, pointLocation);

  const titleVisibleRef = useRef(false);
  const titleAnimationRef = useRef(0);
  const [titleOpacity, setTitleOpacity] = useState(0);

  const { isMobile } = useBreakpoints();

  useEffect(() => {
    function animateTitle(to: number) {
      gsap.to(titleAnimationRef, {
        current: to,
        duration: TRANSITION_DURATION,
        onUpdate: () => setTitleOpacity(titleAnimationRef.current),
      });
    }
    if (scaleFactor >= TITLE_VISIBLE_THRESHOLD && !titleVisibleRef.current) {
      animateTitle(1);
      titleVisibleRef.current = true;
    }
    if (scaleFactor < TITLE_VISIBLE_THRESHOLD && titleVisibleRef.current) {
      animateTitle(0);
      titleVisibleRef.current = false;
    }
  }, [scaleFactor]);

  function animate(to: number) {
    gsap.to(animationRef, {
      current: to,
      duration: TRANSITION_DURATION,
      onUpdate: () => setHoverScaleFactor(animationRef.current),
    });
  }

  function onMouseEnter() {
    animate(1);
  }

  function onMouseLeave() {
    animate(0);
  }

  function onClick() {
    navigateToSection(pointLocation);
  }

  const finalTitleOpacity = isMobile ? 1 : Math.max(titleOpacity, hoverScaleFactor);

  return (
    <div
      className="absolute flex justify-center items-center group"
      style={{ top, height: NAVIGATION_POINT_SIZE, width: NAVIGATION_POINT_SIZE }}>
      <button
        onClick={onClick}
        aria-label={title}
        type="button"
        className="border absolute bg-black border-white rounded-full h-full w-full whitespace-nowrap"
        style={{ transform: `scale(${scale})` }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
      <div
        className="translate-x-[40px] md:translate-x-[-40px] md:pointer-events-none"
        onClick={onClick}
        onKeyPress={onClick}
        role="button"
        tabIndex={0}>
        <div style={{ opacity: finalTitleOpacity }} className="scale-[1.666] md:scale-[1.25] lg:scale-[1]">
          <div>
            <p className="relative translate-x-[50%] md:translate-x-[-50%] text-right whitespace-nowrap">{title}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ProgressIndicatorProps {
  progress: number;
  content: { progress: number; title: string }[];
}
function ProgressIndicator({ progress, content }: ProgressIndicatorProps) {
  const nearestContent = content.reduce((selected, cur) =>
    Math.abs(selected.progress - progress) < Math.abs(cur.progress - progress) ? selected : cur,
  );
  const scaleFactor = getScaleFactor(nearestContent.progress, progress);
  const scale = lerp(1, POINT_SCALE, scaleFactor);
  const translateTop = MathUtils.lerp(
    -(NAVIGATION_POINT_SIZE + INDICATOR_POINT_SIZE) / 2,
    NAVIGATION_HEIGHT + (NAVIGATION_POINT_SIZE - INDICATOR_POINT_SIZE) / 2,
    progress,
  );

  return (
    <div className="pointer-events-none absolute top-0 " style={{ transform: `translateY(${translateTop}px)` }}>
      <div
        className="bg-primary-blue rounded-full"
        style={{ height: INDICATOR_POINT_SIZE, width: INDICATOR_POINT_SIZE, transform: `scale(${scale})` }}
      />
    </div>
  );
}

function getScaleFactor(position: number, progress: number) {
  const center = NAVIGATION_HEIGHT * position;
  const indicatorPosition = progress * NAVIGATION_HEIGHT;
  const scaleUp = MathUtils.clamp(
    MathUtils.inverseLerp(center - NAVIGATION_POINT_SIZE, center, indicatorPosition),
    0,
    1,
  );
  const scaleDown = MathUtils.clamp(
    MathUtils.inverseLerp(center, center + NAVIGATION_POINT_SIZE, indicatorPosition),
    0,
    1,
  );
  return (scaleUp - scaleDown) ** 3;
}
