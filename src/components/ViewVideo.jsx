import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PageState } from "../model/pageState";
import { shareVideo } from "../helper/captureVideo";
import { MdSaveAlt } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";
const ViewVideo = function () {
  const [playVideo, setPlayVideo] = useState(true);
  const videoDom = useRef();
  const [pop, setPop] = useState();
  const state = useSelector((state) => state.AppState);
  const dispatch = useDispatch();

  useEffect(() => {
    if (videoDom) {
      console.log(state.videoData);
      videoDom.current.controls = false;
      videoDom.current.src = URL.createObjectURL(state.videoData);
      // videoDom.current.src = '/test.mp4'
      videoDom.current.load();
    }
  }, []);

  function onClickClose() {
    dispatch.AppState.showDiscard(PageState.ViewVideo);
  }

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
    await setPop(<p>Please find your file in the album or folder.</p>);
    await setTimeout(() => {
      setPop();
    }, 1000);
  }
  async function copyPop() {
    await setPop(
      <>
        <p>Copied! Share the AR result on social media.</p>
      </>
    );
    await navigator.clipboard.writeText(
      "Seeing an incredible future with #ASUS at #CES2023!👀\n#ASUSLaunchEvent\n👉 Visit this link to have some AR fun! https://asus.click/ces23_wa"
    );
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
      <div className="view-video">
        <div className="close-group">
          <div
            className="rounded-full bg-white flex text-[#020202] font-bold py-2 px-2 "
            onClick={onClickClose}
          >
          
              {" "}
              <FaTrash className="text-xl text-main" />{" "}
            
          </div>
        </div>
      </div>
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
        <img src="/image/icon/stop-icon.svg" className="stop-icon" alt="" />
        <div className="bg"></div>
      </div>
      <div className="absolute bottom-0 z-[0]">
        <img src={"/image/frameGroup.png"} alt="frame" />
      </div>
      <div className="stepBtn-container">
        <div className="info">請在相簿或資料夾中找到您的檔案</div>
        <div className="stepBtn-group">
          <button
            className="text-white text-base flex items-center rounded-full py-2 px-6 bg-main"
            onClick={savePop}
          >
            儲存 <MdSaveAlt className="text-xl ml-2 mb-1" />
          </button>
        </div>
        <div className="btn-pop">{pop}</div>
      </div>
    </>
  );
};

export default ViewVideo;
