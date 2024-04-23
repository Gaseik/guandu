import { useState,useEffect } from "react";
import Panel from "./Panel";
import { createContext, useContext } from "react";
import ARView from "./components/ARView";
import { useDispatch, useSelector } from "react-redux";
import { PageState } from "./model/pageState";
import { Intro,Loading } from "./components";
import { UseMobile } from "./components";
import './scss/app.scss'

export function usePageVisibility() {
  const [isVisible, setIsVisible] = useState(true);
  

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
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
        <UseMobile/>
        {/* <Intro
          style={state.pageState === PageState.Intro ? {} : { display: "none" }}
        /> */}
       <ARView  theme={theme} />
        {/* <Panel theme={theme} setTheme={setTheme} /> */}
      </ThemeContext.Provider>
    </div>
  );
}

export default App;
