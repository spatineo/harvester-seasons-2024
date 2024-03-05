/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line @typescript-eslint/no-unused-vars, import/default
import { useEffect} from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import MainViewComponent from "./MainView/MainViewComponent";
import PrivacyPolicy from "./PrivacyPolicy/PrivacyPolicy";
import HarvesterDashBoard from "./HarvesterDashBoard/HarvesterDashBoard";
import * as constants from "./store/constants";
import { useRootDispatch, useAppSelector } from "./store/hooks";
import { RootState } from "./store/store";
import "ol/ol.css";
import "ol-layerswitcher/dist/ol-layerswitcher.css";
import "./App.css";

function App() {
  const { position } = useAppSelector((state: RootState) => state.mapState)
  const dispatch = useRootDispatch();
  const navigate = useNavigate();
 
  useEffect(() => {
    dispatch({ type: constants.TRAFFICABILITY_API });
    dispatch({ type: constants.SOILWETNESS_API });
    dispatch({ type: constants.SOILTEMPERATUE_API });
    dispatch({ type: constants.SNOWHEIGHT_API });
    dispatch({ type: constants.WINDGUST_API });
    dispatch({ type: constants.SETWMSLAYERINFORMATION });
    if(position.lat !== null && position.lon !== null){
    navigate(`/${position.lat},${position.lon}`)
    }
  }, [position.lat, position.lon]);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HarvesterDashBoard />}>
          <Route path="/" element={<MainViewComponent />} />
          <Route path="/:position" element={<MainViewComponent />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
