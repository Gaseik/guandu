import * as THREE from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {AnimationClip, NumberKeyframeTrack} from "three";

export const PageState = {
  Loading: 0x00000,
  Intro: 0x00001,
  ARView: 0x00010,
  ViewPhoto: 0x00100,
  ViewVideo: 0x01000,
  Discard: 0x10000,
}
const mixer = [];
export const animationList = [];
const clock = new THREE.Clock();
export let modelData = undefined;
let burger = undefined;
let drinks = undefined;
let orthoCamera, orthoScene, logoMesh;
export const AppState = {
  state: {
    pageState: PageState.Loading,
    isArModeOn: false,
    modelData: undefined,
    arLib: undefined,
    targetFind: false,
    imageData: undefined,
    videoData: undefined,
    lastPage: undefined,
    helpPop: true,
    target: undefined,
  },
  reducers: {
    changePageState: (state, payload) => {
      return {...state, pageState: payload}
    },
    changeTarget: (state, payload) => {
      return {...state, target: payload}
    },
    setModelData: (state, payload) => {
      return {...state, modelData: payload}
    },
    setArLib: (state, payload) => {
      return {...state, arLib: payload}
    },
    setTargetFind: (state, payload) => {
      return {...state, payload}
    },
    setIsArModeOn: (state, payload) => {
      return {...state, isArModeOn:payload}
    },
    setImageData: (state, payload) => {
      return {...state, imageData: payload}
    },
    setVideoData: (state, payload) => {
      return {...state, videoData: payload}
    },
    setLastPage: (state, payload) => {
      return {...state, lastPage: payload}
    },
    setHelpPop: (state, payload) => {
      return {...state, helpPop: payload}
    },
  },
  effects: (dispatch) => ({
    async loadModelFile(onTargetFound, onTargetLost) {
      const arLib = new window.MINDAR.IMAGE.MindARThree({
        container: document.querySelector("#ar_container"),
        imageTargetSrc: '/model/targets.mind',
        filterMinCF: 0.001,
        filterBeta: 0.009,
        missTolerance: 5,
        warmupTolerance: 0,
        uiError: false,
        uiLoading: false,
        uiScanning: false
      });
      const {renderer, scene, camera} = arLib;
      const anchor = arLib.addAnchor(0);
      const anchorSec = arLib.addAnchor(1);
      modelData = anchor.group;
      if(onTargetFound){
      
        anchor.onTargetFound = async ()=> {
          dispatch.AppState.setHelpPop(false);
          onTargetFound(anchor.group);
          dispatch.AppState.setModelData(anchor.group)
        }
        anchorSec.onTargetFound= async ()=> {
          dispatch.AppState.setHelpPop(false);
          onTargetFound(anchorSec.group);
          dispatch.AppState.setModelData(anchorSec.group)
        }
      }
      // if(onTargetLost){
      //   anchor.onTargetLost = onTargetLost
      // }
      const loader = new GLTFLoader()
      Promise.all([
        //下載場景檔
        fetch("/model/Drink_V3.json").then(result => result.json()),
        fetch("/model/ARSceneBurger.json").then(result => result.json()),
        arLib.start()
      ]).then(([arSceneD,arSceneB,arLibResult]) => {
     
        //設置攝影機的畫面
        connectWebCam(arLib)
        arLib.camera2D = orthoCamera
        arLib.scene2D = orthoScene
        console.log(arSceneB)
        console.log(arSceneD)
       
        //設置3D場景
        setScene(anchor.group, scene, arSceneD, () => {
          renderer.shadowMap.enabled = true;
          renderer.shadowMap.type = THREE.PCFSoftShadowMap;
          renderer.shadowMap.needsUpdate = true;
          renderer.setAnimationLoop(() => {
            renderer.autoClear = false;
          
            camera.layers.set(2);
            renderer.render(scene, camera);
            camera.layers.set(0);
            renderer.render(scene, camera);
           
            let mixerUpdateDelta = clock.getDelta();
            Object.keys(mixer).forEach(name => {
              mixer[name].update(mixerUpdateDelta)
            })
            if(drinks){
              drinks.rotation.x += 2 
              drinks.rotation.y += 0.01;
              drinks.rotation.y %= Math.PI * 2;
              drinks.rotation.y = Math.max(drinks.rotation.y, -Math.PI / 2);
            }
          
          });

  
      
       
        })
        setScene(anchorSec.group, scene, arSceneB, () => {
          renderer.shadowMap.enabled = true;
          renderer.shadowMap.type = THREE.PCFSoftShadowMap;
          renderer.shadowMap.needsUpdate = true;
          renderer.setAnimationLoop(() => {
            renderer.autoClear = false;
            
            camera.layers.set(2);
            renderer.render(scene, camera);
            camera.layers.set(0);
            renderer.render(scene, camera);

            // 渲染2D场景（logo）
            // 目前因為時序問題,由最後一個函式渲染
            renderer.autoClear = false; // 防止在渲染2D场景前清除现有的渲染
            renderer.render(orthoScene, orthoCamera);
            renderer.autoClear = true; // 渲染完毕后重置autoClear
     
            let mixerUpdateDelta = clock.getDelta();
            Object.keys(mixer).forEach(name => {
              mixer[name].update(mixerUpdateDelta)
            })
            if (burger) {
              burger.rotation.y += 0.01;
              burger.rotation.y %= Math.PI * 2;
              burger.rotation.y = Math.max(burger.rotation.y, -Math.PI / 2);
            }
          });
        })
      
        dispatch.AppState.changePageState(PageState.ARView);
        dispatch.AppState.setArLib(arLib);
        dispatch.AppState.setIsArModeOn(true)
      }).catch((e)=>{
      });
    },
    setImage(imageData) {
      dispatch.AppState.setImageData(imageData);
      dispatch.AppState.changePageState(PageState.ViewPhoto);
    },
    setVideo(videoData) {
      dispatch.AppState.setVideoData(videoData);
      dispatch.AppState.changePageState(PageState.ViewVideo);
    },
    showDiscard(page) {
      dispatch.AppState.setLastPage(page);
      dispatch.AppState.changePageState(PageState.Discard);
    }
  })
}

