import { Pages } from 'constants/common';

import ImagePlaneClass from '@twl/common/rendering-engine/image-plane';
import IMG_TWL_1_ASCII from 'assets/images/TWL-1-ascii.jpg';
import IMG_TWL_1 from 'assets/images/TWL-1.jpg';
import IMG_TWL_2_ASCII from 'assets/images/TWL-2-ascii.jpg';
import IMG_TWL_2 from 'assets/images/TWL-2.jpg';
import IMG_TWL_3_ASCII from 'assets/images/TWL-3-ascii.jpg';
import IMG_TWL_3 from 'assets/images/TWL-3.jpg';
import IMG_TWL_4_ASCII from 'assets/images/TWL-4-ascii.jpg';
import IMG_TWL_4 from 'assets/images/TWL-4.jpg';
import IMG_TWL_5_ASCII from 'assets/images/TWL-5-ascii.jpg';
import IMG_TWL_5 from 'assets/images/TWL-5.jpg';
import IMG_TWL_6_ASCII from 'assets/images/TWL-6-ascii.jpg';
import IMG_TWL_6 from 'assets/images/TWL-6.jpg';
import NavigationCard from 'components/NavigationCard/NavigationCard';
import PinnedHorizontalScroll from 'components/PinnedHorizontalScroll';
import React, { useEffect, useRef } from 'react';

const images = [
  {
    id: 'key_1',
    effectImage: IMG_TWL_1_ASCII,
    imageSrc: IMG_TWL_1,
    title: 'PASSENGERS',
    to: Pages.passengers,
  },
  {
    id: 'key_2',
    effectImage: IMG_TWL_2_ASCII,
    imageSrc: IMG_TWL_2,
    title: 'PASSENGERS',
    to: Pages.passengers,
  },
  {
    id: 'key_3',
    effectImage: IMG_TWL_3_ASCII,
    imageSrc: IMG_TWL_3,
    title: 'PASSENGERS',
    to: Pages.passengers,
  },
  {
    id: 'key_4',
    effectImage: IMG_TWL_4_ASCII,
    imageSrc: IMG_TWL_4,
    title: 'WALT‘S VAULT',
    to: Pages.waltsVault,
  },
  {
    id: 'key_5',
    effectImage: IMG_TWL_5_ASCII,
    imageSrc: IMG_TWL_5,
    title: 'WALT‘S VAULT',
    to: Pages.waltsVault,
  },
  {
    id: 'key_6',
    effectImage: IMG_TWL_6_ASCII,
    imageSrc: IMG_TWL_6,
    title: 'WALT‘S VAULT',
    to: Pages.waltsVault,
  },
];

const CONTROLS: { name: string; range: [number, number] }[] = [
  { name: 'u_noiseSize', range: [0, 100] },
  { name: 'u_noiseStrength', range: [0, 10] },
  { name: 'u_timeScale', range: [0, 1] },
  { name: 'u_verticalBlur', range: [0, 1] },
  { name: 'u_verticalEdge', range: [0, 1] },
  { name: 'u_horizontalBlur', range: [0, 1] },
  { name: 'u_horizontalEdge', range: [0, 1] },
];

export default function NavigationCardsContainer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imagePlanesRef = useRef<ImagePlaneClass[]>([]);

  const guiObjRef = useRef({
    u_verticalBlur: 0,
    u_verticalEdge: 0,
    u_horizontalBlur: 0.1,
    u_horizontalEdge: 0.7,
    u_noiseSize: 6,
    u_noiseStrength: 3,
    u_timeScale: 0.1,
  });

  useEffect(() => {
    function updateProperties(key: string, value: number) {
      imagePlanesRef.current.forEach(plane => {
        // @ts-ignore
        plane.$mesh.material.uniforms[key].value = value;
      });
    }

    function addControl(name: string, [start, end]: [number, number]) {
      folder.add(guiObjRef.current, name, start, end).onChange(v => updateProperties(name, v));
    }

    const folder = window.gui.addFolder('Navigation cards');
    CONTROLS.forEach(settings => addControl(settings.name, settings.range));

    return () => {
      window.gui.removeFolder(folder);
    };
  }, []);

  function onScroll(_: number, translate: { x: number; y: number }) {
    const { x, y } = translate;
    imagePlanesRef.current.forEach(plane => {
      plane.translate.y = y;
      plane.translate.x = x;
    });
  }

  return (
    <PinnedHorizontalScroll pinDuration={200} onScroll={onScroll}>
      <div ref={containerRef} className="overflow-x-auto items-center ">
        <div className="inline-flex min-w-full justify-center h-screen items-center bg-transparent">
          <div className="w-[70vw] h-1" />
          {images.map(({ id, ...data }, index) => {
            function addImagePlaneRef(plane: ImagePlaneClass) {
              imagePlanesRef.current[index] = plane;
            }

            return <NavigationCard key={id} imagePlaneRef={addImagePlaneRef} {...data} />;
          })}
          <div className="w-[30vw] h-1" />
        </div>
      </div>
    </PinnedHorizontalScroll>
  );
}
