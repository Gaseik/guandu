import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsMusicNoteBeamed } from "react-icons/bs";
import { IoIosInformationCircle } from "react-icons/io";
import { IoCameraReverseOutline } from "react-icons/io5";

import { FaTrash } from "react-icons/fa6";
import { PageState } from "../model/pageState";
import { isSafari, isIOS } from "react-device-detect";

function Help(props) {
  const state = useSelector((state) => state.AppState);
  const dispatch = useDispatch();
  const [showTip,setShowTip] = useState(true)

  function onClickHelp() {
    dispatch.AppState.setHelpPop(!state.helpPop);
  }
  function onClickSteps() {
    console.log(state.stepsPop)
    dispatch.AppState.setStepsPop(!state.stepsPop);
  }
  function onClickClose() {
    dispatch.AppState.showDiscard(PageState.ViewVideo);
  }
  function onClickMusic() {
    if (state.playAuth) {
      dispatch.AppState.setPlayAuth(false);
    } else {
      dispatch.AppState.setPlayAuth(true);
    }
  }

  async function onChangeCamera() {
    dispatch.AppState.setSwitchCamera(!state.switchCamera)
  }

  useEffect(()=>{
    if(state.pageState === PageState.ARView){
      if(!state.playAuth){
        setTimeout(()=>{
          setShowTip(false)
        },6000)
      }else{
        setShowTip(false)
      }
    }else{
      setShowTip(true)
    }
 

  },[state.playAuth,state.pageState])


  return (
    <div className="btn help help-group">
      <Bicycle className="absolute right-[-10px] top-[-25px]" />
      <span className={`flex relative items-center ${state.pageState===PageState.ARView?"":"hidden"}`} onClick={onClickHelp}>
        <div className={`w-1 h-7 bg-red absolute rotate-45 ${state.helpPop?"hidden":""} left-4 sm:left-6`}></div>
        <IoIosInformationCircle className="sm:text-5xl text-[36px]  text-main " />
      </span>
      <span className={`flex relative items-center ${state.pageState===PageState.ViewVideo  && isIOS?"":"hidden"}`} onClick={onClickSteps}>
        <IoIosInformationCircle className="sm:text-5xl text-[36px]  text-main mr-2" />
        <div className={`${!state.stepsPop?"show":"gone"} tip absolute w-48 text-white bg-main left-[-155px] bottom-[-45px] text-center rounded-lg py-1 text-sm`}>iOS 用戶 下載流程</div>

      </span>
      <span
        className={` flex relative justify-center items-center ${!state.switchCamera?`bg-main`:"bg-white"} border-2 border-main  rounded-full sm:p-1.5 p-1 m-1  ${state.pageState===PageState.ARView?"":"hidden"} musicbtn`}
        onClick={onChangeCamera}
      >
        <IoCameraReverseOutline className={`text-[18px] sm:text-[26px]  ${state.switchCamera?`text-main`:"text-white"} `} />
      
      </span>
      <span
        className={`flex relative justify-center items-center  bg-main rounded-full p-1.5 m-1  ${state.pageState===PageState.ARView?"":"hidden"} musicbtn`}
        onClick={onClickMusic}
      >
        <div className={`w-1 h-7 bg-red absolute rotate-45 ${state.playAuth?"hidden":""}`}></div>
        <BsMusicNoteBeamed className="text-[18px] sm:text-[28px]  text-white" />
        <div className={`${showTip?"show":"gone"} tip absolute w-48 text-white bg-main left-[-160px] bottom-[-50px] text-center rounded-lg py-1 text-sm`}>請開啟音樂  體驗更佳！</div>
      </span>
      <div
        className={`rounded-full bg-white flex text-[#020202] font-bold  p-1  ${state.pageState!==PageState.ARView?"":"hidden"}`}
        onClick={onClickClose}
      >
        {" "}
        <FaTrash className="text-xl sm:text-3xl text-main  " />{" "}
      </div>
    </div>
  );
}

export default Help;

