import * as THREE from "three";
import { Triceratops, Pterodactyl, Raptor } from "../helper/dinosaurHandle";
import 'mind-ar/dist/mindar-image-three.prod'
import { switchCamera } from "../helper/switchCamera";
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
let pizza = undefined;
let burger = undefined;
let cocktail = undefined;
let rice = undefined;
let kc = undefined;
let bacon = undefined;
let latte = undefined;
let hotPot = undefined;
let frame_down = undefined;
let frame_food = undefined;
let frame_logo = undefined;
let Thai = undefined;
let beer = undefined;
let giki = undefined;
let er = undefined;
let sparkling = undefined;
let red_barn = undefined;

let foodsArray = [
  {
    name: 'mk',
    model: false
  },
  {
    name: 'jburger',
    model: false
  },
  {
    name: 'no_worries',
    model: false
  },
  {
    name: 'stewed_rice',
    model: false
  },
  {
    name: 'kc',
    model: false
  },
  {
    name: 'beb',
    model: false
  },
  {
    name: 'latte',
    model: false
  },
  {
    name: 'hot_pot',
    model: false
  },
  {
    name: 'thai',
    model: false
  },
  {
    name: 'beer',
    model: false
  },
  {
    name: 'giki',
    model: false
  },
  {
    name: 'er',
    model: false
  },
  {
    name: 'red_barn',
    model: false
  },
  {
    name: 'sparkling',
    model: false
  },

]

let textTri = undefined;
let textRaptor = undefined;
let textPter = undefined;
//宣告恐龍,因為恐龍比較複雜,美術將動畫拆成恐龍本身加上柵欄
//然後動畫又需要在掃瞄到目標圖片的時候才開始跑動畫
let DinoPter = new Pterodactyl();
let DinoTri = new Triceratops();
let DinoRaptor = new Raptor();
let detect = 0
let orthoCamera, orthoScene, logoMesh, grassMesh, crabMesh, egretMesh
let textureBlack, textureDarkBlue, textureGrey, textureLightBlue, textureWhite, textureYellow
let count = 1
let dierction = 1
let done = false
const initialState = {
  pageState: PageState.Loading,
  isArModeOn: false,
  modelData: undefined,
  arLib: undefined,
  musicStarted: false,
  playAuth: false,
  detect: 0,
  loading: false,
  targetFind: false,
  imageData: undefined,
  videoData: undefined,
  lastPage: undefined,
  helpPop: true,
  stepsPop: false,
  target: undefined,
  switchCamera: false
}

