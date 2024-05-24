import * as THREE from "three";
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

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
let beer = undefined;
let hotPot = undefined;
let textTri = undefined;
let textRaptor = undefined;
let textPter = undefined;
//宣告恐龍,因為恐龍比較複雜,美術將動畫拆成恐龍本身加上柵欄
//然後動畫又需要在掃瞄到目標圖片的時候才開始跑動畫
let DinoPter = new Object();
let DinoTri = new Object();
let DinoRaptor = new Object();
let detect = 0
let orthoCamera, orthoScene, logoMesh, grassMesh, crabMesh, egretMesh
let textureBlue, textureRed, textureYellow
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


let containerSetup = {
 widedRight:{
  wide:{
    position:{
      x: -0.195,
      y:0.004,
      z: 0
    },
    scale:{
      x: 3.010,
      y: 3.070,
      z: 3.66
    }
  },
  narrow:{
    position:{
      x: -0.610,
      y: 0.016,
      z: -0.164
    },
    rotation:{
      y:0
    },
    scale:{
      x:1,
      y:1,
      z:1
    }
  }
 },
 widedLeft:{
  wide:{
    position:{
      x: 0.860,
      y:0.004,
      z: 0
    },
    scale:{
      x: 3.010,
      y: 3.070,
      z: 3.66
    }
  },
  narrow:{
    position:{
      x: -0.610,
      y: 0.016,
      z: -0.164
    },
    rotation:{
      y:0
    },
    scale:{
      x:1,
      y:1,
      z:1
    }
  }
 },
 narrow:{
  wide:{
    position:{
      x: -0.195,
      y:0.004,
      z: 0
    },
    scale:{
      x: 3.690,
      y: 3.070,
      z: 3.020
    }
  },
  narrow:{
    position:{
      x: 0.153,
      y: -0.129,
      z: 0
    },
    rotation:{
      y:Math.PI / 2
    },
    scale:{
      x:2,
      y:2,
      z:2
    }
  }
 }
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

      orthoCamera = undefined
      orthoScene = undefined
      logoMesh = undefined
      grassMesh = undefined
      crabMesh = undefined
      egretMesh = undefined
      count = 1
      dierction = 1
      drinks = undefined;
      burger = undefined;
      Er = undefined;
      rice = undefined;
      kc = undefined;
      bacon = undefined;
      Thai = undefined;
      beer = undefined;
      hotPot = undefined;
      textTri = undefined;
      textRaptor = undefined;
      textPter = undefined;
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
      camera.updateProjectionMatrix();



      //這個部分只是解釋一下如何宣告出我們前面引入的物件
      //先用compiler把圖片上傳轉換 https://hiukim.github.io/mind-ar-js-doc/tools/compile
      //依照順序把對照物設定好

      modelData = arLib.addAnchor(0).group;

      //發現物件要做甚麼事情
      function changeState(value) {
        dispatch.AppState.setDetect(value)
        dispatch.AppState.setHelpPop(false);
        dispatch.AppState.setMusicStarted(true);
      }
      //依照順序把要做的事情設定好
      for (let i = 0; i < 20; i++) {
        arLib.addAnchor(i).onTargetFound = async () => {
          dispatch.AppState.setModelData(arLib.addAnchor(i).group)
          changeState(i + 1)
          arLib.detect = i + 1
          //依序把每個恐龍物件裡面從好的動畫名稱,對應到animationList裡面,一一撥放
          if(DinoPter.animations && DinoRaptor.animations && DinoTri.animations){
            switch (i) {
              case 11:
              case 14:
                DinoTri.animations.forEach(an => {
                  animationList[an].play()
                })
                DinoTri.box.material.map = textureYellow
                handleDino(i, DinoTri)
                arLib.addAnchor(i).group.add(DinoTri.modelObject)
                break;
              case 12:
              case 15:
                DinoRaptor.animations.forEach(an => {
                +  animationList[an].play()
                })
                handleDino(i, DinoRaptor)
                DinoRaptor.box.material.map = textureBlue
                arLib.addAnchor(i).group.add(DinoRaptor.modelObject)
                break;
              case 13:
              case 16:
                DinoPter.animations.forEach(an => {
                  animationList[an].play()
                })
                handleDino(i, DinoPter)
                arLib.addAnchor(i).group.add(DinoPter.modelObject)
                break;
            }
          }
          
          // let show = new Dino(DinoRaptor)
          // show.changeToNarrow()
        }
        //*這邊處理各種轉向和位置
        function handleDino(anchorNum, Dino) {
          console.log(Dino)
          let wp = Dino.nodeWide.initialPosition
          let np = Dino.nodeNarrow.initialPosition
          let wpc = Dino.nodeWideContainer.initialPosition
          let npc = Dino.nodeNarrowContainer.initialPosition
          let wsc = Dino.nodeWideContainer.initialScale
          let nsc = Dino.nodeNarrowContainer.initialScale
          switch (anchorNum) {
            // * 短邊的恐龍

            case 11:
            case 12:
            case 13:
              Dino.nodeWide.position.set(wp.x,wp.y,wp.z)
              Dino.nodeWide.rotation.y = Dino.nodeWide.initialRotation.y;
              Dino.nodeNarrow.position.set(0,0,0)
              Dino.nodeNarrow.rotation.y = Math.PI / 2;
              Dino.nodeNarrowContainer.position.set(npc.x,npc.y,npc.z)
              Dino.nodeNarrowContainer.rotation.y = Dino.nodeNarrowContainer.initialRotation.y;
              Dino.nodeNarrowContainer.scale.set(nsc.x,nsc.y,nsc.z);
              Dino.nodeWideContainer.position.set(wpc.x,wpc.y,wpc.z)
              Dino.nodeWideContainer.rotation.y = Dino.nodeWideContainer.initialRotation.y;
              Dino.nodeWideContainer.scale.set(wsc.x,wsc.y,wsc.z);
              break;
             // * 長邊的恐龍
            case 14:
              Dino.nodeWide.position.set(0,0,0)
              Dino.nodeNarrow.position.set(np.x,np.y,np.z)
              Dino.nodeNarrow.rotation.y = Dino.nodeNarrow.initialRotation.y;
              let NarrowLPosition = containerSetup.widedLeft.narrow.position
              let NarrowLScale = containerSetup.widedLeft.narrow.scale
              Dino.nodeNarrowContainer.position.set(NarrowLPosition.x,NarrowLPosition.y,NarrowLPosition.z)
              Dino.nodeNarrowContainer.rotation.y =  containerSetup.widedLeft.narrow.rotation.y;
              Dino.nodeNarrowContainer.scale.set(NarrowLScale.x,NarrowLScale.y,NarrowLScale.z)
              let WideLPosition = containerSetup.widedLeft.wide.position
              let WideLScale = containerSetup.widedLeft.wide.scale
              Dino.nodeWideContainer.position.set(WideLPosition.x,WideLPosition.y,WideLPosition.z)
              Dino.nodeWideContainer.scale.set(WideLScale.x,WideLScale.y,WideLScale.z)
              break;
            case 15:
            case 16:
              Dino.nodeWide.position.set(0,0,0)
              Dino.nodeNarrow.position.set(np.x,np.y,np.z)
              Dino.nodeNarrow.rotation.y = Dino.nodeNarrow.initialRotation.y;
              let NarrowPosition = containerSetup.widedRight.narrow.position
              let NarrowScale = containerSetup.widedRight.narrow.scale
              Dino.nodeNarrowContainer.position.set(NarrowPosition.x,NarrowPosition.y,NarrowPosition.z)
              Dino.nodeNarrowContainer.rotation.y =  containerSetup.widedRight.narrow.rotation.y;
              Dino.nodeNarrowContainer.scale.set(NarrowScale.x,NarrowScale.y,NarrowScale.z)
              let WidePosition = containerSetup.widedRight.wide.position
              let WideScale = containerSetup.widedRight.wide.scale
              Dino.nodeWideContainer.position.set(WidePosition.x,WidePosition.y,WidePosition.z)
              Dino.nodeWideContainer.scale.set(WideScale.x,WideScale.y,WideScale.z)
              // modelObject.position.x = -0.2;
              break;
            default:
              // modelObject.position.x = 0;
              // modelObject.rotation.y = 0;
              break;
          }
        }
        arLib.addAnchor(i).onTargetLost = async () => {
          dispatch.AppState.setDetect(0)
          arLib.detect = 0
          dispatch.AppState.setMusicStarted(false)
          dispatch.AppState.setHelpPop(true);

          //設定好每個恐龍掃版結束後,要把板子回復,動畫結束
          switch (i) {
            case 11:
            case 14:
              handleDino(0, DinoTri)
              DinoTri.animations.forEach(an => {
                animationList[an].stop()
                DinoTri.door1.visible = true
                DinoTri.door2.visible = true
              })
              break;
            case 12:
            case 15:
              handleDino(0, DinoRaptor)
              DinoRaptor.animations.forEach(an => {
                animationList[an].stop()
                DinoRaptor.door1.visible = true
                DinoRaptor.door2.visible = true
              })
              break;
            case 13:
            case 16:
              handleDino(0, DinoPter)
              DinoPter.animations.forEach(an => {
                animationList[an].stop()
                DinoPter.door1.visible = true
                DinoPter.door2.visible = true
              })
              break;
          }
        }
      }

      //載入箱子顏色的環境貼圖
      textureLoaders()

      //載入JSON場景檔
      Promise.all([
        fetch("/model/testAN.json").then(result => result.json()),
        fetch("/model/meals_drinks.json").then(result => result.json()),
        fetch("/model/meals_jburger.json").then(result => result.json()),
        fetch("/model/meals_er.json").then(result => result.json()),
        fetch("/model/meals_stewed_rice.json").then(result => result.json()),
        fetch("/model/meals_kc.json").then(result => result.json()),
        fetch("/model/meals_beb.json").then(result => result.json()),
        fetch("/model/meals_thai.json").then(result => result.json()),
        fetch("/model/meals_beer.json").then(result => result.json()),
        fetch("/model/meals_hot_pot.json").then(result => result.json()),
        fetch("/model/triceratops.json").then(result => result.json()),
        fetch("/model/raptor.json").then(result => result.json()),
        fetch("/model/pterodactyl.json").then(result => result.json()),
        fetch("/model/billboard_drinks.json").then(result => result.json()),
        fetch("/model/billboard_jburger.json").then(result => result.json()),
        fetch("/model/billboard_er.json").then(result => result.json()),
        fetch("/model/billboard_stewed_rice.json").then(result => result.json()),
        fetch("/model/billboard_kc.json").then(result => result.json()),
        fetch("/model/billboard_beb.json").then(result => result.json()),
        fetch("/model/billboard_thai.json").then(result => result.json()),
        fetch("/model/billboard_beer.json").then(result => result.json()),
        fetch("/model/billboard_hot_pot.json").then(result => result.json()),
        fetch("/model/container2.json").then(result => result.json()),
        arLib.start()
      ]).then(async ([arTest,arDrinks, arJBurger, arEr, arStewedRice, arKC, arBeb, arThai, arBeer, arHotPot, arDinoTri, arDinoRaptor, arDinoPter, boardDrinks, boardJBuger, boardEr, boardStewedRice, boardKC, boardBeb, boardThai, boardBeer, boardHotPot, arContainer, arLibResult]) => {

        // * 設置攝影機的畫面
        connectWebCam(arLib)
        arLib.camera2D = orthoCamera
        arLib.scene2D = orthoScene





        // * 設定物件名稱,讓函式可以判斷名稱
        arDinoPter.name = 'Pter'
        arDinoTri.name = 'Tri'
        arDinoRaptor.name = 'Raptor'

        // * 設置3D場景
        arStewedRice.name = 'StewedRice'

        setScene(arLib.addAnchor(3), scene, arStewedRice, () => {
          renderer.shadowMap.enabled = true;
          renderer.shadowMap.type = THREE.PCFSoftShadowMap;
          renderer.shadowMap.needsUpdate = true;

        }, boardStewedRice)
        setScene(arLib.addAnchor(1), scene, arJBurger, () => {
          renderer.shadowMap.enabled = true;
          renderer.shadowMap.type = THREE.PCFSoftShadowMap;
          renderer.shadowMap.needsUpdate = true;
        }, boardJBuger)


        arDrinks.name = 'Drinks'
        arDrinks.scene.name = 'Drinks'
        setScene(arLib.addAnchor(0), scene, arDrinks, () => {
          renderer.shadowMap.enabled = true;
          renderer.shadowMap.type = THREE.PCFSoftShadowMap;
          renderer.shadowMap.needsUpdate = true;

        }, boardDrinks)
        setScene(arLib.addAnchor(2), scene, arEr, () => {
          renderer.shadowMap.enabled = true;
          renderer.shadowMap.type = THREE.PCFSoftShadowMap;
          renderer.shadowMap.needsUpdate = true;
        }, boardEr)
        setScene(arLib.addAnchor(4), scene, arKC, () => {
          renderer.shadowMap.enabled = true;
          renderer.shadowMap.type = THREE.PCFSoftShadowMap;
          renderer.shadowMap.needsUpdate = true;

        }, boardKC)
        setScene(arLib.addAnchor(5), scene, arBeb, () => {
          renderer.shadowMap.enabled = true;
          renderer.shadowMap.type = THREE.PCFSoftShadowMap;
          renderer.shadowMap.needsUpdate = true;
        }, boardBeb)
        setScene(arLib.addAnchor(8), scene, arThai, () => {
          renderer.shadowMap.enabled = true;
          renderer.shadowMap.type = THREE.PCFSoftShadowMap;
          renderer.shadowMap.needsUpdate = true;
        }, boardThai)
        setScene(arLib.addAnchor(7), scene, arHotPot, () => {
          renderer.shadowMap.enabled = true;
          renderer.shadowMap.type = THREE.PCFSoftShadowMap;
          renderer.shadowMap.needsUpdate = true;
        }, boardHotPot)
        setScene(arLib.addAnchor(9), scene, arBeer, () => {
          renderer.shadowMap.enabled = true;
          renderer.shadowMap.type = THREE.PCFSoftShadowMap;
          renderer.shadowMap.needsUpdate = true;
        }, boardBeer)
        let TriArray = [arLib.addAnchor(11), arLib.addAnchor(14), ]
        setDionScene(TriArray, scene, arDinoTri, arContainer, () => { 
          renderer.shadowMap.enabled = true;
          renderer.shadowMap.type = THREE.PCFSoftShadowMap;
          renderer.shadowMap.needsUpdate = true;
          if(DinoTri.Dino && DinoRaptor.Dino && DinoPter.Dino){
            dispatch.AppState.changePageState(PageState.ARView);
            // console.log(DinoPter,DinoRaptor,DinoTri)
            dispatch.AppState.setIsArModeOn(true)
            dispatch.AppState.setArLib(arLib);
          }
        },arTest)
        let RaptorArray = [arLib.addAnchor(12), arLib.addAnchor(15)]
        setDionScene(RaptorArray, scene, arDinoRaptor, arContainer, () => {
          renderer.shadowMap.enabled = true;
          renderer.shadowMap.type = THREE.PCFSoftShadowMap;
          renderer.shadowMap.needsUpdate = true;
          if(DinoTri.Dino && DinoRaptor.Dino && DinoPter.Dino){
            dispatch.AppState.changePageState(PageState.ARView);
            // console.log(DinoPter,DinoRaptor,DinoTri)
            dispatch.AppState.setIsArModeOn(true)
            dispatch.AppState.setArLib(arLib);
          }
        },arTest)
        let Pterrray = [arLib.addAnchor(13), arLib.addAnchor(16)]
        setDionScene(Pterrray, scene, arDinoPter, arContainer, () => {
          renderer.shadowMap.enabled = true;
          renderer.shadowMap.type = THREE.PCFSoftShadowMap;
          renderer.shadowMap.needsUpdate = true;
          if(DinoTri.Dino && DinoRaptor.Dino && DinoPter.Dino){
            dispatch.AppState.changePageState(PageState.ARView);
            // console.log(DinoPter,DinoRaptor,DinoTri)
            dispatch.AppState.setIsArModeOn(true)
            dispatch.AppState.setArLib(arLib);
          }
       
        },arTest)


        //* loop是每一禎去畫的事情,轉圈和外框的繪製都是靠這邊
        renderer.setAnimationLoop(() => {
          renderer.autoClear = false;



          //!有掃到物件
          if (detect > 0) {
            //! 渲染出對應layer
            console.log(detect)
            switch (detect) {
              case 12:
              case 15:
                camera.layers.set(12);
                break;
              case 13:
              case 16:
                camera.layers.set(13);
                break;
              case 14:
              case 17:
                camera.layers.set(14);
                break;
              default:
                camera.layers.set(detect);
            }

            renderer.render(scene, camera);
          }
          // renderer.autoClear = false; // 防止在渲染2D场景前清除现有的渲染
          if (orthoCamera && orthoScene) {
            // * 畫出2D場景(視訊畫面)
            orthoCamera.layers.set(20);
            renderer.render(scene, orthoCamera);
            // * 畫出2D場景(圖框)
            orthoCamera.layers.set(0);
            renderer.render(orthoScene, orthoCamera);
          }
          // orCamera.layers.set(0)
          // renderer.render(orScene, orCamera);
          let mixerUpdateDelta = clock.getDelta();

          Object.keys(mixer).forEach(name => {
            mixer[name].update(mixerUpdateDelta)
          })
          if (drinks && detect === 1) {
            // drinks.rotation.x += 2
            drinks.rotation.y += 0.01;
            drinks.rotation.y %= Math.PI * 2;
            // drinks.rotation.y = Math.max(drinks.rotation.y, -Math.PI / 2);
          }
          if (rice && detect === 4) {
            // rice.rotation.x += 2
            rice.rotation.y += 0.01;
            rice.rotation.y %= Math.PI * 2;
            // rice.rotation.y = Math.max(rice.rotation.y, -Math.PI / 2);
          }
          if (burger && detect === 2) {
            burger.rotation.y += 0.02;
            burger.rotation.y %= Math.PI * 2;
          }
          if (bacon && detect === 6) {
            bacon.rotation.y += 0.01;
            bacon.rotation.y %= Math.PI * 2;
          }
          if (kc && detect === 5) {
            kc.rotation.y += 0.01;
            kc.rotation.y %= Math.PI * 2;
          }
          if (Er && detect === 3) {
            Er.rotation.y += 0.01;
            Er.rotation.y %= Math.PI * 2;
          }
          if (Thai && detect === 9) {
            Thai.rotation.y += 0.01;
            Thai.rotation.y %= Math.PI * 2;
          }
          if (hotPot && detect === 8) {
            hotPot.rotation.y += 0.01;
            hotPot.rotation.y %= Math.PI * 2;
          }
          if (beer && detect === 10) {
            beer.rotation.y += 0.01;
            beer.rotation.y %= Math.PI * 2;
          }

          //* 需要這個reload的參數是因為,假如跳出視窗重新載入的話,count += 1 功能會疊加兩次
          //* 動畫會變得超級快
          if (crabMesh && egretMesh && !reload) {
            //外面設定一個參數紀錄時間
            //direction 來設定現在是要變大變小或是往上往下
            count += 1 * dierction
            //設定參數
            crabMesh.position.y += 0.8 * dierction
            egretMesh.scale.y += 0.0015 * dierction
            egretMesh.scale.x += 0.0015 * dierction
            egretMesh.scale.z += 0.0015 * dierction
          }
          if (textPter && textRaptor && textTri) {
            switch (detect) {
              case 13:
              case 16:
                textRaptor.visible = true;
                break;
              case 12:
              case 15:
                textTri.visible = true;
                break;
              case 17:
              case 14:
                textPter.visible = true;
                break;
              default:
                textTri.visible = false;
                textRaptor.visible = false;
                textPter.visible = false;
                break;
            }
          }


          //峰值設定
          if (count === 50 || count > 50) {
            dierction = -1

          }
          if (count === 0 || count < 0) {
            dierction = 1
          }


        });
   
     
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
  let ratio = video.width / video.height

  const mesh = new THREE.Mesh(
    // new THREE.PlaneBufferGeometry(video.clientWidth  , video.clientHeight),
    new THREE.PlaneGeometry(video.width, video.height),
    new THREE.MeshBasicMaterial({ color: 0xffffff, map: videoTex, side: THREE.DoubleSide })
  );


  //設定大小及位置
  let scale = video.clientHeight / video.height
  let position_y = 0;
  mesh.renderOrder = 2
  // console.log(video.width, video.height)
  // console.log(window.innerWidth, window.innerHeight)
  // console.log(video.clientWidth, video.clientHeight)


  // alert(`vider:${video.clientHeight}/${video.clientWidth} window:${window.innerHeight},${window.innerWidth}`)
  mesh.position.set(video.clientWidth / 2, video.clientHeight / 2, -99.8);
  mesh.scale.set(scale, scale, 1);
  mesh.layers.set(20);
  mesh.layers.enable(20);
  // scene.environment = mesh
  scene.add(mesh);




  // 创建2D场景和相机
  orthoScene = new THREE.Scene();
  orthoCamera = new THREE.OrthographicCamera(0, window.innerWidth, window.innerHeight, 0, -100, 100);

  // 加载Logo并添加到2D场景
  const loader = new THREE.TextureLoader();
  loader.load('/image/guanduLogo.png', (texture) => {
    texture.encoding = THREE.sRGBEncoding;
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
    texture.encoding = THREE.sRGBEncoding;
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
    texture.encoding = THREE.sRGBEncoding;
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
    texture.encoding = THREE.sRGBEncoding;
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
    texture.encoding = THREE.sRGBEncoding;
    const egretGeometry = new THREE.PlaneGeometry(texture.image.width, texture.image.height);
    const egretMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    textTri = new THREE.Mesh(egretGeometry, egretMaterial);
    textTri.visible = false;

    // 設定大小
    textTri.scale.set(0.5 * window.innerWidth / texture.image.width, 0.5 * window.innerWidth / texture.image.width, 0.5 * window.innerWidth / texture.image.width)
    // 调整位置以放置在右下角,草的原始高度是387
    textTri.position.set(window.innerWidth / 3 * 2, window.innerHeight / 4, 3);
    //新增到2D場景
    orthoScene.add(textTri);
  });
  loader.load('/image/textForPter.png', (texture) => {
    texture.encoding = THREE.sRGBEncoding;
    const egretGeometry = new THREE.PlaneGeometry(texture.image.width, texture.image.height);
    const egretMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    textPter = new THREE.Mesh(egretGeometry, egretMaterial);
    textPter.visible = false;

    // 設定大小
    textPter.scale.set(0.5 * window.innerWidth / texture.image.width, 0.5 * window.innerWidth / texture.image.width, 0.5 * window.innerWidth / texture.image.width)
    // 调整位置以放置在右下角,草的原始高度是387
    textPter.position.set(window.innerWidth / 3 * 2, window.innerHeight / 4, 3);
    //新增到2D場景
    orthoScene.add(textPter);
  });
  loader.load('/image/textForRaptor.png', (texture) => {
    texture.encoding = THREE.sRGBEncoding;
    const egretGeometry = new THREE.PlaneGeometry(texture.image.width, texture.image.height);
    const egretMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    textRaptor = new THREE.Mesh(egretGeometry, egretMaterial);
    textRaptor.visible = false;

    // 設定大小
    textRaptor.scale.set(0.5 * window.innerWidth / texture.image.width, 0.5 * window.innerWidth / texture.image.width, 0.5 * window.innerWidth / texture.image.width)
    // 调整位置以放置在右下角,草的原始高度是387
    textRaptor.position.set(window.innerWidth / 3 * 2, window.innerHeight / 4, 3);
    //新增到2D場景
    orthoScene.add(textRaptor);
  });
}


//設置場景
async function setDionScene(anchors, scene, sceneData, container, callback,test) {
  let shortSide = anchors[0]
  let longSide = anchors[1]
  const loader = new THREE.ObjectLoader();
  //打場景資料轉成 ThreeJS場景資訊

  const obj = await loader.parseAsync(sceneData.scene ? sceneData.scene : sceneData.Scene);
  const objCon = await loader.parseAsync(container.scene ? container.scene : container.Scene)

  //設置環境貼圖
  if (obj.environment !== null) {
    scene.environment = obj.environment;
  }


  //設置主物件的父層級並把ThreeJS場景資訊放入
  const modelObject = new THREE.Object3D();
  modelObject.position.set(0,0,0)



  // obj.rotation.y = Math.PI / 2;
  // objCon.rotation.y = Math.PI / 2;
  // obj.position.set(-0.25,-0.25,-1)
  // objCon.position.set(-0.25,-0.25,-1)
  modelObject.add(obj);
  modelObject.add(objCon);
  if(test){
    
    const obT = await loader.parseAsync(test.scene ? test.scene : test.Scene)

    modelObject.add(obT);
    }
  // modelObject.scale.set(2, 2, 2);

  //左邊和前方的柵欄
  let door
  let door2
  //恐龍本身
  let Dino
  //整個外部柵欄整體(用於動畫)
  let fense
  //全部的物件
  let DinoObj = new Object();


  DinoObj.animations = []
  // modelObject.scale.set(0.1, 0.1, 0.1);
  //依序尋找需要的物件
  modelObject.traverse((item) => {

    item.layers.set(shortSide.targetIndex + 1)

     
    // 放進去箱子是會換texture
    if (item.name === `Box001`) {
      DinoObj.box = item
    }
    if (item.name === `Node_Wide_Container`) {
      DinoObj.nodeWideContainer = item
      DinoObj.nodeWideContainer.initialPosition = DinoObj.nodeWideContainer.position.clone()
      DinoObj.nodeWideContainer.initialRotation = DinoObj.nodeWideContainer.rotation.clone()
      DinoObj.nodeWideContainer.initialScale = DinoObj.nodeWideContainer.scale.clone()
      console.log('Wide',DinoObj.nodeWideContainer)

    }
    if (item.name === `Node_Wide`) {
      DinoObj.nodeWide = item
      DinoObj.nodeWide.initialPosition = DinoObj.nodeWide.position.clone()
      DinoObj.nodeWide.initialRotation = DinoObj.nodeWide.rotation.clone()
      // console.log('Wide',DinoObj.nodeWide)
    }
 
    if (item.name === `Node_Narrow_Container`) {
      DinoObj.nodeNarrowContainer = item
      DinoObj.nodeNarrowContainer.initialPosition = DinoObj.nodeNarrowContainer.position.clone()
      DinoObj.nodeNarrowContainer.initialRotation = DinoObj.nodeNarrowContainer.rotation.clone()
      DinoObj.nodeNarrowContainer.initialScale = DinoObj.nodeNarrowContainer.scale.clone()
      // console.log('Narrow',DinoObj.nodeNarrowContainer)
    }
    if (item.name === `Node_Narrow`) {
      DinoObj.nodeNarrow = item
      DinoObj.nodeNarrow.initialPosition = DinoObj.nodeNarrow.position.clone()
      DinoObj.nodeNarrow.initialRotation = DinoObj.nodeNarrow.rotation.clone()
    }

    if (item.name === `Dummy001`) {
      door = item;
      DinoObj.door1 = door;
    }
    if (item.name === `Dummy002`) {

      door2 = item;
      DinoObj.door2 = door2;
    }
    if (item.name === 'container.glb') {

      fense = item;
      DinoObj.fense = fense;
    }
    if (item.name === 'pterodactyl.glb' || item.name === 'raptor.glb' || item.name === 'triceratops.glb') {
      Dino = item;
      DinoObj.Dino = Dino;
    }
  })
  //設定好恐龍本身的動畫
  if (Dino) {
    let animations = Dino.animations;
    let animationName = sceneData.name
    mixer[animationName] = new THREE.AnimationMixer(Dino);
    animationList[animationName] = mixer[animationName].clipAction(animations[0]);
    animationList[animationName].clampWhenFinished = true;
    DinoObj.animations.push(animationName)
  }
  if (fense) {
    let animations = fense.animations;
    animations.forEach(animation => {
      //因為美術的動畫名稱都一樣,所以添加物件名稱
      //不然最終只會讓一個被呼叫到,這不是我們要的
      let animationName = animation.name + sceneData.name
      mixer[animationName] = new THREE.AnimationMixer(fense);
      animationList[animationName] = mixer[animationName].clipAction(animation);
      animationList[animationName].clampWhenFinished = true;
      DinoObj.animations.push(animationName)
      //柵欄的部分只撥放一次
      animationList[animationName].setLoop(THREE.LoopOnce);
      mixer[animationName].addEventListener('finished', function (e) {
        //柵欄動畫本身結束的時候要把兩個門板消失
        door.visible = false
        door2.visible = false
      });
    });
    DinoObj.modelObject = modelObject

    switch (sceneData.name) {
      case 'Pter':
        DinoPter = DinoObj;
        break;
      case 'Raptor':
        DinoRaptor = DinoObj;
        break;
      case 'Tri':
        DinoTri = DinoObj;
        break;
      default:
        DinoPter = DinoObj;
        break;

    }
  }


  callback();

  anchors.forEach(function (anchor) {
    anchor.group.add(modelObject)
  })

}

//設置場景
async function setScene(anchor, scene, sceneData, callback, board) {
  let anchorGroup = anchor.group
  let targetIndex = anchor.targetIndex
  const loader = new THREE.ObjectLoader();
  //打場景資料轉成 ThreeJS場景資訊

  const obj = await loader.parseAsync(sceneData.scene ? sceneData.scene : sceneData.Scene);


  //設置環境貼圖
  if (obj.environment !== null) {
    scene.environment = obj.environment;
  }
  let textureDrink
  //嘗試貼上飲料杯上的材質,但目前失敗
  if (sceneData.name === 'Drinks') {
    // console.log(obj)
    new RGBELoader()
      .load('/model/royal_esplanade_1k.hdr', function (texture) {
        texture.name = 'drinks'
        textureDrink = texture
        texture.matrixAutoUpdate = false;
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = texture
        scene.environment.needsUpdate = true;

      });
  }

  //設置主物件的父層級並把ThreeJS場景資訊放入
  const modelObject = new THREE.Object3D();
  modelObject.add(obj);

  if (board) {
    const objB = await loader.parseAsync(board ? board.scene : undefined);
    modelObject.add(objB)

  }



  modelObject.scale.set(0.5, 0.5, 0.5);
  // modelObject.position.x = -0.2
  // modelObject.position.y = -0.13

  //掃描ThreeJS的物件並做處理
  modelObject.traverse((item) => {

    //* 把物件放進對應的layer
    item.layers.set(targetIndex + 1)
    item.layers.enable(targetIndex + 1);
    //檢查是否是燈光並把燈放到場景層下而不是跟隨物件
    if (item.isLight && sceneData.name === 'Drinks') {
      // mScene.add(item)
      // console.log(item)
      // item.parent = mScene
    }
    if (item.isLight && sceneData.name === 'StewedRice') {
    }
    if (item.isLight) {
      item.parent = scene
    }
    if (sceneData.name === "Drinks" && item.name.includes('Cylinder_')) {
      item.texture = textureDrink
      item.needsUpdate = true;
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
    if (item.name === `rotation_beer`) {
      beer = item
    }
    if (item.name === `rotation_hot_pot`) {
      hotPot = item
    }


    // 呼叫美術做好的動畫名稱,這邊只先處理板子,恐龍在上面處理
    if (item.name === 'billboard_drinks.glb' || item.name === 'billboard_jburger.glb' || item.name === 'billboard_er.glb' ||
      item.name === 'billboard_stewed_rice.glb' || item.name === 'billboard_kc.glb' || item.name === 'billboard_kc.glb') {
      let animations = item.animations;
      animations.forEach(animation => {
        //因為美術的動畫名稱都一樣,所以添加物件名稱
        //不然最終只會讓一個被呼叫到,這不是我們要的
        let animationName = animation.name + item.name
        mixer[animationName] = new THREE.AnimationMixer(item);
        animationList[animationName] = mixer[animationName].clipAction(animation);
        animationList[animationName].clampWhenFinished = true;
        animationList[animationName].play();
      });
    }

  });
  modelObject.layers.set(targetIndex + 1)
  anchorGroup.add(modelObject);
  callback();

}


function textureLoaders() {

  let paths = ['red-Re.jpg', 'yellow-Re.jpg', 'Blue-Re.jpg']
  const loader = new THREE.TextureLoader();
  paths.forEach((path, index) => {
    loader.load(
      // resource URL
      '/model/' + path,

      // onLoad callback
      function (texture) {
        // in this example we create the material when the texture is loaded
        texture.encoding = THREE.sRGBEncoding;

        switch (index) {
          case 0:
            textureRed = texture;
          case 1:
            textureYellow = texture;
          case 2:
            textureBlue = texture;
        }
        // object.material.map = textures[index]
        // object.material.needsUpdate = true;
      },

      // onProgress callback currently not supported
      undefined,

      // onError callback
      function (err) {
        console.error('An error happened.');
      }
    );
  })

}