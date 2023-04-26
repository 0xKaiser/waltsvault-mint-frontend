import WebGlCanvas from '@twl/common/rendering-engine/webgl-canvas';
import Lobby from 'assets/models/LobbyGLTF/Lobby.glb';
import * as THREE from 'three';
import { Object3D } from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/examples/js/libs/draco/');
gltfLoader.setDRACOLoader(dracoLoader);

export default class MintCorridor extends WebGlCanvas {
  onCorridorLoad?: (obj: Object3D) => void;

  doorLight = new THREE.PointLight();

  constructor(container: HTMLElement) {
    super(container);

    this.setupScene();
  }

  private setupScene() {
    this.camera.fov = 50;
    this.camera.near = 1;
    this.camera.updateProjectionMatrix();

    this.scene.add(new THREE.AmbientLight('white', 0.3));
    this.scene.add(this.doorLight);

    const testObj = new THREE.Mesh(
      new THREE.BoxBufferGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ color: 'white' }),
    );
    this.scene.add(testObj);

    gltfLoader.load(Lobby, obj => {
      this.scene.add(obj.scene);
      if (this.onCorridorLoad) this.onCorridorLoad(obj.scene);
    });
  }
}
