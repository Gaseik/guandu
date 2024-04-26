import React,{useState,useEffect} from "react";

const DeviceOrientation = function (props) {
    const [orientation, setOrientation] = useState(false);

    useEffect(() => {
      const handleOrientationChange = () => {
        const isLandscape = window.orientation === 90 || window.orientation === -90;
        setOrientation(isLandscape );
      };
  
      handleOrientationChange(); // 初始化
  
      window.addEventListener('orientationchange', handleOrientationChange);
  
      return () => {
        window.removeEventListener('orientationchange', handleOrientationChange);
      };
    }, []);
    return (
        <div className={`z-50 lg:flex ${orientation?"flex":"hidden"}`}>
        <div className="use-mobile-background">
          <div className="contain-group">
            <div className="icon-group">
              <SvgComponent/>
              {/* <img src="/image/icon/computer-icon.svg" className="computer-icon" alt="" />
              <img src="/image/icon/east-icon.svg" className="east-icon" alt="" />
              <img src="/image/icon/phone-icon.svg" className="phone-icon" alt="" /> */}
            </div>
            <div className="use-mobile-text">
              <p>請使用手機或是平板移動裝置<br/>並且將裝置以直式繼續體驗 :)</p>
            
            </div>
          
          </div>
        </div>
      </div>
    )
}

export default DeviceOrientation;


const SvgComponent = (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={75}
      height={75}
      fill="none"
      {...props}
    >
      <path
        fill="#fff"
        fillRule="evenodd"
        d="M30.197 1.514c-1.01 1.01-1.514 2.227-1.514 3.652v23.411H5.273c-1.426 0-2.643.505-3.653 1.514C.61 31.101.106 32.318.106 33.743v35.985c0 1.425.505 2.642 1.514 3.652 1.01 1.01 2.227 1.514 3.652 1.514H69.76c1.425 0 2.643-.505 3.652-1.514 1.01-1.01 1.514-2.227 1.514-3.652V37.403H75V5.166c0-1.425-.505-2.642-1.514-3.652C72.476.504 71.259 0 69.834 0H33.849c-1.425 0-2.642.505-3.652 1.514Zm40.795 27.2V11.847h-38.3v16.731h37.067c.43 0 .84.046 1.233.138Zm-38.3-20.876h38.3V5.166c0-.297-.119-.564-.356-.802-.238-.237-.505-.356-.802-.356H33.849c-.297 0-.564.119-.801.356-.238.238-.357.505-.357.802v2.672Zm37.067 63.048h-8.461v-38.3h8.461c.297 0 .564.118.802.356.238.237.356.504.356.801v35.985c0 .297-.118.564-.356.802-.238.237-.505.356-.802.356Zm-1.87-20.932c.475.475.713 1.07.713 1.782 0 .653-.238 1.232-.713 1.736-.475.505-1.069.758-1.781.758-.713 0-1.307-.238-1.782-.713-.475-.475-.712-1.069-.712-1.781 0-.653.237-1.232.712-1.737.475-.505 1.069-.757 1.782-.757.712 0 1.306.237 1.78.712Zm-10.6-17.369v38.3H11.952v-38.3H57.29Zm-49.345 0v38.3H5.272c-.297 0-.564-.118-.802-.355-.237-.238-.356-.505-.356-.802V33.743c0-.297.119-.564.356-.801.238-.238.505-.357.802-.357h2.672Z"
        clipRule="evenodd"
      />
      <path
        fill="#41BBC6"
        d="M2.966 22.45h2.745v-5.52c0-.924.313-1.699.94-2.325.625-.626 1.39-.939 2.296-.939h10.835l-3.959 3.958 1.907 1.907 7.252-7.223-7.252-7.223-1.907 1.907 3.959 3.958H8.947c-1.656 0-3.067.578-4.233 1.734-1.165 1.155-1.748 2.571-1.748 4.247v5.518Z"
      />
    </svg>
  )