import { useState,useEffect } from "react";
import Panel from "./Panel";
import { createContext, useContext } from "react";
import ARView from "./components/ARView";
import { useDispatch, useSelector } from "react-redux";
import { PageState } from "./model/pageState";
import { Loading } from "./components";
import { DeviceOrientation } from "./components";
import './scss/app.scss'



export function usePageVisibility() {
  const [isVisible, setIsVisible] = useState(true);
  

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };
    const preventDefault = (e) => {
      e.preventDefault();
    };

    const preventZoom = (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };
    const preventDoubleClickZoom = (e) => {
      // If this is a double-tap event, prevent the default behavior
      const now = new Date().getTime();
      const lastTouch = e.target.dataset.lastTouch || now + 1;
      const delta = now - lastTouch;
      if (delta < 500 && delta > 0) {
        e.preventDefault();
        e.target.dataset.lastTouch = 0;
      } else {
        e.target.dataset.lastTouch = now;
      }
    };

    document.addEventListener('touchstart', preventZoom, { passive: false });
    document.addEventListener('touchmove', preventZoom, { passive: false });
    document.addEventListener('gesturestart', preventDefault);
    document.addEventListener('gesturechange', preventDefault);
    document.addEventListener('dblclick', preventDefault);
    document.addEventListener('touchend', preventDoubleClickZoom, { passive: false });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('touchstart', preventZoom);
      document.removeEventListener('touchmove', preventZoom);
      document.removeEventListener('gesturestart', preventDefault);
      document.removeEventListener('gesturechange', preventDefault);
      document.removeEventListener('dblclick', preventDefault);
      document.removeEventListener('touchend', preventDoubleClickZoom);
    };
  }, []);

  return isVisible;
}
// 這一段是在抓取手機頁面可視高度
// 參考文章:https://blog.jasonzhuang.com/blog/2023/02/19/mobile-viewport-height-unit/
let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

window.addEventListener('resize', () => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});


const ThemeContext = createContext(null);
function App() {
  const [theme, setTheme] = useState("");
  const state = useSelector((state) => state.AppState);



  
  return (
    <div className="App w-screen flex justify-center items-center relative">
      <ThemeContext.Provider value="dark">
        <Loading
          hidden={
            state.pageState <= PageState.Loading ? "" : "hidden"
          }
        />
        <DeviceOrientation/>
       <ARView  theme={theme} />
        {/* <Panel theme={theme} setTheme={setTheme} /> */}
      </ThemeContext.Provider>
    </div>
  );
}

export default App;
