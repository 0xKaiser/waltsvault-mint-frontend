import { onChange, types, val } from '@theatre/core';
import { useCallback } from 'react';
import { Light, Material, MathUtils, Object3D, PerspectiveCamera, ShaderMaterial, Vector3 } from 'three';
import { AnimationData } from 'types/interface';

import { useTheaterContext } from './useTheaterContext';

export default function useTheatherJS() {
  const { project } = useTheaterContext();

  const addObjectAnimation = useCallback(
    (obj: Object3D | Material, animations: AnimationData[]) => {
      if (!project) return;
      animations?.forEach(animation => {
        const {
          sheetName,
          autoplay = false,
          loop = false,
          objectName,
          scaleRange = 100,
          positionRange = 100,
        } = animation;
        const sheet = project.sheet(sheetName);
        if (autoplay) {
          project.ready.then(() => {
            sheet.sequence.play();
          });
        }
        if (loop) {
          onChange(sheet.sequence.pointer.playing, playing => {
            if (!playing && sheet.sequence.position >= val(sheet.sequence.pointer.length)) sheet.sequence.play();
          });
        }
        const allProperties = [];
        const allOnChangeCallbacks: Function[] = [];
        if (obj instanceof Object3D) {
          const properties = {
            rotation: types.compound({
              x: types.number(MathUtils.radToDeg(obj.rotation.x), { range: [-360, 360], nudgeMultiplier: 0.02 }),
              y: types.number(MathUtils.radToDeg(obj.rotation.y), { range: [-360, 360], nudgeMultiplier: 0.02 }),
              z: types.number(MathUtils.radToDeg(obj.rotation.z), { range: [-360, 360], nudgeMultiplier: 0.02 }),
            }),
            position: types.compound({
              x: types.number(obj.position.x, { range: [-positionRange, positionRange], nudgeMultiplier: 0.02 }),
              y: types.number(obj.position.y, { range: [-positionRange, positionRange], nudgeMultiplier: 0.02 }),
              z: types.number(obj.position.z, { range: [-positionRange, positionRange], nudgeMultiplier: 0.02 }),
            }),
            scale: types.compound({
              x: types.number(obj.scale.x, { range: [-scaleRange, scaleRange], nudgeMultiplier: 0.02 }),
              y: types.number(obj.scale.y, { range: [-scaleRange, scaleRange], nudgeMultiplier: 0.02 }),
              z: types.number(obj.scale.z, { range: [-scaleRange, scaleRange], nudgeMultiplier: 0.02 }),
            }),
          };
          const object3D = obj as Object3D;

          const onValuesChange = function onValuesChange(values: {
            rotation: Vector3;
            position: Vector3;
            scale: Vector3;
          }) {
            const { rotation, position, scale } = values;
            object3D.rotation.setFromVector3(
              new Vector3(
                MathUtils.degToRad(rotation.x),
                MathUtils.degToRad(rotation.y),
                MathUtils.degToRad(rotation.z),
              ),
            );
            object3D.position.set(position.x, position.y, position.z);
            object3D.scale.set(scale.x, scale.y, scale.z);
            if (obj instanceof PerspectiveCamera) {
              (obj as PerspectiveCamera).updateProjectionMatrix();
              (obj as PerspectiveCamera).updateMatrix();
            }
          };

          allProperties.push(properties);
          allOnChangeCallbacks.push(onValuesChange);
        }

        if (obj instanceof ShaderMaterial) {
          const properties = { opacity: types.number(obj.uniforms.opacity.value, { range: [0, 1] }) };

          const onValuesChange = (values: { opacity: number }) => {
            const { opacity } = values;
            obj.uniforms.opacity.value = opacity;
            obj.uniformsNeedUpdate = true;
            obj.needsUpdate = true;
          };
          allProperties.push(properties);
          allOnChangeCallbacks.push(onValuesChange);
        } else if (obj instanceof Material) {
          const properties = { opacity: types.number(obj.opacity, { range: [0, 1] }) };
          const onValuesChange = (values: { opacity: number }) => {
            const { opacity } = values;
            obj.opacity = opacity;
          };

          allProperties.push(properties);
          allOnChangeCallbacks.push(onValuesChange);
        }

        if (obj instanceof Light) {
          const properties = {
            intensity: types.number(obj.intensity, { range: [0, 1] }),
            castShadow: types.boolean(obj.castShadow),
            color: types.rgba({ r: 255, g: 255, b: 255, a: 1 }),
          };

          const onValuesChange = (values: { intensity: number; castShadow: boolean; color: THREE.Color }) => {
            const { intensity, castShadow, color } = values;
            obj.intensity = intensity;
            obj.castShadow = castShadow;
            obj.color = color;
          };

          allProperties.push(properties);
          allOnChangeCallbacks.push(onValuesChange);
        }

        const sheetObj = sheet.object(
          objectName,
          allProperties.reduce((acc, cur) => ({ ...acc, ...cur }), {}),
          { reconfigure: true },
        );
        sheetObj.onValuesChange(changes => allOnChangeCallbacks.forEach(callback => callback(changes)));
      });
    },
    [project],
  );

  return { addObjectAnimation };
}
