import { Mesh, MeshBasicMaterial, Object3D, SphereGeometry } from 'three';

export default function useTransfromControls(objects: Object3D[]) {
  const addSceneControls = (targets: Object3D[]) => {
    targets.forEach(object => {
      if (object?.userData?.animated && !object.children.find(child => child.userData.isTransform)) {
        const control = new Mesh();
        control.userData = { isTransform: true };
        control.geometry = new SphereGeometry(0.02);
        control.material = new MeshBasicMaterial({ color: 'red', depthTest: false, depthWrite: false });
        object.attach(control);
      }
      addSceneControls(object.children);
    });
  };
  addSceneControls(objects);
}
