import { ISheetObject, types } from '@theatre/core';
import { editable } from '@theatre/r3f';
import { TheaterDefaultProps } from '@twl/common/types/types';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { RectAreaLight } from 'three';

interface ReactAreaLightComponentProps {}

const ReactAreaLightComponent = forwardRef<RectAreaLight, ReactAreaLightComponentProps>((props, ref) => (
  <rectAreaLight {...props} ref={ref} />
));
const EditableReactAreaLightComponent = editable(ReactAreaLightComponent, 'group');

interface EditableRectAreaLightProps extends TheaterDefaultProps {}

export default function EditableRectAreaLight(props: EditableRectAreaLightProps) {
  const ref = useRef<RectAreaLight>(null);
  const [theatreObject, setTheatreObject] = useState<ISheetObject | undefined>();

  useEffect(() => {
    if (!theatreObject) return undefined;

    const unsubscribe = theatreObject.onValuesChange(newValues => {
      if (!ref.current) return;
      // Apply the new offset to our THREE.js object
      ref.current.height = newValues.height;
      ref.current.width = newValues.width;
      ref.current.power = newValues.power;
      ref.current.intensity = newValues.intensity;
      ref.current.color = newValues.color;
    });

    // unsubscribe from the listener when the component unmounts
    return unsubscribe;
  }, [theatreObject]);

  return (
    <EditableReactAreaLightComponent
      {...props}
      ref={ref}
      additionalProps={{
        height: types.number(1, { range: [0, 10] }),
        width: types.number(1, { range: [0, 10] }),
        power: types.number(1, { range: [-10, 100] }),
        intensity: types.number(1, { range: [-10, 300] }),
        color: types.rgba({ r: 255, g: 255, b: 255, a: 1 }),
      }}
      objRef={setTheatreObject}
    />
  );
}
