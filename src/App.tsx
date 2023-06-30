/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line @typescript-eslint/no-unused-vars, import/default
import React from "react";
import { Box } from "@mui/material";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainViewComponent from "./MainView/MainViewComponent";
import PrivacyPolicy from "./PrivacyPolicy/PrivacyPolicy";
import "ol/ol.css";
import "ol-layerswitcher/dist/ol-layerswitcher.css";
import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: (<MainViewComponent />),
  },
  {
    path: "privacy-policy",
    element: (<PrivacyPolicy />),
  },
]);

function App() {
  return (
    <div className="App">
      <Box>
				<RouterProvider router={router} />
      </Box>
    </div>
  );
}

export default App;
