import { AppState, TABLE_SIZE, TABLE_TARGET_SIZE } from 'constants/index';

import useBreakpoints from '@twl/common/hooks/useBreakpoints';
import useWindowInnerDimensions from '@twl/common/hooks/useWindowInnerDimensions';
import { clamp } from '@twl/common/utils/math';
import IMG_CIGS from 'assets/images/img-cigs.png';
import IMG_LIGHTBOX_FRAME from 'assets/images/img-lightbox-frame.png';
import IMG_LIGHTBOX_OFF from 'assets/images/img-lightbox-off.png';
import IMG_LIGHTBOX_ON from 'assets/images/img-lightbox-on.png';
import IMG_LIGHTBOX_SHADOW from 'assets/images/img-lightbox-shadow.png';
import IMG_NOTE_SKETCH from 'assets/images/img-note-sketch.png';
import IMG_PENCIL from 'assets/images/img-pencil.png';
import IMG_PENS from 'assets/images/img-pens.png';
import IMG_RULER_DOWN from 'assets/images/img-ruler-down.png';
import IMG_RULER_UP from 'assets/images/img-ruler-up.png';
import IMG_SKETCHBOOK from 'assets/images/img-sketchbook.png';
import IMG_TABLE_TEXTURE from 'assets/images/img-table-texture.png';
import LightSwitch from 'components/LightSwitch';
import SmokeScreen from 'components/SmokeScree/SmokeScreen';
import GSAP from 'gsap';
import React, { useEffect, useMemo, useRef, useState } from 'react';

const PAN_OFFSET_THRESHOLD = 0.5;
const PAN_MOVE_FACTOR = 9;
const SCALE_ANIMATION_DURATION = 2;
const PAN_SNAPBACK_EASE = 0.93;

