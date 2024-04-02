import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { FaChrome, FaSafari } from "react-icons/fa6";

function Loading(props) {
  const state = useSelector((state) => state.AppState);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch.AppState.loadModelFile(onTargetFound, onTargetLost);
  }, []);

  function onTargetFound(modelData) {
    // console.log(animationList);
    // animationList["Empty.001Action.001"].play()
  }
  function onTargetLost() {
    // dispatch.AppState.setTargetFind(false);
  }

  return (
    <div
      className={`loading max-w-[600px] text-blue-950 w-full h-full overflow-hidden absolute z-20 bg-main transition-all duration-200 ${
        props.hidden === "hidden"
          ? "z-[-1] pointer-events-none opacity-0"
          : "opacity-100"
      }`}
    >
      <div className="loading-group w-full h-full flex  items-center flex-col p-5">
        <img src="/image/guanduLogo.png" alt="" className="mt-[16vh] mb-10" />
        <div
          className="my-3 inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-white motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
        <div className="text-white font-bold text-2xl">網頁載入中</div>
        <div className="info mt-10">
          <div className="text-white text-xs mb-3">
            *
            請使用行動裝置開啟網頁並將手機擺正和鎖定螢幕畫面以取得最佳體驗狀態。
          </div>
          <div className="text-white text-xs mb-1">
            *請使用以下瀏覽器開啟網頁：
          </div>
          <div className="text-white text-xs flex">
            Android 請使用Chrome <FaChrome className="text-lg ml-1 mr-7" />{" "}
            IPhone 請使用Safari <FaSafari className="text-lg ml-1 " />
          </div>
          <div className="text-white text-xs mt-3">
            *建議手機作業系統和瀏覽器：
            <br />
            iOS 15.0、Android 9.0、Google Chrome 76 或更高版本。
          </div>
        </div>
        <div className="absolute bottom-[-10px] bottomDeco">
          <img src="/image/bottomDeco.png" alt="bottomDeco" />
        </div>
      </div>

      {/* <img className="asus-logo" src="/image/ASUS-logo.png" alt="" /> */}
    </div>
  );
}

export default Loading;

Loading.propTypes = {
  hidden: PropTypes.string.isRequired,
};

function LoadingSvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={30}
      style={{
        enableBackground: "new 0 0 50 50",
      }}
    >
      <path fill="#f97316" d="M0 0h4v10H0z">
        <animateTransform
          attributeName="transform"
          attributeType="xml"
          begin={0}
          dur="0.6s"
          repeatCount="indefinite"
          type="translate"
          values="0 0; 0 20; 0 0"
        />
      </path>
      <path fill="#f97316" d="M10 0h4v10h-4z">
        <animateTransform
          attributeName="transform"
          attributeType="xml"
          begin="0.2s"
          dur="0.6s"
          repeatCount="indefinite"
          type="translate"
          values="0 0; 0 20; 0 0"
        />
      </path>
      <path fill="#f97316" d="M20 0h4v10h-4z">
        <animateTransform
          attributeName="transform"
          attributeType="xml"
          begin="0.4s"
          dur="0.6s"
          repeatCount="indefinite"
          type="translate"
          values="0 0; 0 20; 0 0"
        />
      </path>
    </svg>
  );
}