function Bicycle(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={42}
      height={33}
      fill="none"
      {...props}
    >
      <path
        fill="#E3CED2"
        d="M30.53 30.887a6.965 6.965 0 1 0 1.87-13.802 6.965 6.965 0 1 0-1.87 13.802Z"
      />
      <path
        fill="#6A3906"
        d="M30.435 31.473a7.508 7.508 0 0 1-4.476-2.31 7.501 7.501 0 0 1-2.049-5.408 7.494 7.494 0 0 1 2.378-5.27c3.033-2.852 7.827-2.706 10.68.33 2.854 3.032 2.71 7.826-.328 10.678a7.505 7.505 0 0 1-5.41 2.048 7.4 7.4 0 0 1-.795-.064v-.004Zm1.892-13.795a6.365 6.365 0 0 0-5.231 1.67 6.327 6.327 0 0 0-2.003 4.447 6.33 6.33 0 0 0 1.729 4.56 6.312 6.312 0 0 0 4.448 2.003 6.334 6.334 0 0 0 4.562-1.728 6.38 6.38 0 0 0 .278-9.007 6.338 6.338 0 0 0-3.783-1.945Z"
      />
      <path
        fill="#E3CED2"
        d="M8.361 23.442a6.965 6.965 0 1 0 1.87-13.802 6.965 6.965 0 1 0-1.87 13.802Z"
      />
      <path
        fill="#6A3906"
        d="M8.267 24.025a7.508 7.508 0 0 1-4.476-2.31 7.5 7.5 0 0 1-2.049-5.408 7.494 7.494 0 0 1 2.378-5.27c3.036-2.851 7.828-2.706 10.68.33 2.854 3.032 2.71 7.826-.328 10.678a7.505 7.505 0 0 1-5.41 2.048 7.376 7.376 0 0 1-.795-.064v-.004ZM10.16 10.23a6.365 6.365 0 0 0-5.231 1.67 6.328 6.328 0 0 0-2.003 4.447 6.33 6.33 0 0 0 1.729 4.561A6.346 6.346 0 0 0 9.1 22.914a6.333 6.333 0 0 0 4.563-1.728 6.38 6.38 0 0 0 .277-9.007 6.338 6.338 0 0 0-3.783-1.945v-.004ZM31.385 24.57a.59.59 0 0 1-.508-.65l2.145-19.363a.595.595 0 0 1 .239-.413.575.575 0 0 1 .467-.101l4.673.965a2.95 2.95 0 0 1 2.322 3.231 2.935 2.935 0 0 1-3.518 2.52l-1.11-.23a.589.589 0 1 1 .24-1.156l1.11.231c.487.103.98-.002 1.385-.29.405-.29.66-.723.72-1.219a1.769 1.769 0 0 0-1.39-1.931l-4.04-.833-2.076 18.718a.59.59 0 0 1-.652.522l-.014-.002.007.002ZM19.49 20.411a.59.59 0 0 1-.508-.65l1.6-14.455a.59.59 0 0 1 1.175.13l-1.6 14.455a.59.59 0 0 1-.653.522l-.014-.002Z"
      />
      <path
        fill="#6A3906"
        d="M19.494 20.412a.472.472 0 0 1-.1-.02l-10.276-3.29a.587.587 0 0 1-.404-.475.586.586 0 0 1 .25-.573l11.524-7.97a.623.623 0 0 1 .43-.098l12.134 1.988c.236.039.428.218.48.452a.592.592 0 0 1-.24.614L19.91 20.308a.587.587 0 0 1-.416.1v.004Zm-8.877-4.072 8.858 2.834 11.941-8.27L20.96 9.19l-10.341 7.15ZM31.184 26.052a2.086 2.086 0 1 0 .56-4.134 2.086 2.086 0 0 0-.56 4.134ZM23.577 4.223l-4.65-.794a1.184 1.184 0 1 0-.398 2.335l4.649.794a1.184 1.184 0 1 0 .399-2.335Z"
      />
      <path
        fill="#6A3906"
        d="M9.016 18.608a2.086 2.086 0 1 0 .561-4.134 2.086 2.086 0 0 0-.56 4.134Z"
      />
    </svg>
  );
}
