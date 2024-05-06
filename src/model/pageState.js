import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { AnimationClip, NumberKeyframeTrack } from "three";

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

//這邊把一些需要旋轉的物件宣告
let drinks = undefined;
let burger = undefined;
let Er = undefined;
let rice = undefined;
let kc = undefined;
let bacon = undefined;
let Thai = undefined;
let textTri = undefined;
let textRaptor = undefined;
let textPter = undefined;
let detect = 0
let orthoCamera, orthoScene, logoMesh, grassMesh, crabMesh, egretMesh;
let count = 1
let dierction = 1
const initialState = {
  pageState: PageState.Loading,
  isArModeOn: false,
  modelData: undefined,
  arLib: undefined,
  musicStarted: false,
  playAuth: false,
  detect: 0,
  targetFind: false,
  imageData: undefined,
  videoData: undefined,
  lastPage: undefined,
  helpPop: true,
  target: undefined
}
export const AppState = {
  state: {
    ...initialState
  },
  reducers: {
    changePageState: (state, payload) => {
      return { ...state, pageState: payload }
    },
    changeTarget: (state, payload) => {
      return { ...state, target: payload }
    },
    setModelData: (state, payload) => {
      return { ...state, modelData: payload }
    },
    setArLib: (state, payload) => {
      return { ...state, arLib: payload }
    },
    setTargetFind: (state, payload) => {
      return { ...state, payload }
    },
    setIsArModeOn: (state, payload) => {
      return { ...state, isArModeOn: payload }
    },
    setImageData: (state, payload) => {
      return { ...state, imageData: payload }
    },
    setVideoData: (state, payload) => {
      return { ...state, videoData: payload }
    },
    setLastPage: (state, payload) => {
      return { ...state, lastPage: payload }
    },
    setHelpPop: (state, payload) => {
      return { ...state, helpPop: payload }
    },
    setMusicStarted: (state, payload) => {
      return { ...state, musicStarted: payload }
    },
    setDetect: (state, payload) => {
      detect = payload
      return { ...state, detect: payload }
    },
    setPlayAuth: (state, payload) => {
      return { ...state, playAuth: payload }
    },
    setReset: () => {
      modelData = undefined;
      burger = undefined;
      drinks = undefined;
      rice = undefined;
      bacon = undefined;
      orthoCamera = undefined
      orthoScene = undefined
      logoMesh = undefined
      grassMesh = undefined
      crabMesh = undefined
      egretMesh = undefined
      count = 1
      dierction = 1
      return { ...initialState }
    }
  },
  effects: (dispatch) => ({

    async loadModelFile(reload) {
      //先建立一個mindar物件
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


      const { renderer, scene, camera } = arLib;
      //這個部分只是解釋一下如何宣告出我們前面引入的物件
      //先用compiler把圖片上傳轉換 https://hiukim.github.io/mind-ar-js-doc/tools/compile
      //依照順序把對照物設定好
      const anchor = arLib.addAnchor(0);
      const anchorSec = arLib.addAnchor(1);
      const anchorThird = arLib.addAnchor(2);
      modelData = anchor.group;

      //發現物件要做甚麼事情
      function changeState(value) {
        dispatch.AppState.setDetect(value)
        dispatch.AppState.setHelpPop(false);
        dispatch.AppState.setMusicStarted(true);
      }
      //依照順序把要做的事情設定好
      for (let i = 0; i < 13; i++) {
        arLib.addAnchor(i).onTargetFound = async () => {
          dispatch.AppState.setModelData(arLib.addAnchor(i).group)
          changeState(i + 1)
        }
        arLib.addAnchor(i).onTargetLost = async () => {
          dispatch.AppState.setDetect(0)
          dispatch.AppState.setMusicStarted(false)
          dispatch.AppState.setHelpPop(true);
        }
      }

      const loader = new GLTFLoader()
      
      Promise.all([
        //下載場景檔
        fetch("/model/meals_drinks.json").then(result => result.json()),
        fetch("/model/meals_jburger.json").then(result => result.json()),
        fetch("/model/meals_er.json").then(result => result.json()),
        fetch("/model/meals_stewed_rice.json").then(result => result.json()),
        fetch("/model/meals_kc.json").then(result => result.json()),
        fetch("/model/meals_beb.json").then(result => result.json()),
        fetch("/model/meals_thai.json").then(result => result.json()),
        fetch("/model/container_triceratops.json").then(result => result.json()),
        fetch("/model/container_raptor.json").then(result => result.json()),
        fetch("/model/container_pterodactyl.json").then(result => result.json()),
        fetch("/model/billboard_drinks.json").then(result => result.json()),
        fetch("/model/billboard_jburger.json").then(result => result.json()),
        fetch("/model/billboard_er.json").then(result => result.json()),
        fetch("/model/billboard_stewed_rice.json").then(result => result.json()),
        fetch("/model/billboard_kc.json").then(result => result.json()),
        fetch("/model/billboard_beb.json").then(result => result.json()),
        fetch("/model/billboard_thai.json").then(result => result.json()),
        arLib.start()
      ]).then(([arDrinks, arJBurger, arEr, arStewedRice, arKC, arBeb, arThai,arDinoTri, arDinoRaptor, arDinoPter, boardDrinks, boardJBuger, boardEr, boardStewedRice, boardKC, boardBeb,boardThai, arLibResult]) => {

        //設置攝影機的畫面
        connectWebCam(arLib)
        arLib.camera2D = orthoCamera
        arLib.scene2D = orthoScene

        //設置3D場景
        if (reload === false) {
          setScene(arLib.addAnchor(3).group, scene, arStewedRice, () => {
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.shadowMap.needsUpdate = true;

          }, boardStewedRice)
          setScene(anchorSec.group, scene, arJBurger, () => {
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.shadowMap.needsUpdate = true;
          }, boardJBuger)
          setScene(anchor.group, scene, arDrinks, () => {
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.shadowMap.needsUpdate = true;

          }, boardDrinks)
          setScene(anchorThird.group, scene, arEr, () => {
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.shadowMap.needsUpdate = true;
          }, boardEr)
          setScene(arLib.addAnchor(4).group, scene, arKC, () => {
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.shadowMap.needsUpdate = true;

          }, boardKC)
          setScene(arLib.addAnchor(5).group, scene, arBeb, () => {
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.shadowMap.needsUpdate = true;
          }, boardBeb)
          setScene(arLib.addAnchor(8).group, scene, arThai, () => {
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.shadowMap.needsUpdate = true;
          }, boardThai)
          setScene(arLib.addAnchor(11).group, scene, arDinoTri, () => {
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.shadowMap.needsUpdate = true;
          })
          // console.log(detect)
          setScene(arLib.addAnchor(12).group, scene, arDinoRaptor, () => {
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.shadowMap.needsUpdate = true;
            //loop是每一禎去畫的事情,轉圈和外框的繪製都是靠這邊
            renderer.setAnimationLoop(() => {
              renderer.autoClear = false;
              camera.layers.set(2);
              renderer.render(scene, camera);
              camera.layers.set(0);
              renderer.render(scene, camera);
              renderer.autoClear = false; // 防止在渲染2D场景前清除现有的渲染
              if (orthoCamera && orthoScene) {
                renderer.render(orthoScene, orthoCamera);

              }
              let mixerUpdateDelta = clock.getDelta();
              Object.keys(mixer).forEach(name => {
                mixer[name].update(mixerUpdateDelta)
              })
              // console.log('drinks',drinks)
              // console.log('rice',rice)
              if (drinks && detect ===1) {
                // drinks.rotation.x += 2
                drinks.rotation.y += 0.01;
                drinks.rotation.y %= Math.PI * 2;
                // drinks.rotation.y = Math.max(drinks.rotation.y, -Math.PI / 2);
              }
              if (rice && detect ===4) {
                // rice.rotation.x += 2
                rice.rotation.y += 0.01;
                rice.rotation.y %= Math.PI * 2;
                // rice.rotation.y = Math.max(rice.rotation.y, -Math.PI / 2);
              }
              if (burger && detect ===2) {
                burger.rotation.y += 0.02;
                burger.rotation.y %= Math.PI * 2;
              }
              if (bacon && detect ===6) {
                bacon.rotation.y += 0.01;
                bacon.rotation.y %= Math.PI * 2;
              }
              if (kc  && detect ===5) {
                kc.rotation.y += 0.01;
                kc.rotation.y %= Math.PI * 2;
              }
              if (Er && detect ===3) {
                Er.rotation.y += 0.01;
                Er.rotation.y %= Math.PI * 2;
              }
              if (Thai && detect ===9) {
                Thai.rotation.y += 0.01;
                Thai.rotation.y %= Math.PI * 2;
              }
              //外面設定一個參數紀錄時間
              //direction 來設定現在是要變大變小或是往上往下
              count += 1 * dierction
              if (crabMesh && egretMesh) {
                //設定參數
                crabMesh.position.y += 0.8 * dierction
                egretMesh.scale.y += 0.0015 * dierction
                egretMesh.scale.x += 0.0015 * dierction
                egretMesh.scale.z += 0.0015 * dierction
              }
              switch(detect) {
                case 13 :
                  textRaptor.visible = true;
                  break;
                case 12 :
                  textTri.visible = true;
                  break;
                case 14 :
                  textPter.visible = true;
                  break;
                default:
                  textTri.visible = false;
                  textRaptor.visible = false;
                  textPter.visible = false;
                  break;
              }
            
              //峰值設定
              if (count === 50 || count > 50) {
                dierction = -1

              }
              if (count === 0 || count < 0) {
                dierction = 1
              }


            });
          })
          setScene(arLib.addAnchor(13).group, scene, arDinoPter, () => {
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.shadowMap.needsUpdate = true;

          })
        }





        dispatch.AppState.changePageState(PageState.ARView);
        dispatch.AppState.setArLib(arLib);
        dispatch.AppState.setIsArModeOn(true)
      }).catch((e) => {
      });
    },
    setImage(imageData) {
      dispatch.AppState.setImageData(imageData);
      dispatch.AppState.changePageState(PageState.ViewPhoto);
      dispatch.AppState.setLastPage(PageState.ViewPhoto);
    },
    setVideo(videoData) {
      dispatch.AppState.setVideoData(videoData);
      dispatch.AppState.changePageState(PageState.ViewVideo);
      dispatch.AppState.setLastPage(PageState.ViewVideo);
    },
    showDiscard() {
      dispatch.AppState.changePageState(PageState.Discard);
    }

  })
}


