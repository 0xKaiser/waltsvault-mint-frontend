import { ImagesCanvasContext } from '@twl/common/components/ImagesCanvas/ImagesCanvas';
import ImagePlaneClass, { ImagePlaneConfigs } from '@twl/common/rendering-engine/image-plane';
import React, { useContext, useLayoutEffect, useRef } from 'react';

export interface ImagePlaneProps {
  children: React.ReactNode;
  configs?: ImagePlaneConfigs;
  className?: string;
  imagePlaneRef?: (plane: ImagePlaneClass) => void;
}
function ImagePlane(props: ImagePlaneProps) {
  const { children, configs, className, imagePlaneRef } = props;
  const { imagesCanvas } = useContext(ImagesCanvasContext);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const planeRef = useRef<ImagePlaneClass | undefined>();

  useLayoutEffect(() => {
    if (!containerRef.current || !imagesCanvas) return undefined;

    const images = containerRef.current.getElementsByTagName('img');
    const image = images[0];

    const errorMessage = 'ImagesPlane needs exactly one image as a child element';
    if (images.length === 0) throw new Error(errorMessage);
    if (images.length > 1) throw new Error(errorMessage);

    planeRef.current = new ImagePlaneClass(image, imagesCanvas, configs);
    if (imagePlaneRef) {
      imagePlaneRef(planeRef.current);
    }

    return () => {
      planeRef.current?.remove();
      planeRef.current = undefined;
    };
    // don't wan't to recreate the the image plane if the configs object changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imagesCanvas]);

  if (!imagesCanvas) return null;

  return (
    <div className={className} ref={containerRef}>
      {children}
    </div>
  );
}

export default React.memo(ImagePlane);
