import { useEffect,useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { FaChrome, FaSafari } from "react-icons/fa6";
import { PageState } from "../model/pageState";
import { usePageVisibility } from "../App";
function Loading(props) {
  const state = useSelector((state) => state.AppState);
  const dispatch = useDispatch();
  const [first,setFirst] = useState(true)
  const isVisible = usePageVisibility();

  function stopCameraAndMicrophone() {
    // 停止摄像头
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(mediaStream => {
            const videoTracks = mediaStream.getVideoTracks();
            videoTracks.forEach(track => {
                track.stop();
            });
        })
        .catch(error => {
            console.error('Error stopping camera:', error);
        });

    // 停止麦克风
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(mediaStream => {
            const audioTracks = mediaStream.getAudioTracks();
            audioTracks.forEach(track => {
                track.stop();
            });
        })
        .catch(error => {
            console.error('Error stopping microphone:', error);
        });
}

  useEffect(() => {
    if (!isVisible) {
      dispatch.AppState.setMusicStarted(false);
      // stopCameraAndMicrophone()
      // dispatch.AppState.setReset();
    
    } else {
      if (state.pageState === PageState.Loading && !first) {
        // dispatch.AppState.loadModelFile(true);
      
      }
    }
  }, [isVisible]);


  function loadModelFile() {
    dispatch.AppState.loadModelFile(false);
    setFirst(false)
  }

  useEffect(()=>{
    const shouldLoad = window.innerWidth < 1030;
    if(shouldLoad){
      loadModelFile()
    }
  
  },[])

  return (
    <div
      className={`loading text-blue-950 w-full h-full overflow-hidden absolute z-20 bg-main transition-all duration-200 ${
        props.hidden === "hidden"
          ? "z-[-1] pointer-events-none opacity-0"
          : "opacity-100"
      }`}
    >
      <div className="version">v{import.meta.env.VITE_VERSION}</div>
      <div className="loading-group w-full h-full flex  items-center flex-col p-5">
        <img
          src="/image/guanduLogo.png"
          alt=""
          className="mt-[10vh] mb-10 sm:w-[70%] w-[300px]"
        />
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
          網頁載入中
        </div>
        <div className="info mt-10">
          <div className="text-white text-xs sm:text-sm mb-3">
            *
            請使用行動裝置開啟網頁並將手機擺正和鎖定螢幕畫面以取得最佳體驗狀態。
          </div>
          <div className="text-white text-xs sm:text-sm mb-1">
            *請使用以下瀏覽器開啟網頁：
          </div>
          <div className="text-white text-xs sm:text-sm flex">
            Android 請使用Chrome <FaChrome className="text-lg ml-1 mr-7" />{" "}
            IPhone 請使用Safari <FaSafari className="text-lg ml-1 " />
          </div>
          <div className="text-white text-xs sm:text-sm mt-3">
            *建議手機作業系統和瀏覽器：
            <br />
            iOS 15.0、Android 9.0、Google Chrome 76 或更高版本。
          </div>
        </div>
        <div className="absolute bottom-[-10px] bottomDeco">
          <img src="/image/birds.png" alt="bottomDeco" className="birds" />
          <img src="/image/bikes.png" alt="bottomDeco" className="bikes" />
        </div>
      </div>

    </div>
  );
}

export default Loading;

Loading.propTypes = {
  hidden: PropTypes.string.isRequired,
};