//設定播放動畫清單
function setModelAnimation(glbModel, animationObject, name) {
  animationObject.animations.forEach(animation => {
    let nameSet = animation.name
    if(name){
      nameSet = name;
    }
    mixer[nameSet] = new THREE.AnimationMixer(glbModel);
    animationList[nameSet] = mixer[nameSet].clipAction(animation);
  })
}

//設置攝影機的畫面
function connectWebCam(mindarThree) {
  const { video, scene } = mindarThree;
  video.style.opacity = 1;
  //建立影像圖層
  let videoTex = new THREE.VideoTexture(video);
  videoTex.encoding = THREE.sRGBEncoding;
  videoTex.minFilter = THREE.LinearFilter;
  videoTex.maxFilter = THREE.LinearFilter;

  //建立 mesh
  const mesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(video.clientWidth, video.clientHeight),
      new THREE.MeshBasicMaterial({ color: 0xffffff, map: videoTex, side: THREE.DoubleSide})
  );

  //設定大小及位置
  let scale = 9;
  let position_y = 0;
  mesh.renderOrder = 2


  mesh.position.set(0, position_y, -10000);
  mesh.scale.set(scale, scale, 1);
  mesh.layers.set(2);
  mesh.layers.enable(2);
  scene.add(mesh);
  



  // 创建2D场景和相机
  orthoScene = new THREE.Scene();
  orthoCamera = new THREE.OrthographicCamera(0, window.innerWidth, window.innerHeight, 0, -10, 10);

  // 加载Logo并添加到2D场景
  const loader = new THREE.TextureLoader();
  loader.load('/image/guanduLogo.png', (texture) => {
      const logoGeometry = new THREE.PlaneGeometry(texture.image.width, texture.image.height);
      const logoMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
      logoMesh = new THREE.Mesh(logoGeometry, logoMaterial);
      logoMesh.scale.set(0.4,0.4,0.4)
      // 调整位置以放置在左上角
      logoMesh.position.set(window.innerWidth/4, window.innerHeight-50, 1);
      orthoScene.add(logoMesh);
      // scene.render(orthoScene, orthoCamera);
  });

}

//設置場景
async function setScene(anchorGroup, scene, sceneData, callback) {
  const loader = new THREE.ObjectLoader();
  //打場景資料轉成 ThreeJS場景資訊
  
  const obj = await loader.parseAsync(sceneData.scene?sceneData.scene:sceneData.Scene);
  console.log(scene)
  //設置環境貼圖
  if(obj.environment !== null) {
    scene.environment = obj.environment;
  }

  //設置主物件的父層級並把ThreeJS場景資訊放入
  const modelObject = new THREE.Object3D();
  modelObject.add(obj);
  modelObject.scale.set(0.235, 0.235, 0.235);
  modelObject.position.x = -0.2
  modelObject.position.y = -0.13
  anchorGroup.add(modelObject);
  //掃描ThreeJS的物件並做處理
  modelObject.traverse((item) => {
    //檢查是否是燈光並把燈放到場景層下而不是跟隨物件
    if(item.isLight) {
      item.parent = scene
    }

    //檢查是否是遮罩物件並設定遮罩材質球
    // if (i-


    let animations = item.animations;
    console.log(item.name)
    //設定球體漸變動畫
 
    if(item.name === `Cylinder_cup002`) {
      drinks = item;
    }
    if(item.name === `Hamburger`) {
      burger = item
     
    }
    //設定動畫
    // animations.forEach(animation => {
    //   mixer[animation.name] = new THREE.AnimationMixer(item);
    //   animationList[animation.name] = mixer[animation.name].clipAction(animation);
    //   animationList[animation.name].clampWhenFinished = true;

   
    // });
  });
  callback();
}

//設定材質球動畫
function CreateMaterialAnimation(times, values) {

  // const times = [ 0, 2.5, 5 ], values = [ 1, 0.25, 1 ];

  const trackName = '.material.opacity';

  const track = new THREE.NumberKeyframeTrack( trackName, times, values );
  return new AnimationClip( null, times[times.length-1], [ track ] );

}

const delay = ms => new Promise(res => setTimeout(res, ms));
