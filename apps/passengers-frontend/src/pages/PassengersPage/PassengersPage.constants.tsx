import FooterPassenger from 'components/FooterPassenger';
import NftSection from 'components/NftSection';
import RoadMap from 'components/RoadMap';
import TeamSection from 'components/TeamSection';
import React from 'react';
import * as THREE from 'three';

export interface HtmlContent {
  progress: number;
  anchor: THREE.Object3D;
  title: string;
}

export interface Section extends HtmlContent {
  render: (scrollLocation: number) => JSX.Element;
}

export function isSection(content: HtmlContent): content is Section {
  return !!(content as Section).render;
}

export enum PassengerState {
  'loading',
  'enterAnimation',
  'userCanEnter',
  'travelAnimation',
  'scrolling',
}

export enum TitleAnimationState {
  'before',
  'active',
  'after',
}

export const LOGO = (() => {
  const args = {
    progress: 0,
    position: new THREE.Vector3(14024.0830078125, 6056.3671875, -3.4050118923187256),
    scale: new THREE.Vector3(13.973879491585262, 13.973878864280017, 13.973878534104706),
    rotation: new THREE.Vector3(-1.5423343715794107, 1.4152551576817909, 1.5415640728738407),
  };
  const object = new THREE.Object3D();
  object.userData = { opacity: 0 };
  object.position.copy(args.position);
  object.rotation.setFromVector3(args.rotation, 'XYZ');

  return object;
})();
const TITLES: HtmlContent[] = [
  {
    title:
      'IN A TIME WHEN UNITY IS MORE IMPORTANT THAN EVER, PASSENGERS BRING HOPE TO BILLIONS OF PEOPLE AROUND THE COSMOS.',
    progress: 0.096102,
    position: new THREE.Vector3(7869.868894261623, 5038.657752695643, -128.90795615754783),
    scale: new THREE.Vector3(13.973879116975137, 13.973877377974336, 13.97387795142964),
    rotation: new THREE.Vector3(-1.6345317736844558, 1.4086415067770468, 1.6349538543048288),
  },
  {
    title:
      'No black hole too deep. No asteroid too deadly. Passengers are a galactic brigade of everyday heroes to any galaxy in need.',
    progress: 0.218563,
    position: new THREE.Vector3(898.0430534659372, 371.6166980757615, 76.95137885955128),
    scale: new THREE.Vector3(13.973878280687604, 13.97387707259434, 13.973876373631576),
    rotation: new THREE.Vector3(0.3009371581667525, 1.4429036640962292, -0.29902114848354955),
  },
  {
    title: `From the darkest galaxies to the deepest voids.
      We go all places and help all people.
      We never quit and we never back down.
      We stand for what’s right and stand up to all that’s wrong.
      We are The Passengers and we will answer your call.
      `,
    progress: 0.369744,
    position: new THREE.Vector3(-4212.421402167505, 3729.8603817655076, 1870.1062157298775),
    scale: new THREE.Vector3(13.973879749715183, 13.973878832532112, 13.973877753053996),
    rotation: new THREE.Vector3(-2.5882345410599874, -0.22498291813465882, -3.0051170247186247),
  },
].map(({ position, rotation, ...rest }) => {
  const anchor = new THREE.Object3D();
  anchor.position.copy(position);
  anchor.rotation.setFromVector3(rotation);
  return { ...rest, anchor } as HtmlContent;
});

const CONTENT_SECTIONS: Section[] = [
  {
    title: 'passengers',
    render: () => <NftSection />,
    progress: 0.470333,
    position: new THREE.Vector3(-1677.2416352703967, -323.13576321906964, 2101.810065185317),
    scale: new THREE.Vector3(13.973880011895728, 13.973877924944837, 13.973878105676112),
    rotation: new THREE.Vector3(-0.41899779356359645, -0.05493992599386779, -0.024903889255722216),
  },
  {
    title: 'flight path',
    render: (scrollLocation: number) => <RoadMap scrollLocation={scrollLocation} />,
    progress: 0.675995,
    position: new THREE.Vector3(1760.4251508803727, -138.58241046830364, -3351.889955678382),
    scale: new THREE.Vector3(13.973879140471968, 13.973878861706853, 13.973878980364589),
    rotation: new THREE.Vector3(-2.849496347743414, 1.1057312093662395, 2.8786088097249083),
  },
  {
    title: 'team',
    render: () => <TeamSection />,
    progress: 0.7673512354330709,
    position: new THREE.Vector3(-321.32303155535146, -562.5596809664189, 2213.755862462395),
    scale: new THREE.Vector3(13.973878819487526, 13.97387790556341, 13.973877866959292),
    rotation: new THREE.Vector3(-2.7811988257448266, 0.5392559215388009, 2.9554285777718885),
  },
  {
    title: 'connect',
    render: () => <FooterPassenger />,
    progress: 0.883739,
    position: new THREE.Vector3(-2919.0660707066145, -3284.107648909901, 8736.418695228134),
    scale: new THREE.Vector3(13.973878232271288, 13.97387789118846, 13.973878236957217),
    rotation: new THREE.Vector3(2.8743558772194535, 0.29792668296513436, -3.0618279138752453),
  },
].map(({ position, rotation, ...rest }) => {
  const anchor = new THREE.Object3D();
  anchor.position.copy(position);
  anchor.rotation.setFromVector3(rotation);
  anchor.userData.opacity = 1;
  return { ...rest, anchor };
});

// const HTML_CONTENT = [];
export const HTML_CONTENT = [...TITLES, ...CONTENT_SECTIONS].sort((a, b) => a.progress - b.progress);
export const SIDE_NAVIGATION_CONTENT = [{ title: 'intro', progress: 0 }, ...CONTENT_SECTIONS];
export const TITLE_VISIBILITY_THRESHOLD = 0.065;
export const TITLE_ANIMATION_DURATION = 1.5;
export const TITLE_ANIMATION_OFFSET = 8;
export const SCROLLING_DISTANCE = 60;
export const SCROLL_EASING = 2;
export const INITIAL_PROGRESS_ANIMATION = 0.25;
export const VOLUME_EASING = 2;
export const BLACKNESS_PROGRESS = 0.022067502952755905;
// TODO:
// temp solution to prevent overscroll, also prevent the fade out animation on the connect section from triggering
export const MAX_SCROLL = 0.884173;
