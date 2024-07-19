import React, { useState } from "react";
import { useSelector } from "react-redux";
import Help from "./Help";
import { isMobile, isIOS } from "react-device-detect";
import { BiDownload } from "react-icons/bi";
import { TbHandFinger } from "react-icons/tb";

const ViewPhoto = function () {
  const [pop, setPop] = useState();
  const state = useSelector((state) => state.AppState);

  async function savePop() {
    if (state.imageData) {
      // 将 base64 编码的图片数据转换为 Blob
      const base64ToBlob = (base64, mime) => {
        const byteChars = atob(base64.split(",")[1]);
        const byteArrays = [];
        for (let offset = 0; offset < byteChars.length; offset += 512) {
          const slice = byteChars.slice(offset, offset + 512);
          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }
        return new Blob(byteArrays, { type: mime });
      };

      const blob = base64ToBlob(state.imageData, "image/png");
      const blobUrl = URL.createObjectURL(blob);

      // 创建下载链接
      const link = document.createElement("a");
      link.download = "image.png";
      link.href = blobUrl;

      // 对于 iOS Chrome，显示图像并提示用户手动保存
      if (navigator.userAgent.match(/CriOS/i)) {
        const imageWindow = window.open(blobUrl, "_blank");
        if (imageWindow) {
          imageWindow.document.write(
            "<p>请长按图像并选择“保存到相册”或“添加到照片”以保存图像。</p>"
          );
          imageWindow.document.write(
            `<img src="${blobUrl}" style="width: 100%;">`
          );
        }
      } else {
        link.click();
      }

      await setPop(
        <p className="text-[#020202] transition-all ease-in-out font-extrabold">
          请在相簿或资料夹中找到您的档案
        </p>
      );
      await setTimeout(() => {
        setPop();
      }, 2000);

      // 释放 Blob URL
      URL.revokeObjectURL(blobUrl);
    }
  }

  return (
    <>
      <div className="viewer">
        <img src={state.imageData} alt="ss" className="h-full" />
        {/* <canvas className="canvas" ref={canvas} height={100} width={100}></canvas> */}
      </div>
      <Help />
      {/* <div className="absolute bottom-0 z-[0]">
        <img src={"/image/frameGroup.png"} alt="frame" />
      </div> */}
      <div className=" absolute bottom-[25%] left-0 w-full flex flex-col items-center animate-pulse pt-8">
        <div>
          <TbHandFinger className=" fill-main animate-bounce text-6xl" />
        </div>

        <div
          className={` flex justify-center items-center mt-2 bg-main px-4 py-2 rounded-full ${
            isMobile && isIOS ? "" : "hidden"
          }`}
        >
          請<a className="font-bold">長按</a>畫面，選取儲存照片
          <BiDownload className="text-xl ml-2" />
        </div>
      </div>

      <div className="stepBtn-container">
        {/* <div className="info">請在相簿或資料夾中找到您的檔案</div> */}
        <div className="stepBtn-group">
          <button
            className={`${
              isMobile && isIOS ? "hidden" : ""
            } text-white text-base flex items-center rounded-full py-2 px-6 bg-main`}
            onClick={savePop}
          >
            儲存 <BiDownload className="text-xl ml-2 mb-1" />
          </button>
        </div>
        <div className="btn-pop text-black">{pop}</div>
      </div>
    </>
  );
};

export default ViewPhoto;
