/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line @typescript-eslint/no-unused-vars, import/default
import React from "react";
import { Routes, Route } from "react-router-dom";
import MainViewComponent from "./MainView/MainViewComponent";
import PrivacyPolicy from "./PrivacyPolicy/PrivacyPolicy";
import HarvesterDashBoard from "./HarvesterDashBoard/HarvesterDashBoard";
import LeafletComponent from "./LeafletMap/LeafletMap";
import "ol/ol.css";
import "ol-layerswitcher/dist/ol-layerswitcher.css";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HarvesterDashBoard />}>
          <Route path="/" element={<MainViewComponent />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/leaflet" element={<LeafletComponent />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
