import * as THREE from "three";

export const containerSetup = {
  widedRight: {
    wide: {
      position: {
        x: -0.195,
        y: 0.004,
        z: 0
      },
      scale: {
        x: 3.010,
        y: 3.070,
        z: 3.66
      }
    },
    narrow: {
      position: {
        x: -0.610,
        y: 0.016,
        z: -0.164
      },
      rotation: {
        y: 0
      },
      scale: {
        x: 1,
        y: 1,
        z: 1
      }
    }
  },
  widedLeft: {
    wide: {
      position: {
        x: 0.860,
        y: 0.004,
        z: 0
      },
      scale: {
        x: 3.010,
        y: 3.070,
        z: 3.66
      }
    },
    narrow: {
      position: {
        x: -0.610,
        y: 0.016,
        z: -0.164
      },
      rotation: {
        y: 0
      },
      scale: {
        x: 1,
        y: 1,
        z: 1
      }
    }
  },
  narrow: {
    wide: {
      position: {
        x: -0.195,
        y: 0.004,
        z: 0
      },
      scale: {
        x: 3.690,
        y: 3.070,
        z: 3.020
      }
    },
    narrow: {
      position: {
        x: 0.153,
        y: -0.129,
        z: 0
      },
      rotation: {
        y: Math.PI / 2
      },
      scale: {
        x: 2,
        y: 2,
        z: 2
      }
    }
  }
}
const loader = new THREE.ObjectLoader();
export class DionModel {
  constructor() {
    this.mixer = {};
    this.animationList = {};
    this.modelObject = null;
    this.Dino = null;
    this.fense = null;
    this.animations = []
    this.Node_Narrow = null
    this.DinoObj = { animations: [] };
  }

  async loadModel(sceneData, container, test) {
    const obj = await loader.parseAsync(sceneData.scene ? sceneData.scene : sceneData.Scene);
    const objCon = await loader.parseAsync(container.scene ? container.scene : container.Scene);

    this.modelObject = new THREE.Object3D();
    this.modelObject.position.set(0, 0, 0);
    this.modelObject.add(obj);
    this.modelObject.add(objCon);

    if (test) {
      const obT = await loader.parseAsync(test.scene ? test.scene : test.Scene);
      this.modelObject.add(obT);
    }
  }

  traverseModel(shortSide, sceneData) {
    let door, door2, Dino, fense;

    this.modelObject.traverse((item) => {
      item.layers.set(shortSide.targetIndex + 1);

      if (item.name === 'Box001') {
        this.DinoObj.box = item;
      }
      if (item.name === 'Node_Wide_Container') {
        this.setInitialTransform('nodeWideContainer', item);
      }
      if (item.name === 'Node_Wide') {
        this.setInitialTransform('nodeWide', item);
      }
      if (item.name === 'Node_Narrow_Container') {
        this.setInitialTransform('nodeNarrowContainer', item);
      }
      if (item.name === 'Node_Narrow') {
        this.setInitialTransform('nodeNarrow', item);
      }
      if (item.name === 'Dummy001') {
        door = item;
        this.DinoObj.door1 = door;
      }
      if (item.name === 'Dummy002') {
        door2 = item;
        this.DinoObj.door2 = door2;
      }
      if (item.name === 'container.glb') {
        fense = item;
        this.DinoObj.fense = fense;
      }
      if (['pterodactyl.glb', 'raptor.glb', 'triceratops.glb'].includes(item.name)) {
        Dino = item;
        this.DinoObj.Dino = Dino;
      }
    });

    this.setupAnimations(Dino, fense, door, door2, sceneData);

    this.DinoObj.modelObject = this.modelObject;
  }

  setInitialTransform(name, item) {
    this.DinoObj[name] = item;
    this.DinoObj[name].initialPosition = item.position.clone();
    this.DinoObj[name].initialRotation = item.rotation.clone();
    this.DinoObj[name].initialScale = item.scale.clone();
  }
  setInitialNarrowTransform(name, item) {
    this.[name] = item;
    this.DinoObj[name].initialPosition = item.position.clone();
    this.DinoObj[name].initialRotation = item.rotation.clone();
    this.DinoObj[name].initialScale = item.scale.clone();
  }

  setupAnimations(Dino, fense, door, door2, sceneData) {
    if (Dino) {
      this.setupDinoAnimations(Dino, sceneData);
    }
    if (fense) {
      this.setupFenseAnimations(fense, door, door2, sceneData);
    }
  }

  setupDinoAnimations(Dino, sceneData) {
    let animations = Dino.animations;
    let animationName = sceneData.name;
    this.mixer[animationName] = new THREE.AnimationMixer(Dino);
    this.animationList[animationName] = this.mixer[animationName].clipAction(animations[0]);
    this.animationList[animationName].clampWhenFinished = true;
    this.DinoObj.animations.push(animationName);
  }

  setupFenseAnimations(fense, door, door2, sceneData) {
    let animations = fense.animations;
    animations.forEach((animation) => {
      let animationName = animation.name + sceneData.name;
      this.mixer[animationName] = new THREE.AnimationMixer(fense);
      this.animationList[animationName] = this.mixer[animationName].clipAction(animation);
      this.animationList[animationName].clampWhenFinished = true;
      this.DinoObj.animations.push(animationName);
      this.animationList[animationName].setLoop(THREE.LoopOnce);
      this.mixer[animationName].addEventListener('finished', () => {
        door.visible = false;
        door2.visible = false;
      });
    });
  }
}
