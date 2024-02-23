/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line @typescript-eslint/no-unused-vars, import/default
import React, { useEffect} from "react";
import { Routes, Route } from "react-router-dom";
import MainViewComponent from "./MainView/MainViewComponent";
import PrivacyPolicy from "./PrivacyPolicy/PrivacyPolicy";
import HarvesterDashBoard from "./HarvesterDashBoard/HarvesterDashBoard";
import * as constants from "./store/constants";
import { useRootDispatch } from "./store/hooks";
import "ol/ol.css";
import "ol-layerswitcher/dist/ol-layerswitcher.css";
import "./App.css";

function App() {
  const dispatch = useRootDispatch();
 
  useEffect(() => {
    const dispatchConstants = () => {
      dispatch({ type: constants.TRAFFICABILITY_API });
      dispatch({ type: constants.SOILWETNESS_API });
      dispatch({ type: constants.SOILTEMPERATUE_API });
      dispatch({ type: constants.SNOWHEIGHT_API });
      dispatch({ type: constants.WINDGUST_API });
      dispatch({ type: constants.SETWMSLAYERINFORMATION });
    }
    window.addEventListener("load", dispatchConstants)    
    return () => {
      window.removeEventListener('load', dispatchConstants)
    }
  }, []);
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HarvesterDashBoard />}>
          <Route path="/" element={<MainViewComponent />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
