import { useState } from "react";
import Panel from "./Panel";
import { createContext, useContext } from "react";
import ARView from "./components/ARView";
import { useDispatch, useSelector } from "react-redux";
import { PageState } from "./model/pageState";
import { Intro,Loading } from "./components";
import './scss/app.scss'

const ThemeContext = createContext(null);

function App() {
  const [theme, setTheme] = useState("");
  const state = useSelector((state) => state.AppState);
  return (
    <div className="w-screen h-screen flex justify-center items-center relative">
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
        <Panel theme={theme} setTheme={setTheme} />
      </ThemeContext.Provider>
    </div>
  );
}

export default App;
