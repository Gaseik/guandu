import { IoIosClose, IoMdCamera } from "react-icons/io";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaAngleDoubleLeft,FaAngleDoubleRight } from "react-icons/fa";
import {isChrome	} from 'react-device-detect'
const words = [
  "點選螢幕上紅框內Download(下載)",
  "點選藍色的下載圖示",
  "點選紅框內的Downloads(下載項目)",
  "選取您剛剛錄製的影片",
  "點選左下角分享按鈕",
  "選擇紅框內 儲存影片(Save Video)",
];
const words_c = [
  "點選螢幕上紅框內Download(下載)",
  "點選紅框內的open in ...",
  "點選紅框內的Open in Download",
  "選取您剛剛錄製的影片",
  "點選左下角分享按鈕",
  "選擇紅框內 下載影片(Save Video)",
];



function Steps() {
  const state = useSelector((state) => state.AppState);
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  return (
    <div className="help-pop steps-pop z-50 relative">
        <div className={`absolute h-full top-0 justify-center w-6 px-1 flex items-center text-black left-0 ${step===1?'hidden':''}`} onClick={()=>{setStep(step-1)}}><FaAngleDoubleLeft/></div>
        <div className={`absolute h-full top-0 justify-center w-6 px-1 flex items-center text-black right-0 ${step===6?'hidden':''}`} onClick={()=>{setStep(step+1)}}><FaAngleDoubleRight/></div>
      <div className="text-black text-xl font-bold">步驟 {step} {step===6?"End":""}</div>
      <div
        className="btn close-icon-btn h-10 w-10 block absolute top-2 right-1"
        onClick={() => {
          dispatch.AppState.setStepsPop(!state.stepsPop);
        }}
      >
        <IoIosClose className="text-4xl text-[#020202]" />
      </div>
      <img className="w-[220px]" src={`/image/steps/step${isChrome?step+"_c":step}.png`} alt="" />
      <p className="help-small-scale font-bold mt-4 text-sm ">{isChrome?words_c[step-1]:words[step-1]}</p>
     
      <img
        src="/image/Boddarti2.png"
        alt=""
        className="absolute w-16 bottom-[-20px] boddarti"
      />
    </div>
  );
}

export default Steps;