//設置攝影機的畫面
function connectWebCam(mindarThree) {
  const { video, scene } = mindarThree;
  video.style.opacity = 0;
  //建立影像圖層
  let videoTex = new THREE.VideoTexture(video);
  videoTex.encoding = THREE.sRGBEncoding;
  videoTex.minFilter = THREE.LinearFilter;
  videoTex.maxFilter = THREE.LinearFilter;
  // requestMicrophonePermission(true)
  //建立 mesh
  const mesh = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(video.clientWidth + 200, video.clientHeight),
    new THREE.MeshBasicMaterial({ color: 0xffffff, map: videoTex, side: THREE.DoubleSide })
  );

  //設定大小及位置
  let scale = 12.5;
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
    const logoMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true, toneMapped: false });
    logoMesh = new THREE.Mesh(logoGeometry, logoMaterial);
    if (window.innerWidth > 600) {
      logoMesh.scale.set(0.22 * window.innerWidth / texture.image.width, 0.22 * window.innerWidth / texture.image.width, 0.22 * window.innerWidth / texture.image.width)
      // 调整位置以放置在左上角
      // 半張logo寬度 = texture.image.width * 0.3 *window.innerWidth / texture.image.wid /2
      logoMesh.position.set(texture.image.width * 0.2 * window.innerWidth / texture.image.width / 2 + 0.1 * window.innerWidth, window.innerHeight * 0.95, 1);
    } else {
      logoMesh.scale.set(0.3 * window.innerWidth / texture.image.width, 0.3 * window.innerWidth / texture.image.width, 0.3 * window.innerWidth / texture.image.width)
      // 调整位置以放置在左上角
      logoMesh.position.set(window.innerWidth / 4 - 0, window.innerHeight - 50, 1);
    }
    orthoScene.add(logoMesh);
  });
  // 加载grass并添加到2D场景
  loader.load('/image/Grass.png', (texture) => {

    const grassGeometry = new THREE.PlaneGeometry(texture.image.width, texture.image.height);
    const grassMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true, toneMapped: false });

    grassMesh = new THREE.Mesh(grassGeometry, grassMaterial);
    // 設定大小
    grassMesh.scale.set(1 * window.innerWidth / texture.image.width, 1 * window.innerWidth / texture.image.width, 1 * window.innerWidth / texture.image.width)
    // 调整位置以放置在左上角
    grassMesh.position.set(window.innerWidth / 2, texture.image.height * window.innerWidth / texture.image.width / 2, 2);
    //新增到2D場景
    orthoScene.add(grassMesh);
  });

  // 加载crab并添加到2D场景
  loader.load('/image/crab.png', (texture) => {
    const crabGeometry = new THREE.PlaneGeometry(texture.image.width, texture.image.height);
    const crabMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    crabMesh = new THREE.Mesh(crabGeometry, crabMaterial);

    // 設定大小
    crabMesh.scale.set(0.18 * window.innerWidth / texture.image.width, 0.18 * window.innerWidth / texture.image.width, 0.18 * window.innerWidth / texture.image.width)
    // 调整位置以放置在右下角,草的原始高度是387
    crabMesh.position.set(window.innerWidth - texture.image.width * 0.18 * 1.5, window.innerWidth / 1444 * texture.image.height, 2);
    //新增到2D場景
    orthoScene.add(crabMesh);


  });

  // 加载egret并添加到2D场景
  loader.load('/image/egret.png', (texture) => {
    const egretGeometry = new THREE.PlaneGeometry(texture.image.width, texture.image.height);
    const egretMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    egretMesh = new THREE.Mesh(egretGeometry, egretMaterial);

    // 設定大小
    egretMesh.scale.set(0.15 * window.innerWidth / texture.image.width, 0.15 * window.innerWidth / texture.image.width, 0.15 * window.innerWidth / texture.image.width)
    // 调整位置以放置在右下角,草的原始高度是387
    egretMesh.position.set(texture.image.width * 0.18 + window.innerWidth * 0.05, window.innerWidth / 1444 * texture.image.height / 2, 1);
    //新增到2D場景
    orthoScene.add(egretMesh);
  });

  loader.load('/image/textForTri.png', (texture) => {
    const egretGeometry = new THREE.PlaneGeometry(texture.image.width, texture.image.height);
    const egretMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    textTri = new THREE.Mesh(egretGeometry, egretMaterial);
    textTri.visible = false;

    // 設定大小
    textTri.scale.set(0.5 * window.innerWidth / texture.image.width, 0.5 * window.innerWidth / texture.image.width, 0.5 * window.innerWidth / texture.image.width)
    // 调整位置以放置在右下角,草的原始高度是387
    textTri.position.set(window.innerWidth / 3 * 2 , window.innerHeight / 4, 3);
    //新增到2D場景
    orthoScene.add(textTri);
  });
  loader.load('/image/textForPter.png', (texture) => {
    const egretGeometry = new THREE.PlaneGeometry(texture.image.width, texture.image.height);
    const egretMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    textPter = new THREE.Mesh(egretGeometry, egretMaterial);
    textPter.visible = false;

    // 設定大小
    textPter.scale.set(0.5 * window.innerWidth / texture.image.width, 0.5 * window.innerWidth / texture.image.width, 0.5 * window.innerWidth / texture.image.width)
    // 调整位置以放置在右下角,草的原始高度是387
    textPter.position.set(window.innerWidth / 3 * 2 , window.innerHeight / 4, 3);
    //新增到2D場景
    orthoScene.add(textPter);
  });
  loader.load('/image/textForRaptor.png', (texture) => {
    const egretGeometry = new THREE.PlaneGeometry(texture.image.width, texture.image.height);
    const egretMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    textRaptor = new THREE.Mesh(egretGeometry, egretMaterial);
    textRaptor.visible = false;

    // 設定大小
    textRaptor.scale.set(0.5 * window.innerWidth / texture.image.width, 0.5 * window.innerWidth / texture.image.width, 0.5 * window.innerWidth / texture.image.width)
    // 调整位置以放置在右下角,草的原始高度是387
    textRaptor.position.set(window.innerWidth / 3 * 2 , window.innerHeight / 4, 3);
    //新增到2D場景
    orthoScene.add(textRaptor);
  });
}
//麥克風權限
export function requestMicrophonePermission(value) {
  navigator.mediaDevices.getUserMedia({ audio: value })
    .then(function (stream) {

      // 麦克风权限已授予 
    })
    .catch(function (err) {
      console.error('Failed to get microphone permission', err);
    });
}