interface TableProps {
  children?: React.ReactNode;
  appState: AppState;
  lightOn: boolean;
  toggleLight: () => void;
}
export default function Table(props: TableProps) {
  const { children, appState, lightOn, toggleLight } = props;

  const containerRef = useRef<HTMLDivElement>(null);

  const { innerHeight, innerWidth } = useWindowInnerDimensions();
  const { isMobile } = useBreakpoints();
  const [sceneOffset, setSceneOffset] = useState({ x: 0, y: 0 });
  const [sceneOffsetFactor, setSceneOffsetFactor] = useState(1);
  const { zoomOutScale, nftFocusScale, subPageScale } = useMemo(() => {
    if (!isMobile)
      return {
        zoomOutScale: innerHeight / TABLE_TARGET_SIZE.zoomOut.height,
        nftFocusScale: innerHeight / TABLE_TARGET_SIZE.nftZoom.height,
        subPageScale: innerHeight / TABLE_TARGET_SIZE.subPageZoom.height,
      };

    return {
      zoomOutScale: innerWidth / TABLE_TARGET_SIZE.mobile.width,
      nftFocusScale: innerWidth / TABLE_TARGET_SIZE.mobile.width,
      subPageScale: innerWidth / TABLE_TARGET_SIZE.mobileSubPageZoom.width,
    };
  }, [innerHeight, isMobile, innerWidth]);

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const scaleAnimationRef = useRef(0);
  const offsetAnimationRef = useRef(1);
  const mouseOutsideRef = useRef(false);

  const [maxSceneOffsetX, maxSceneOffsetY] = useMemo(() => {
    const currentWidth = innerWidth / zoomOutScale;
    const currentHeight = innerHeight / zoomOutScale;

    return [(TABLE_SIZE.width - currentWidth) / 2, (TABLE_SIZE.height - currentHeight) / 2];
  }, [zoomOutScale, innerWidth, innerHeight]);

  useEffect(() => {
    if (!containerRef.current || appState !== AppState.DEFAULT || isMobile) return undefined;

    const panDirection = { x: 0, y: 0 };
    function onMouseLeave() {
      mouseOutsideRef.current = true;
    }
    function onMouseEnter() {
      mouseOutsideRef.current = false;
    }
    function onMouseMove({ x, y }: MouseEvent) {
      panDirection.x = 0;
      panDirection.y = 0;

      const mouseCenterOffsetX = ((x - window.innerWidth / 2) / window.innerWidth) * 2;
      const mouseCenterOffsetY = ((y - window.innerHeight / 2) / window.innerHeight) * 2;
      // Make sure that pan offset threshold after the on-off switch.
      const panOffset = Math.max(PAN_OFFSET_THRESHOLD, (TABLE_SIZE.width / 2 - 814) / (window.innerWidth / 2));

      if (Math.abs(mouseCenterOffsetX) >= panOffset)
        panDirection.x =
          ((Math.abs(mouseCenterOffsetX) - panOffset) / (1 - panOffset)) * -Math.sign(mouseCenterOffsetX);
      if (Math.abs(mouseCenterOffsetY) >= panOffset)
        panDirection.y =
          ((Math.abs(mouseCenterOffsetY) - panOffset) / (1 - panOffset)) * -Math.sign(mouseCenterOffsetY);
    }
    containerRef.current.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    let exit = false;
    function handlePan() {
      if (exit) return;
      if (!mouseOutsideRef.current && (panDirection.x !== 0 || panDirection.y !== 0)) {
        setSceneOffset(({ x: offsetX }) => ({
          x: clamp(offsetX + PAN_MOVE_FACTOR * panDirection.x, -maxSceneOffsetX, maxSceneOffsetX),
          y: 0,
        }));
      }
      if (panDirection.x === 0 && panDirection.y === 0) {
        setSceneOffset(({ x: offsetX, y: offsetY }) => ({
          x: offsetX * PAN_SNAPBACK_EASE,
          y: offsetY * PAN_SNAPBACK_EASE,
        }));
      }
      window.requestAnimationFrame(handlePan);
    }
    window.requestAnimationFrame(handlePan);

    return () => {
      exit = true;
      // eslint-disable-next-line react-hooks/exhaustive-deps
      containerRef.current?.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [maxSceneOffsetX, maxSceneOffsetY, innerHeight, innerWidth, appState, isMobile]);

  const firstRender = useRef(true);
  useEffect(() => {
    const targetValues = {
      [AppState.DEFAULT]: zoomOutScale,
      [AppState.NFT_FOCUS]: nftFocusScale,
      [AppState.SUB_PAGE]: subPageScale,
    };
    const targetScale = targetValues[appState];
    function applyScale() {
      if (!tableContainerRef.current) return;
      tableContainerRef.current.style.transform = `scale(${scaleAnimationRef.current})`;
    }

    if (firstRender.current && tableContainerRef.current) {
      firstRender.current = false;
      scaleAnimationRef.current = targetScale;
      applyScale();
      return;
    }
    GSAP.to(scaleAnimationRef, {
      current: targetScale,
      duration: SCALE_ANIMATION_DURATION,
      onUpdate: () => {
        applyScale();
      },
    });
  }, [appState, zoomOutScale, nftFocusScale, subPageScale]);

  useEffect(() => {
    const targetValue = appState === AppState.DEFAULT ? 1 : 0;
    GSAP.to(offsetAnimationRef, {
      current: targetValue,
      duration: SCALE_ANIMATION_DURATION,
      onUpdate: () => {
        setSceneOffsetFactor(offsetAnimationRef.current);
      },
      onComplete: () => {
        if (targetValue === 0) setSceneOffset({ x: 0, y: 0 });
      },
    });
  }, [appState]);

  const transformTranslate = `translate(${sceneOffset.x * sceneOffsetFactor}px, ${
    sceneOffset.y * sceneOffsetFactor
  }px)`;

  return (
    <div className="bg-black h-screen w-screen" ref={containerRef}>
      <div className="fixed top-0 flex justify-center items-center h-screen w-screen translate-y-[-60px] md:translate-y-0">
        <div ref={tableContainerRef}>
          <div
            className="overflow-hidden relative"
            style={{
              minWidth: TABLE_SIZE.width,
              width: TABLE_SIZE.width,
              minHeight: TABLE_SIZE.height,
              transform: transformTranslate,
            }}>
            <img src={IMG_TABLE_TEXTURE} className="h-full w-full abs-center" alt="table" />
            <img
              src={IMG_NOTE_SKETCH}
              className="absolute top-0 left-[920px] lg:top-[520px] lg:left-[335px]"
              alt="coffee-cup"
            />
            <img
              src={IMG_PENS}
              className="absolute bottom-[-270px] left-[800px] lg:bottom-0 lg:left-[230px]"
              alt="pens"
            />
            <img
              src={IMG_SKETCHBOOK}
              className="absolute top-[1268px] right-[493px] lg:top-[564px] lg:right-[59px] w-[695px] h-[450px]"
              alt="sketchbook"
            />
            <img
              src={IMG_PENCIL}
              className="absolute bottom-[1270px] right-[540px] lg:bottom-[550px] lg:right-0"
              alt="pencil"
            />
            <img src={IMG_CIGS} className="absolute bottom-[50px] right-[307px]" alt="pencil" />
            <img className="h-[865px] w-[865px] abs-center" src={IMG_LIGHTBOX_FRAME} alt="lightbox frame" />
            <div className="abs-center">
              <div className="scale-[0.656]">
                {lightOn ? (
                  <img src={IMG_LIGHTBOX_ON} alt="lightbox on" />
                ) : (
                  <img src={IMG_LIGHTBOX_OFF} alt="lightbox off" />
                )}
              </div>
            </div>
            <div className="abs-center">
              <div className="w-[754px] h-[754px] relative">{children}</div>
            </div>
            <div className="abs-center pointer-events-none">
              <img className="scale-[1.003]" src={IMG_LIGHTBOX_SHADOW} alt="lightbox-shadow" />
            </div>
            <div className="abs-center h-[856px] w-[856px] pointer-events-none ">
              <img className="abs-center-x top-[81px] min-w-[1179px]" src={IMG_RULER_DOWN} alt="ruler" />
              <img className="abs-center-x bottom-[75px] min-w-[1179px]" src={IMG_RULER_UP} alt="ruler" />
            </div>
            <div
              className={`absolute top-0 left-0 flex-shrink-0 h-full w-full blackout-gradient pointer-events-none ${
                !lightOn ? 'off' : ''
              }`}
            />
            <div className="absolute abs-center-x bottom-[260px] lg:top-[654px] lg:left-[814px]">
              <LightSwitch on={lightOn} toggle={toggleLight} />
            </div>
            <div className="absolute right-[474px] bottom-[227px] mix-blend-screen">
              <SmokeScreen />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
