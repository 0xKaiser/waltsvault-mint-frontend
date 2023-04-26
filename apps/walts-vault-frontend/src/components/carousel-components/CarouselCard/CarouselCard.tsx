import React, { useMemo } from 'react';

export type RenderFunction<T> = (args: { animation: number; data: T; numberOfElements: number }) => JSX.Element;

export interface CarouselCardProps<T> {
  numberOfElements: number;
  index: number;
  scrollProgress: number;
  data: T;
  renderCard: RenderFunction<T>;
}

export default function CarouselCard<T>(props: CarouselCardProps<T>) {
  const { numberOfElements, index, scrollProgress, renderCard, data } = props;

  const interpolatedAnimation = useMemo(() => {
    const center = (1 / numberOfElements) * index;

    let distance = (scrollProgress - center) * 2;
    if (Math.abs(distance) > 1) {
      distance %= 1;
      distance = -1 * Math.sign(distance) + distance;
    }

    return (distance * numberOfElements) / 2;
  }, [scrollProgress, index, numberOfElements]);

  const zIndex = useMemo(() => Math.round(900 - Math.abs(interpolatedAnimation) * 10), [interpolatedAnimation]);

  return (
    <div className="h-full w-full absolute top-0 left-0" style={{ zIndex }}>
      {renderCard({ animation: interpolatedAnimation, data, numberOfElements })}
    </div>
  );
}