//設置場景
async function setScene(anchorGroup, scene, sceneData, callback, board) {
  const loader = new THREE.ObjectLoader();
  //打場景資料轉成 ThreeJS場景資訊

  const obj = await loader.parseAsync(sceneData.scene ? sceneData.scene : sceneData.Scene);


  // console.log(scene)
  //設置環境貼圖
  if (obj.environment !== null) {
    scene.environment = obj.environment;
  }

  //設置主物件的父層級並把ThreeJS場景資訊放入
  const modelObject = new THREE.Object3D();
  modelObject.add(obj);
  if (board) {
    const objB = await loader.parseAsync(board ? board.scene : undefined);
    modelObject.add(objB)

  }

  modelObject.scale.set(0.5, 0.5, 0.5);
  modelObject.position.x = -0.2
  modelObject.position.y = -0.13
  anchorGroup.add(modelObject);
  //掃描ThreeJS的物件並做處理
  modelObject.traverse((item) => {
    //檢查是否是燈光並把燈放到場景層下而不是跟隨物件
    if (item.isLight) {
      item.parent = scene
    }


    //這邊的名字都是跟美術團隊溝通好,利用excel統一名稱
    //引入進來後,把對應變數配對
    if (item.name === `rotation_drinks`) {
      drinks = item;
    }
    if (item.name === `rotation_jburger`) {
      burger = item
    }
    if (item.name === `rotation_stewed_rice`) {
      rice = item
    }
    if (item.name === `rotation_beb`) {
      bacon = item
    }
    if (item.name === `rotation_kc`) {
      kc = item
    }
    if (item.name === `rotation_er`) {
      Er = item
    }
    if (item.name === `rotation_thai`) {
      Thai = item
    }
    // 呼叫美術做好的動畫名稱
    if (item.name === 'billboard_drinks.glb' || item.name === 'billboard_jburger.glb' || item.name === 'billboard_er.glb' || 
    item.name === 'billboard_stewed_rice.glb' || item.name === 'billboard_kc.glb' || item.name === 'billboard_kc.glb' ||
    item.name === `group_container_triceratops` || item.name === `group_container_raptor` || item.name === `group_container_pterodactyl`) {
      let animations = item.animations;
      animations.forEach(animation => {
        //因為美術的動畫名稱都一樣,所以添加物件名稱
        //不然最終只會讓一個被呼叫到,這不是我們要的
        let animationName = animation.name + item.name
        mixer[animationName] = new THREE.AnimationMixer(item);
        animationList[animationName] = mixer[animationName].clipAction(animation);
        animationList[animationName].clampWhenFinished = true;
        animationList[animationName].setLoop(THREE.LoopOnce);
        animationList[animationName].play();
      });
    }
  });
  callback();
}
