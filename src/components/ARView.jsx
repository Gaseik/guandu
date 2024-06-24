import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PageState } from "../model/pageState";
import { ViewPhoto, ViewVideo, Discard, Progress } from "./index";
import { captureImage } from "../helper/captureImage";
import { startCaptureVideo, stopCaptureVideo } from "../helper/captureVideo";
import {  IoIosClose, IoMdCamera } from "react-icons/io";
import { AiFillVideoCamera } from "react-icons/ai";
import { IoStop } from "react-icons/io5";
import bgMusicFile from "/music/audio_meals.mp3";
import bgDMusicFile from "/music/audio_container.mp3";
import Help from "./Help";
import { enterPageApi,photoTakenApi,recordApi,themeDetect } from "../helper/api";
const viewButton = {
  camera: "camera",
  video: "video",
};
let counter = undefined;
let sec = 0;

const ARView = function () {
  const [isRecord, setIsRecord] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [changeBtn, setChangeBtn] = useState(viewButton.camera);
  const [videoBtn, setVideoBtn] = useState(false);

  const view = useRef(null);
  const state = useSelector((state) => state.AppState);
  const dispatch = useDispatch();
  const [bgMusic, setBgMusic] = useState(new Audio(bgMusicFile)); // 创建背景音乐的 Audio 实例


  useEffect(() => {
    //判斷哪些地方需要撥放音樂
    if (
      state.pageState === PageState.Discard ||
      state.pageState === PageState.ViewPhoto ||
      state.pageState === PageState.ViewVideo ||
      state.pageState === PageState.ViewVideo ||
      state.pageState === PageState.ARView 
    
    ) {
      bgMusic.volume = 0.1;
      if (state.musicStarted&&state.playAuth) {
        bgMusic.play();
        dispatch.AppState.setPlayAuth(true)
        dispatch.AppState.setMusicStarted(true);
      } else {
        bgMusic.pause();
      }
    } else {
      bgMusic.pause();
      dispatch.AppState.setPlayAuth(false)
      dispatch.AppState.setMusicStarted(false); // 否则暂停背景音乐
    }
  }, [state.pageState, state.musicStarted,state.playAuth]);// 依赖于页面状态和背景音乐实例

  useEffect(() => {
    // 页面可见性变化处理
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // 切回頁面,有時攝影機畫面會停住,重新抓一次
        dispatch.AppState.setSwitchCamera(state.switchCamera)
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 组件卸载时移除事件监听器
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    dispatch.AppState.setMusicStarted(false);
    // 判斷是恐龍還是食物類，判斷要撥放甚麼音樂
    // 目前0是初始狀態，1-14是食物，15-20是恐龍類
    if(state.detect > 0 ){
      if (state.detect < 15) {
        if (bgMusic.src !== bgMusicFile) {
          dispatch.AppState.setPlayAuth(false);
          setBgMusic(null);
          const newBgMusic = new Audio(bgMusicFile);
          newBgMusic.loop = true; // 在這裡設置音樂循環播放
          setBgMusic(newBgMusic);
          if (state.playAuth) {
            dispatch.AppState.setPlayAuth(false);
          }
          setTimeout(() => {
            dispatch.AppState.setMusicStarted(true);
          }, 500);
        }
      } else {
        if (bgMusic.src !== bgDMusicFile) {
          setBgMusic(null);
          const newBgMusic = new Audio(bgDMusicFile);
          newBgMusic.loop = true; // 在這裡設置音樂循環播放
          setBgMusic(newBgMusic);
          if (state.playAuth) {
            dispatch.AppState.setPlayAuth(false);
          }
          setTimeout(() => {
            dispatch.AppState.setMusicStarted(true);
          }, 500);
        } else {
          setTimeout(() => {
            dispatch.AppState.setMusicStarted(true);
          }, 500);
        }
      }
    }
    
  }, [state.detect]);

  useEffect(()=>{
    //進佔就打一次API
    enterPageApi()
  },[])

  useEffect(()=>{
    if(state.detect>0){
    themeDetect(state.detect)
    }
  },[state.detect])

  function onClickTakePhoto() {
    if (changeBtn === viewButton.camera) {
      const { renderer } = state.arLib;
      // console.log(renderer.domElement)
      const imageUrl = captureImage(state.arLib);
      // console.log(imageUrl)
      dispatch.AppState.setImage(imageUrl);
      photoTakenApi(state.detect)
    } else {
      setChangeBtn(viewButton.camera);
      setVideoBtn(false);
      stopRecord(true)
    }
  }

  function onClickTakeVideo() {
    if (changeBtn !== viewButton.video) {
      setChangeBtn(viewButton.video);
      setTimeout(() => {
        setVideoBtn(true);
      }, 490);
    } else {
      if (!isRecord) {
        const { renderer } = state.arLib;
        startCaptureVideo(renderer.domElement,bgMusic);
        const startTime = Date.now();
        if (counter) {
          clearInterval(counter);
        }
        setIsRecord(true);
        counter = setInterval(function () {
          sec = Math.min((Date.now() - startTime) / 1000);
          const timer = new Date(sec * 1000).toISOString().substring(17, 19);
          setRecordingTime((sec / 15) * 100);
          if (Math.round(timer) === 15) {
            stopRecord(false);
          }
        }, 100);
      } else {
        stopRecord(false);
      }
    }
  }

  function stopRecord(changeBtn) {
    if (counter) {
      clearInterval(counter);
      setRecordingTime(0);
      setIsRecord(false);
      stopCaptureVideo((blob) => {
        // console.log(blob);
        if (sec < 1) {
          return;
        }
        // console.log(blob);
        if(!changeBtn){
          dispatch.AppState.setVideo(blob);
          recordApi(state.detect)
        }
       
      });
    }
  }
  function loadFoodCover () {
    return (
      <div className={`w-full absolute h-full transition-all duration-200 bg-[#020202] bg-opacity-50 flex flex-col justify-center items-center ${
        state.loading ? "z-[25] opacity-100" : "opacity-0 z-[-1] pointer-events-none"
      }`}>
           <div
          className="my-3 inline-block h-16 w-16 sm:h-24 sm:w-24 animate-spin rounded-full 
          border-4 sm:border-8 border-solid border-current border-r-transparent align-[-0.125em]
           text-white motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute  !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
        <div className="text-white font-bold text-2xl sm:text-3xl">
          模組載入中
        </div>
      </div>
    )
  }


  return (
    <div
      className={` ar-view w-full h-full absolute transition-all duration-200 ${
        state.isArModeOn ? "z-[20] opacity-100" : "opacity-0 z-[-1]"
      }`}
    >
      {loadFoodCover()}
      <div id="ar_container" className=" h-[100%] flex " />
      
      {/* <img src="image/textForTri.png" alt="" className={`absolute bottom-40 sm:bottom-60  right-14 w-[60%] animate-pulse ${state.detect===11?"":"hidden"}`}/> */}
      <Help />
      <div className="button-group">
        <div className="circle-frame">
          <div
            className={`${
              changeBtn === viewButton.camera
                ? "click-photo-view"
                : "click-video-view"
            } flex`}
            ref={view}
          >
            <div
              className="btn take-video-btn relative"
              onClick={onClickTakeVideo}
            >
              <div className="video-icon bg-white rounded-full p-2">
                {!isRecord ? (
                  <AiFillVideoCamera className="text-4xl text-main" />
                ) : (
                  <IoStop className="text-4xl text-main" />
                )}
              </div>
              {videoBtn ? (
                <Progress
                  className={`absolute top-0`}
                  strokeWidth={4}
                  percentage={recordingTime}
                />
              ) : (
                <></>
              )}
            </div>
            <div
              className="btn take-photo-btn bg-main rounded-full p-2"
              onClick={onClickTakePhoto}
            >
              <IoMdCamera className="text-main text-5xl" />
            </div>
          </div>
        </div>
      </div>
      {/* <div className="version absolute bottom-0">v{import.meta.env.VITE_VERSION}</div> */}
      {state.helpPop ? (
        <div className="help-pop hidden">
          <div
            className="btn close-icon-btn h-10 w-10 block absolute top-2 right-1"
            onClick={() => {
              dispatch.AppState.setHelpPop(!state.helpPop);
            }}
          >
            {/* <img src="/image/icon/close-icon.svg" className="close-icon" alt="" /> */}
            <IoIosClose className="text-4xl text-[#020202]" />
          </div>
          <img className="w-[180px]" src="/image/show.gif" alt="" />
          <p className="help-large-scale font-bold mt-4">請將相機對準此圖標</p>
          <p className="help-small-scale">
            為了獲得最佳的 AR 體驗
            <br /> 請將相機鏡頭與現場的辨識圖標保持平行
          </p>
          <img
            src="/image/Boddarti2.png"
            alt=""
            className="absolute w-16 bottom-[-20px] boddarti"
          />
     
        </div>
      ) : (
        <></>
      )}
      {state.pageState === PageState.ViewPhoto ? <ViewPhoto /> : null}
      {state.pageState === PageState.ViewVideo ? <ViewVideo /> : null}
      {state.pageState === PageState.Discard ? <Discard /> : null}
    </div>
  );
};

export default ARView;
