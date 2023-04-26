/* eslint-disable no-underscore-dangle */
import { easeInCube, easeOutCube } from '@twl/common/utils/math';
import { BigNumber } from 'ethers';
import gsap from 'gsap';
import {
  BLACKNESS_PROGRESS,
  HtmlContent,
  HTML_CONTENT,
  TitleAnimationState,
  TITLE_ANIMATION_DURATION,
  TITLE_ANIMATION_OFFSET,
  TITLE_VISIBILITY_THRESHOLD,
} from 'pages/PassengersPage/PassengersPage.constants';
import * as THREE from 'three';

export function getCameraAnimationProgress(progress: number) {
  let activeContent: HtmlContent | undefined;
  let lastPoint = 0;
  let nextPoint = 0;
  let sectionStart = 0;
  let sectionEnd = 0;

  for (let i = 0; i < HTML_CONTENT.length; i += 1) {
    activeContent = HTML_CONTENT[i];
    const point = HTML_CONTENT[i].progress;
    lastPoint = HTML_CONTENT[i - 1]?.progress ?? 0;
    nextPoint = HTML_CONTENT[i + 1]?.progress ?? 0;
    sectionStart = lastPoint ? getMiddle(lastPoint, point) : 0;
    sectionEnd = nextPoint ? getMiddle(point, nextPoint) : 1;
    if (progress < sectionEnd) break;
  }
  if (!activeContent) throw new Error('Missing text object!');
  const { progress: point, anchor } = activeContent;

  const starSectionProgress = easeOutCube(Math.min(1, (progress - sectionStart) / (point - sectionStart)));
  const endSectionProgress = easeInCube(Math.max(0, (progress - point) / (sectionEnd - point)));
  const animationProgress =
    sectionStart + (point - sectionStart) * starSectionProgress + (sectionEnd - point) * endSectionProgress;

  const animation = { value: 0 };
  const moveVector = new THREE.Vector3();
  let newState = TitleAnimationState.before;
  if (starSectionProgress > 1 - TITLE_VISIBILITY_THRESHOLD && endSectionProgress < TITLE_VISIBILITY_THRESHOLD) {
    newState = TitleAnimationState.active;
  }
  if (endSectionProgress >= TITLE_VISIBILITY_THRESHOLD) {
    newState = TitleAnimationState.after;
  }
  if (anchor.userData.animationState !== newState) {
    const targetValue = getAnimationValue(newState);
    animation.value = getAnimationValue(anchor.userData.animationState);
    anchor.userData.animationState = newState;

    gsap.to(animation, {
      value: targetValue,
      duration: TITLE_ANIMATION_DURATION,
      onUpdate: () => {
        const { value } = animation;
        const opacity = 1 - Math.abs(value);
        const offset = value * TITLE_ANIMATION_OFFSET;
        anchor?.getWorldDirection(moveVector);
        moveVector.multiplyScalar(offset);
        anchor!.parent!.position.copy(moveVector);
        anchor!.userData.opacity = opacity;
      },
    });
  }

  return [animationProgress, activeContent] as [typeof animationProgress, typeof activeContent];
}

export function getIntroOpacity(progress: number) {
  return THREE.MathUtils.clamp(1 - THREE.MathUtils.inverseLerp(0, BLACKNESS_PROGRESS, progress), 0, 1);
}

function getMiddle(start: number, end: number) {
  return start + (end - start) / 2;
}

function getAnimationValue(animationState: TitleAnimationState) {
  if (animationState === TitleAnimationState.before) return -1;
  if (animationState === TitleAnimationState.active) return 0;
  if (animationState === TitleAnimationState.after) return 1;

  throw new Error('Unknown animation state!');
}

export function bigNumberToInt(bigNumber: BigNumber) {
  if (!bigNumber._isBigNumber) {
    console.error('Not a big number!', bigNumber);
    return 0;
  }

  return parseInt(bigNumber._hex, 16);
}
