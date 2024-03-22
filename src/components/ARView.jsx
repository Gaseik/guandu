import  { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PageState } from "../model/pageState";
import { ViewPhoto, ViewVideo, Discard, Progress } from "./index";
import "mind-ar/dist/mindar-image-three.prod"
import { captureImage } from "../helper/captureImage";
import { startCaptureVideo, stopCaptureVideo } from "../helper/captureVideo";


const viewButton = {
  camera: "camera",
  video: "video",
}
let counter = undefined;
let sec = 0;


const ARView = function ( ) {
  const [isRecord, setIsRecord] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0)
  const [changeBtn, setChangeBtn] = useState(viewButton.camera)
  const [videoBtn, setVideoBtn] = useState(false)
  const view = useRef(null);
  const state = useSelector((state) => state.AppState)
  const dispatch = useDispatch();

  function onClickTakePhoto() {
    if (changeBtn === viewButton.camera) {
      const imageUrl = captureImage(state.arLib);
      dispatch.AppState.setImage(imageUrl);
    } else {
      setChangeBtn(viewButton.camera)
      setVideoBtn(false)
    }
  }

  function onClickTakeVideo() {
    if (changeBtn !== viewButton.video) {
      setChangeBtn(viewButton.video)
      setTimeout(() => { setVideoBtn(true) }, 490)
    }
    else {
      if (!isRecord) {
        const { renderer } = state.arLib;
        startCaptureVideo(renderer.domElement)
        const startTime = Date.now();
        if (counter) {
          clearInterval(counter)
        }
        setIsRecord(true);
        counter = setInterval(function () {
          sec = Math.min((Date.now() - startTime) / 1000);
          const timer = new Date(sec * 1000).toISOString().substring(17, 19)
          setRecordingTime((sec / 15) * 100)
          if (Math.round(timer) === 15) {
            stopRecord();
          }
        }, 100);
      }
      else {
        stopRecord()
      }
    }
  }

  function stopRecord() {
    if (counter) {
      clearInterval(counter);
      setRecordingTime(0)
      setIsRecord(false);
      stopCaptureVideo((blob) => {
        if (sec < 1) {
          return
        }
        dispatch.AppState.setVideo(blob)
      })
    }
  }

  function onClickHelp() {
    dispatch.AppState.setHelpPop(!state.helpPop);
  }


  return (
    <div className={`max-w-[600px] ar-view w-full h-full absolute transition-all duration-200 ${state.isArModeOn?'z-[20] opacity-100':"opacity-0 z-[-1]"}`}>
      <div id="ar_container" className=" h-full flex " />
      <div className="btn help" onClick={onClickHelp}><span>Help</span></div>
      <div className="button-group absolute bottom-0">
        <div className="circle-frame">
          <div className={`${changeBtn === viewButton.camera ? "click-photo-view" : "click-video-view"} flex`} ref={view}>
            <div className="btn take-video-btn relative" onClick={onClickTakeVideo}>
              <div className="video-icon bg-white rounded-full p-2">
               {!isRecord? <img src="/image/icon/videocam-icon.svg" className="videocam-icon"  alt="" />:
                <img src="/image/icon/stop-record-icon.svg" className="videocam-icon"  alt="" />}
              </div>
              {videoBtn ? <Progress className={`absolute top-0`} strokeWidth={4} percentage={recordingTime} /> : <></>}
            </div>
            <div className="btn take-photo-btn bg-white rounded-full p-2" onClick={onClickTakePhoto}>
              <img src="/image/icon/camera-icon.svg" className="camera-icon text-white" alt="" />
            </div>
          </div>
        </div>
      </div>
      {state.helpPop ? <div className="help-pop hidden">
        <div className="btn close-icon-btn h-10 w-10 block bg-white" onClick={() => { dispatch.AppState.setHelpPop(!state.helpPop); }} >
          {/* <img src="/image/icon/close-icon.svg" className="close-icon" alt="" /> */}
          
        </div>
        <img className="ASUS_KV" src="/image/ASUS_CESKV.png" alt="" />
        <p className="help-large-scale">Point the camera to this image</p>
        <p className="help-small-scale">For the best AR experience, keep the camera parallel to your screen.
        </p>
      </div> :
        <></>}
      {state.pageState === PageState.ViewPhoto ? <ViewPhoto /> : null}
      {state.pageState === PageState.ViewVideo ? <ViewVideo /> : null}
      {state.pageState === PageState.Discard ? <Discard /> : null}
    </div>
  )
}

export default ARView;