function handleDinos(arLib, i) {
  // console.log(DinoPter)
  if (DinoPter.modelObject && DinoRaptor.modelObject && DinoTri.modelObject) {

    switch (i) {
      case 14:
        DinoTri.changeBoxTexture(textureLightBlue)
        DinoTri.playAnimations()
        DinoTri.rotateToFirstType()
        arLib.addAnchor(i).group.add(DinoTri.modelObject)
        break;
      case 17:
        DinoTri.changeBoxTexture(textureBlack)
        DinoTri.playAnimations()
        DinoTri.rotateToSecondType()
        arLib.addAnchor(i).group.add(DinoTri.modelObject)
        break;
      case 15:
        DinoRaptor.changeBoxTexture(textureWhite)
        DinoRaptor.playAnimations()
        DinoRaptor.rotateToFirstType()
        arLib.addAnchor(i).group.add(DinoRaptor.modelObject)
        break;
      case 18:
        DinoRaptor.changeBoxTexture(textureGrey)
        DinoRaptor.playAnimations()
        DinoRaptor.rotateToSecondType()
        arLib.addAnchor(i).group.add(DinoRaptor.modelObject)
        break;
      case 16:
        DinoPter.changeBoxTexture(textureGrey)
        DinoPter.playAnimations()
        DinoPter.rotateToFirstType()
        arLib.addAnchor(i).group.add(DinoPter.modelObject)
        break;
      case 19:
        DinoPter.changeBoxTexture(textureDarkBlue)
        DinoPter.playAnimations()
        DinoPter.rotateToSecondType()
        arLib.addAnchor(i).group.add(DinoPter.modelObject)
        break;
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
    setLoading: (state, payload) => {
      return { ...state, loading: payload }
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
    setStepsPop: (state, payload) => {
      return { ...state, stepsPop: payload }
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
    setSwitchCamera: (state, payload) => {

      switchCamera(state.arLib, payload)
      frame_down.visible = payload
      frame_food.visible = payload
      frame_logo.visible = payload
      logoMesh.visible = !payload
      grassMesh.visible = !payload
      crabMesh.visible = !payload
      egretMesh.visible = !payload
      return { ...state, switchCamera: payload }
    },
    setReset: () => {
      modelData = undefined;
      DinoPter = new Pterodactyl();
      DinoTri = new Triceratops();
      DinoRaptor = new Raptor();
      orthoCamera = undefined
      orthoScene = undefined
      logoMesh = undefined
      grassMesh = undefined
      crabMesh = undefined
      egretMesh = undefined
      count = 1
      dierction = 1

      textTri = undefined;
      textRaptor = undefined;
      textPter = undefined;
      pizza = undefined;
      burger = undefined;
      cocktail = undefined;
      rice = undefined;
      kc = undefined;
      bacon = undefined;
      latte = undefined;
      hotPot = undefined;
      Thai = undefined;
      beer = undefined;
      giki = undefined;
      return { ...initialState }
    },

  },
  effects: (dispatch) => ({
    dinoCallback(arLib, scene) {
      dispatch.AppState.changePageState(PageState.ARView);
      dispatch.AppState.setIsArModeOn(true)
      dispatch.AppState.setArLib(arLib);
      handleDinos(arLib, detect - 1)
    },

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
        uiScanning: false,
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
          if (i < 14 && foodsArray[i].model === false) {
            dispatch.AppState.setLoading(true)
          } else {
            dispatch.AppState.setLoading(false)
          }
          //依序把每個恐龍物件裡面從好的動畫名稱,對應到animationList裡面,一一撥放
          handleDinos(arLib, i)
        }

        arLib.addAnchor(i).onTargetLost = async () => {
          dispatch.AppState.setDetect(0)
          arLib.detect = 0
          dispatch.AppState.setMusicStarted(false)
          dispatch.AppState.setHelpPop(true);
          dispatch.AppState.setLoading(false);
          //設定好每個恐龍掃版結束後,要把板子回復,動畫結束
          switch (i) {
            case 14:
            case 17:
              DinoTri.stopAnimations()
            case 15:
            case 18:
              DinoRaptor.stopAnimations()
              break;
            case 16:
            case 19:
              DinoPter.stopAnimations()
              break;
          }
        }
      }

      //載入箱子顏色的環境貼圖
      await textureLoaders()

      //載入JSON場景檔
      Promise.all([

        fetch("/model/triceratops.json").then(result => result.json()),
        fetch("/model/raptor.json").then(result => result.json()),
        fetch("/model/pterodactyl.json").then(result => result.json()),
        fetch("/model/container.json").then(result => result.json()),
        arLib.start()
      ]).then(async ([arDinoTri, arDinoRaptor, arDinoPter, arContainer, arLibResult]) => {

        // * 設置攝影機的畫面
        connectWebCam(arLib)
        arLib.camera2D = orthoCamera
        arLib.scene2D = orthoScene

        // * 設定物件名稱,讓函式可以判斷名稱
        arDinoPter.name = 'Pter'
        arDinoTri.name = 'Tri'
        arDinoRaptor.name = 'Raptor'


        let TriArray = [arLib.addAnchor(14), arLib.addAnchor(17),]
        setDionScene(TriArray, arDinoTri, arContainer, () => {
          renderer.shadowMap.enabled = true;
          renderer.shadowMap.type = THREE.PCFSoftShadowMap;
          renderer.shadowMap.needsUpdate = true;
          if (DinoTri.Dino && DinoRaptor.Dino && DinoPter.Dino) {
            this.dinoCallback(arLib, scene)
            loadFoods(scene, arLib, () => {
              dispatch.AppState.setLoading(false)
            })

          }
        })
        let RaptorArray = [arLib.addAnchor(15), arLib.addAnchor(18)]
        setDionScene(RaptorArray, arDinoRaptor, arContainer, () => {
          renderer.shadowMap.enabled = true;
          renderer.shadowMap.type = THREE.PCFSoftShadowMap;
          renderer.shadowMap.needsUpdate = true;
          if (DinoTri.Dino && DinoRaptor.Dino && DinoPter.Dino) {
            this.dinoCallback(arLib, scene)
            loadFoods(scene, arLib, () => {
              dispatch.AppState.setLoading(false)
            })

          }
        })
        let Pterrray = [arLib.addAnchor(16), arLib.addAnchor(19)]
        setDionScene(Pterrray, arDinoPter, arContainer, () => {
          renderer.shadowMap.enabled = true;
          renderer.shadowMap.type = THREE.PCFSoftShadowMap;
          renderer.shadowMap.needsUpdate = true;
          if (DinoTri.Dino && DinoRaptor.Dino && DinoPter.Dino) {
            this.dinoCallback(arLib, scene)
            loadFoods(scene, arLib, () => {
              dispatch.AppState.setLoading(false)
            })

          }

        })


        //* loop是每一禎去畫的事情,轉圈和外框的繪製都是靠這邊
        renderer.setAnimationLoop(() => {
          renderer.autoClear = false;



          //!有掃到物件
          if (detect > 0) {
            //! 渲染出對應layer
            switch (detect) {
              case 15:
              case 18:
                camera.layers.set(15);
                break;
              case 16:
              case 19:
                camera.layers.set(16);
                break;
              case 17:
              case 20:
                camera.layers.set(17);
                break;
              default:
                camera.layers.set(detect);
            }

            renderer.render(scene, camera);
          }
          // renderer.autoClear = false; // 防止在渲染2D场景前清除现有的渲染
          if (orthoCamera && orthoScene) {
            // * 畫出2D場景(視訊畫面)
            orthoCamera.layers.set(25);
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
          // 原本食物和恐龍的mixer是共用同一個,但是現在拆開了
          Object.keys(DinoRaptor.mixer).forEach(name => {
            DinoRaptor.mixer[name].update(mixerUpdateDelta)
          })
          Object.keys(DinoPter.mixer).forEach(name => {
            DinoPter.mixer[name].update(mixerUpdateDelta)
          })
          Object.keys(DinoTri.mixer).forEach(name => {
            DinoTri.mixer[name].update(mixerUpdateDelta)
          })

          if (rice && detect === 4) {
            // rice.rotation.x += 2
            rice.rotation.y += 0.01;
            rice.rotation.y %= Math.PI * 2;
            // rice.rotation.y = Math.max(rice.rotation.y, -Math.PI / 2);
          }
          if (pizza && detect === 1) {
            pizza.rotation.y += 0.01;
            pizza.rotation.y %= Math.PI * 2;
          }
          if (burger && detect === 2) {
            burger.rotation.y += 0.01;
            burger.rotation.y %= Math.PI * 2;
          }
          if (cocktail && detect === 3) {
            cocktail.rotation.y += 0.01;
            cocktail.rotation.y %= Math.PI * 2;
          }
          if (bacon && detect === 6) {
            bacon.rotation.y += 0.01;
            bacon.rotation.y %= Math.PI * 2;
          }
          if (kc && detect === 5) {
            kc.rotation.y += 0.01;
            kc.rotation.y %= Math.PI * 2;
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
          if (giki && detect === 11) {
            giki.rotation.y += 0.01;
            giki.rotation.y %= Math.PI * 2;
          }
          if (er && detect === 12) {
            er.rotation.y += 0.01;
            er.rotation.y %= Math.PI * 2;
          }
          if (red_barn && detect === 13) {
            red_barn.rotation.y += 0.01;
            red_barn.rotation.y %= Math.PI * 2;
          }
          if (sparkling && detect === 14) {
            sparkling.rotation.y += 0.01;
            sparkling.rotation.y %= Math.PI * 2;
          }
          if (latte && detect === 7) {
            latte.rotation.y += 0.01;
            latte.rotation.y %= Math.PI * 2;
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
              case 16:
              case 19:
                textRaptor.visible = true;
                break;
              case 15:
              case 18:
                textTri.visible = true;
                break;
              case 20:
              case 17:
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

function loadFoods(scene, arLib, callback) {
  for (let i = 0; i < 14; i++) {

    let name = foodsArray[i].name
    Promise.all([
      fetch(`/model/meals_${name}.json`).then(result => result.json()),
      fetch(`/model/billboard_${name}.json`).then(result => result.json()),
    ]).then(async ([armodel, arBoard]) => {

      setScene(arLib.addAnchor(i), scene, armodel, () => {
        setTimeout(() => {
          callback()
          foodsArray[i].model = true      
        }, 500)

      }, arBoard)
    }).catch((err) => { console.log(err) })


  }


}


//設置攝影機的畫面
function connectWebCam(mindarThree) {
  const { video, scene } = mindarThree;
  // switchCamera(mindarThree, true)
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
  mesh.layers.set(25);
  mesh.layers.enable(25);
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
  loader.load('/image/frame_logo.png', (texture) => {
    texture.encoding = THREE.sRGBEncoding;
    const logoGeometry = new THREE.PlaneGeometry(texture.image.width, texture.image.height);
    const logoMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true, toneMapped: false });
    frame_logo = new THREE.Mesh(logoGeometry, logoMaterial);
    if (window.innerWidth > 600) {
      frame_logo.scale.set(0.35 * window.innerWidth / texture.image.width, 0.35 * window.innerWidth / texture.image.width, 0.35 * window.innerWidth / texture.image.width)
      // 调整位置以放置在左上角
      // 半張logo寬度 = texture.image.width * 0.3 *window.innerWidth / texture.image.wid /2
      frame_logo.position.set(texture.image.width * 0.2 * window.innerWidth / texture.image.width / 2 + 0.11 * window.innerWidth, window.innerHeight * 0.91, 1);
    } else {
      frame_logo.scale.set(0.45* window.innerWidth / texture.image.width, 0.45* window.innerWidth / texture.image.width, 0.4 * window.innerWidth / texture.image.width)
      // 调整位置以放置在左上角
      frame_logo.position.set(window.innerWidth / 4 +10, window.innerHeight - 70, 1);
    }
    frame_logo.visible = false;
    orthoScene.add(frame_logo);
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
  //* 前鏡頭的背景橫幅
  loader.load('/image/frame_down.png', (texture) => {
    texture.encoding = THREE.sRGBEncoding;
    const grassGeometry = new THREE.PlaneGeometry(texture.image.width, texture.image.height);
    const grassMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true, toneMapped: false });

    frame_down = new THREE.Mesh(grassGeometry, grassMaterial);
 
    if (window.innerWidth > 600) {
      // 設定大小
      frame_down.scale.set(1 * window.innerWidth / texture.image.width, 1.15 * window.innerWidth / texture.image.width, 1 * window.innerWidth / texture.image.width)
      // 调整位置以放置在左上角
      frame_down.position.set(window.innerWidth / 2, texture.image.height * window.innerWidth / texture.image.width / 2, 2);
    } else {
     // 設定大小
     frame_down.scale.set(1 * window.innerWidth / texture.image.width, 1.15 * window.innerWidth / texture.image.width, 1 * window.innerWidth / texture.image.width)

     // 调整位置以放置在左上角
     frame_down.position.set(window.innerWidth / 2, texture.image.height * window.innerWidth / texture.image.width / 2, 2);
    }
  
    //新增到2D場景
    frame_down.visible = false;
    orthoScene.add(frame_down);

  });
  //* 前鏡頭的下方食物
  loader.load('/image/frame_food.png', (texture) => {
    texture.encoding = THREE.sRGBEncoding;
    const grassGeometry = new THREE.PlaneGeometry(texture.image.width, texture.image.height);
    const grassMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true, toneMapped: false });

    frame_food = new THREE.Mesh(grassGeometry, grassMaterial);
    if (window.innerWidth > 600) {
       // 設定大小
       frame_food.scale.set(0.9 * window.innerWidth / texture.image.width, 0.9* window.innerWidth / texture.image.width, 1 * window.innerWidth / texture.image.width)
       // 调整位置以放置在左上角
       frame_food.position.set(window.innerWidth / 2, texture.image.height * window.innerWidth / texture.image.width / 2.2 - 20, 2);
    } else {
     // 設定大小
     frame_food.scale.set(0.95 * window.innerWidth / texture.image.width, 0.95* window.innerWidth / texture.image.width, 1 * window.innerWidth / texture.image.width)
     // 调整位置以放置在左上角
     frame_food.position.set(window.innerWidth / 2, texture.image.height * window.innerWidth / texture.image.width / 2.2-8, 2);
    }

    //新增到2D場景
    frame_food.visible = false;
    orthoScene.add(frame_food);

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
async function setDionScene(anchors, sceneData, container, callback) {
  let shortSide = anchors[0]

  let DD
  switch (sceneData.name) {
    case 'Tri':
      DD = DinoTri
      break
    case "Raptor":
      DD = DinoRaptor
      break
    case "Pter":
      DD = DinoPter
      break
  }


  await DD.loadModel(sceneData, container, shortSide, anchors, callback)


  // callback();
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
    item.frustumCulled = false

    //檢查是否是燈光並把燈放到場景層下而不是跟隨物件

    if (item.isLight && sceneData.name === 'StewedRice') {
    }
    if (item.isLight) {
      item.parent = scene
    }


    //這邊的名字都是跟美術團隊溝通好,利用excel統一名稱
    //引入進來後,把對應變數配對

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

    if (item.name === `rotation_thai`) {
      Thai = item
    }
    if (item.name === `rotation_beer`) {
      beer = item
    }
    if (item.name === `rotation_er`) {
      er = item
    }
    if (item.name === `rotation_hot_pot`) {
      hotPot = item
    }
    if (item.name === `rotation_giki`) {
      giki = item
    }
    if (item.name === `rotation_latte`) {
      latte = item
    }
    if (item.name === `rotation_mk`) {
      pizza = item
    }
    if (item.name === `rotation_no_worries`) {
      cocktail = item
    }
    if (item.name === `rotation_red_barn`) {
      red_barn = item
    }
    if (item.name === `rotation_sparkling`) {
      sparkling = item
    }

    // 呼叫美術做好的動畫名稱,這邊只先處理板子,恐龍在上面處理
    if (item.name === 'billboard_jburger.glb' || item.name === 'billboard_stewed_rice.glb' || item.name === 'billboard_kc.glb' || item.name === 'billboard_kc.glb') {
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



async function textureLoaders() {

  let paths = ['black.png', 'dark_blue.png', 'gray.png', 'light_blue.png', 'white.png', 'yellow.png']
  const loader = new THREE.TextureLoader();
  paths.forEach((path, index) => {
    loader.load(
      // resource URL
      '/image/' + path,

      // onLoad callback
      function (texture) {
        // in this example we create the material when the texture is loaded
        texture.encoding = THREE.sRGBEncoding;
        switch (index) {
          case 0:
            textureBlack = texture;
            textureBlack.name = path
            break
          case 1:
            textureDarkBlue = texture;
            textureDarkBlue.name = path
            break
          case 2:
            textureGrey = texture;
            textureGrey.name = path
            break
          case 3:
            textureLightBlue = texture;
            textureLightBlue.name = path
            break
          case 4:
            textureWhite = texture;
            textureWhite.name = path
            break
          case 5:
            textureYellow = texture;
            textureYellow.name = path
            break
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