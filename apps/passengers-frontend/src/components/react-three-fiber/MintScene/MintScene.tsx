/* eslint-disable react/no-unknown-property */
import { ProjectNames, SheetNames } from 'constants/common';

import { EnvironmentMap, Html, Stats, useGLTF } from '@react-three/drei';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import { getProject } from '@theatre/core';
import { editable as e, SheetProvider, PerspectiveCamera } from '@theatre/r3f';
import IMG_SKYBOX from 'assets/images/skybox.jpg';
import Lobby from 'assets/models/compressed-mint.glb';
import Hologram from 'assets/models/hologram.glb';
import mintSceneState from 'assets/theater/mint-corridor.theatre-project-state.json';
import FlightListButton from 'components/FlightList/FlightListButton';
import MintingContent from 'components/Mint/MintingContent';
import { MintingContentProps } from 'components/Mint/MintingContent/MintingContent';
import useLookAroundCamera from 'hooks/useLookAroundCamera';
import { useTheaterContext } from 'hooks/useTheaterContext';
import useTheatherJS from 'hooks/useTheaterJS';
import React, { memo, Suspense, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { TextureLoader } from 'three/src/loaders/TextureLoader';

import EditableRectAreaLight from '../EditableRectAreaLight';

const clock = new THREE.Clock();

const project = getProject(ProjectNames.MintCorridor, { state: mintSceneState });
const sceneSheet = project.sheet(SheetNames.Scene);
const skyBoxSheet = project.sheet(SheetNames.SkyBox);
const enterAnimationSheet = project.sheet(SheetNames.EnterAnimation);

interface MintSceneProps extends MintingContentProps {
  onEnter?: () => void;
  setCorridorLoaded: (status: boolean) => void;
  setHologramLoaded: (status: boolean) => void;
  cameraPanningEnabled: boolean;
}
export default memo((props: MintSceneProps) => {
  const { onEnter, setCorridorLoaded, setHologramLoaded, cameraPanningEnabled, ...mintingContentProps } = props;
  const { setProjectConfig } = useTheaterContext();
  const { addObjectAnimation } = useTheatherJS();
  const { scene } = useThree();
  const animationMixerRef = useRef<THREE.AnimationMixer | undefined>();
  const [cameraParent, setCameraParent] = useState<THREE.Group | null>();
  useLookAroundCamera(cameraParent, 1, Math.PI / 8, cameraPanningEnabled);

  const [spotLight, spotLightRef] = useState<THREE.SpotLight | null>();
  const [spotLightTarget, spotLightTargetRef] = useState<THREE.Mesh | null>();
  const [skyBox, skyBoxRef] = useState<THREE.Mesh | null>(null);

  const enterButtonRef = useRef(null);

  const mintCorridorModel = useGLTF(Lobby);
  const hologramModel = useGLTF(Hologram);
  const skyBoxMap = useLoader(TextureLoader, IMG_SKYBOX);

  useFrame((_, delta) => {
    if (animationMixerRef.current) animationMixerRef.current.update(delta);
    if (skyBox) skyBox.rotation.y += clock.getDelta() * 0.03;
  });

  useEffect(() => {
    if (!hologramModel) return;

    setHologramLoaded(!!setHologramLoaded);

    const mixer = new THREE.AnimationMixer(hologramModel.scene);
    animationMixerRef.current = mixer;
    hologramModel.animations.forEach(anim => {
      const action = mixer.clipAction(anim).play();
      action.setLoop(THREE.LoopRepeat, Infinity);
    });
  }, [hologramModel, setHologramLoaded]);

  useEffect(() => {
    if (!skyBoxMap) return;
    skyBoxMap.encoding = THREE.sRGBEncoding;
  }, [skyBoxMap]);

  useEffect(() => {
    setProjectConfig('mint-corridor', { state: mintSceneState });
  }, [setProjectConfig]);

  useEffect(() => {
    if (!mintCorridorModel || !project) return;

    setCorridorLoaded(!!mintCorridorModel);

    const firstRightDoor = mintCorridorModel.scene.getObjectByName('door_right');
    const secondRightDoor = mintCorridorModel.scene.getObjectByName('door_right3');
    const firstLeftDoor = mintCorridorModel.scene.getObjectByName('door_right1');
    const secondLeftDoor = mintCorridorModel.scene.getObjectByName('door_right2');

    if (!firstLeftDoor || !secondLeftDoor || !firstRightDoor || !secondRightDoor) throw new Error('Missing doors!');

    addObjectAnimation(firstRightDoor, [
      {
        sheetName: SheetNames.EnterAnimation,
        objectName: 'door_right_0',
        autoplay: false,
        loop: false,
        positionRange: 300,
      },
    ]);
    addObjectAnimation(firstLeftDoor, [
      {
        sheetName: SheetNames.EnterAnimation,
        objectName: 'door_left_0',
        autoplay: false,
        loop: false,
        positionRange: 300,
      },
    ]);
    addObjectAnimation(secondRightDoor, [
      {
        sheetName: SheetNames.EnterAnimation,
        objectName: 'door_right_1',
        autoplay: false,
        loop: false,
        positionRange: 300,
      },
    ]);
    addObjectAnimation(secondLeftDoor, [
      {
        sheetName: SheetNames.EnterAnimation,
        objectName: 'door_left_1',
        autoplay: false,
        loop: false,
        positionRange: 300,
      },
    ]);
  }, [mintCorridorModel, addObjectAnimation, setCorridorLoaded]);

  useEffect(() => {
    if (!spotLight || !spotLightTarget) return;
    spotLightTarget.add(spotLight.target);
  }, [spotLight, spotLightTarget, scene]);

  return (
    <Suspense fallback={null}>
      <Stats />
      <EnvironmentMap map={skyBoxMap} />
      <SheetProvider sheet={enterAnimationSheet}>
        <e.group theatreKey="camera-parent">
          <group ref={setCameraParent}>
            <PerspectiveCamera
              theatreKey="Camera"
              makeDefault
              fov={60}
              attachArray={undefined}
              attachObject={undefined}
              attachFns={undefined}
            />
          </group>
        </e.group>
        <e.group theatreKey="hologram-parent">
          <primitive object={hologramModel?.scene} editableType="mesh" />
        </e.group>
        <e.group theatreKey="mint-ui">
          <Html center transform>
            <MintingContent {...mintingContentProps} />
          </Html>
        </e.group>
        <e.group theatreKey="enter-button">
          <Html center transform>
            <div ref={enterButtonRef}>
              <FlightListButton onClick={onEnter}>OPEN AIRLOCK</FlightListButton>
            </div>
          </Html>
        </e.group>
      </SheetProvider>
      <SheetProvider sheet={sceneSheet}>
        <EffectComposer>
          <Bloom luminanceThreshold={0.7} radius={0.2} intensity={2} luminanceSmoothing={0.2} height={300} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
        <e.ambientLight theatreKey="ambient-light" />
        <e.spotLight theatreKey="spot-light-0" ref={spotLightRef} />
        <e.mesh theatreKey="spot-light-0-target" ref={spotLightTargetRef} visible="editor">
          <meshBasicMaterial color="red" />
          <sphereBufferGeometry args={[0.05, 32, 16]} />
        </e.mesh>
        <e.group theatreKey="corridor-parent">
          <primitive object={mintCorridorModel.scene} editableType="mesh" />
        </e.group>
        <EditableRectAreaLight theatreKey="rect-light-0" />
        <EditableRectAreaLight theatreKey="rect-light-1" />
      </SheetProvider>
      <SheetProvider sheet={skyBoxSheet}>
        <e.mesh theatreKey="sky-box" ref={skyBoxRef}>
          <sphereBufferGeometry args={[100, 100, 100]} />
          <meshBasicMaterial opacity={1} transparent map={skyBoxMap} side={THREE.BackSide} />
        </e.mesh>
      </SheetProvider>
    </Suspense>
  );
});
