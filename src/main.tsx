/* eslint-disable import/default */
import React from "react";
import { createRoot } from "react-dom/client";
// eslint-disable-next-line import/no-extraneous-dependencies
import { HashRouter } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { SnackbarUtilsConfigurator } from "./store/hooks";
import { Provider } from "react-redux";
import { store } from "./store/store";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <SnackbarProvider
        maxSnack={4}
        autoHideDuration={8000}
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
      >
        <SnackbarUtilsConfigurator />
        <HashRouter>
          <App />
        </HashRouter>
      </SnackbarProvider>
    </Provider>
  </React.StrictMode>
);
