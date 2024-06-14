import React, { useState,  useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdSaveAlt } from "react-icons/md";
import Help from "./Help";
import {saveApi} from '../helper/api';


const ViewPhoto = function () {
  const [pop, setPop] = useState();
  const [type , setType] = useState(0);
  const state = useSelector((state) => state.AppState);
  const dispatch = useDispatch();

  useEffect(()=>{
    setType(state.detect)
  },[])

  async function savePop() {
    const link = document.createElement("a");
    link.download = "image.png";
    link.href = state.imageData;
    link.click();
    saveApi(type)
    await setPop(<p className="text-[#020202] transition-all ease-in-out font-extrabold">請在相簿或資料夾中找到您的檔案</p>);
    await setTimeout(() => {
      setPop();
    }, 2000);
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
        {/* <div className="info">請在相簿或資料夾中找到您的檔案</div> */}
        <div className="stepBtn-group">
          <button
            className="text-white text-base flex items-center rounded-full py-2 px-6 bg-main"
            onClick={savePop}
          >
            儲存 <MdSaveAlt className="text-xl ml-2 mb-1" />
          </button>
        </div>
        <div className="btn-pop text-black">{pop}</div>
      </div>
    </>
  );
};

export default ViewPhoto;
