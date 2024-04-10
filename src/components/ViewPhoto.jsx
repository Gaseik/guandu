import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PageState } from "../model/pageState";
import { shareImage } from "../helper/shareImage";
import { MdSaveAlt } from "react-icons/md";
import Help from "./Help";

const ViewPhoto = function () {
  const [pop, setPop] = useState();
  const state = useSelector((state) => state.AppState);
  const dispatch = useDispatch();
  function onClickClose() {
    dispatch.AppState.showDiscard(PageState.ViewPhoto);
  }

  async function savePop() {
    const link = document.createElement("a");
    link.download = "image.png";
    link.href = state.imageData;
    link.click();
    await setPop(<p>Please find your file in the album or folder.</p>);
    await setTimeout(() => {
      setPop();
    }, 1000);
  }

  return (
    <>
      <div className="viewer">
        <img src={state.imageData} alt="ss" className="h-full" />
        {/* <canvas className="canvas" ref={canvas} height={100} width={100}></canvas> */}
      </div>
      <Help/>
      {/* <div className="absolute bottom-0 z-[0]">
        <img src={"/image/frameGroup.png"} alt="frame" />
      </div> */}
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

export default ViewPhoto;
