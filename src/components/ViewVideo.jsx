import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Help from "./Help";
import { MdSaveAlt } from "react-icons/md";
import { saveApi } from "../helper/api";

import { isSafari, isIOS } from "react-device-detect";

const ViewVideo = function () {
  const [playVideo, setPlayVideo] = useState(true);
  const videoDom = useRef();
  const [type , setType] = useState(0);
  const [pop, setPop] = useState();
  const state = useSelector((state) => state.AppState);
  

  useEffect(() => {
    if (videoDom) {
      videoDom.current.controls = false;
      videoDom.current.src = URL.createObjectURL(state.videoData);
      // videoDom.current.src = '/test.mp4'
      videoDom.current.load();
    }
  }, []);

  useEffect(()=>{
    setType(state.detect)
  },[])

  function onClickPlayVideo() {
    if (playVideo) {
      videoDom.current.pause();
    } else {
      videoDom.current.play();
    }
    setPlayVideo(!playVideo);
  }

  async function savePop() {
    const link = document.createElement("a");
    link.download = "video.mp4";
    link.href = URL.createObjectURL(state.videoData);
    link.click();
    saveApi(type)
    await setPop(<p>Please find your file in the album or folder.</p>);
    await setTimeout(() => {
      setPop();
    }, 1000);
  }

  function videoOnLoad() {
    videoDom.current.play();
  }

  return (
    <>
      <div className="viewer" onClick={onClickPlayVideo}>
        <video
          onLoadedData={videoOnLoad}
          autoPlay={true}
          loop={true}
          playsInline={true}
          ref={videoDom}
        />
      </div>
      <Help />
      <div
        className="play-btn"
        style={{ display: playVideo ? "block" : "none" }}
      >
        <img src="/image/icon/play-icon.svg" className="play-icon" alt="" />
      </div>
      <div
        className="stop-btn"
        style={{ display: playVideo ? "none" : "flex" }}
      >
        {/* <img src="/image/icon/stop-icon.svg" className="stop-icon" alt="" /> */}
        <div className="stop"   ></div>
        <div className="bg"></div>
      </div>
      {/* <div className="absolute bottom-0 z-[0]">
        <img src={"/image/frameGroup.png"} alt="frame" />
      </div> */}
      <div className="stepBtn-container">
        {isIOS ? (
          null
          // <div className="rounded-full bg-white text-black p-2">IOS 用戶 下載流程</div>
        ) : (
          <div className="info">請在相簿或資料夾中找到您的檔案</div>
        )}
        <div className="stepBtn-group">
          <button
            className="text-white text-base flex items-center rounded-full py-2 px-6 bg-main"
            onClick={savePop}
          >
            儲存 <MdSaveAlt className="text-xl ml-2 mb-1" />
          </button>
        </div>
      </div>
    </>
  );
};

export default ViewVideo;
