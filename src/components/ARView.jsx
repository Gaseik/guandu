import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PageState } from "../model/pageState";
import { ViewPhoto, ViewVideo, Discard, Progress } from "./index";
import "mind-ar/dist/mindar-image-three.prod";
import { captureImage } from "../helper/captureImage";
import { startCaptureVideo, stopCaptureVideo } from "../helper/captureVideo";
import { IoIosInformationCircle, IoIosClose,IoMdCamera } from "react-icons/io";
import { AiFillVideoCamera } from "react-icons/ai";

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
  const waterMarkImageRef = useRef();

  function onClickTakePhoto() {
    if (changeBtn === viewButton.camera) {
      const waterMarkImage = new Image();
      waterMarkImage.src = '/image/guanduLogo.png';
      waterMarkImage.onload = () => {
        // 调用 captureImage 函数并传递浮水印图像
        const canvas = captureImage(arLib, waterMarkImage);
        // 在这里可以对 canvas 做进一步处理，比如显示在界面上或者保存成文件等
      };
  
      const imageUrl = captureImage(state.arLib);
      dispatch.AppState.setImage(imageUrl);
      
    } else {
      setChangeBtn(viewButton.camera);
      setVideoBtn(false);
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
        startCaptureVideo(renderer.domElement);
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
            stopRecord();
          }
        }, 100);
      } else {
        stopRecord();
      }
    }
  }

  function stopRecord() {
    if (counter) {
      clearInterval(counter);
      setRecordingTime(0);
      setIsRecord(false);
      stopCaptureVideo((blob) => {
        if (sec < 1) {
          return;
        }
        dispatch.AppState.setVideo(blob);
      });
    }
  }

  function onClickHelp() {
    dispatch.AppState.setHelpPop(!state.helpPop);
  }

  return (
    <div
      className={`max-w-[600px] ar-view w-full h-full absolute transition-all duration-200 ${
        state.isArModeOn ? "z-[20] opacity-100" : "opacity-0 z-[-1]"
      }`}
    >
      <div id="ar_container" className=" h-full flex " />
      {/* <img
        src="image/guanduLogo.png"
        className="absolute w-[120px] top-4 left-10"
      /> */}
      <div className="btn help" onClick={onClickHelp}>
        <span className="flex items-center">
          <IoIosInformationCircle className="text-[28px] mr-1 text-main" />
          體驗說明
        </span>
      </div>
      <div className="button-group absolute bottom-0">
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
                  <AiFillVideoCamera className="text-4xl text-main"
                  />
                ) : (
                  <img
                    src="/image/icon/stop-record-icon.svg"
                    className="videocam-icon"
                    alt=""
                  />
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
              <IoMdCamera className="text-main text-5xl"
              />
            </div>
          </div>
        </div>
      </div>
      {state.helpPop ? (
        <div className="help-pop hidden">
          <div
            className="btn close-icon-btn h-10 w-10 block absolute top-2 right-1"
            onClick={() => {
              dispatch.AppState.setHelpPop(!state.helpPop);
            }}
          >
            {/* <img src="/image/icon/close-icon.svg" className="close-icon" alt="" /> */}
            <IoIosClose className="text-4xl" />
          </div>
          <img className="w-[200px]" src="/image/LOGO 2.png" alt="" />
          <p className="help-large-scale font-bold">請將相機對準此圖標</p>
          <p className="help-small-scale">
            為了獲得最佳的 AR 體驗<br/> 請將相機鏡頭與現場的辨識圖標保持平行
          </p>
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
