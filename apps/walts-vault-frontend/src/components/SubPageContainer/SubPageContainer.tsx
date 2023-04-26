import useWindowInnerDimensions from '@twl/common/hooks/useWindowInnerDimensions';
import React, { useEffect, useRef, useState } from 'react';

interface SubPageContainerProps {
  children: React.ReactNode;
}

const SUB_PAGE_CONTAINER_ASPECT_RATIO = 1.34;

export default function SubPageContainer(props: SubPageContainerProps) {
  const { children } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const { innerHeight } = useWindowInnerDimensions();
  const [scale, setScale] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    setScale(containerRef.current.offsetHeight / innerHeight);
  }, [innerHeight]);

  const containerTransform = `scale(${scale})`;

  const containerWidth = innerHeight * SUB_PAGE_CONTAINER_ASPECT_RATIO;

  return (
    <div className="h-full w-full flex justify-center items-center clip-circle">
      <div className="h-[76%] relative top-[0.3%] w-full  flex justify-center items-center" ref={containerRef}>
        <div
          style={{ transform: containerTransform, minWidth: containerWidth }}
          className="h-screen w-full  flex justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}
