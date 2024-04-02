import { useState,useEffect } from "react";
import Panel from "./Panel";
import { createContext, useContext } from "react";
import ARView from "./components/ARView";
import { useDispatch, useSelector } from "react-redux";
import { PageState } from "./model/pageState";
import { Intro,Loading } from "./components";
import './scss/app.scss'

// 這一段是在抓取手機頁面可視高度
// 參考文章:https://blog.jasonzhuang.com/blog/2023/02/19/mobile-viewport-height-unit/
const ThemeContext = createContext(null);
let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

window.addEventListener('resize', () => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});



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
        <Intro
          style={state.pageState === PageState.Intro ? {} : { display: "none" }}
        />
        <ARView  theme={theme} />
        {/* <Panel theme={theme} setTheme={setTheme} /> */}
      </ThemeContext.Provider>
    </div>
  );
}

export default App;
