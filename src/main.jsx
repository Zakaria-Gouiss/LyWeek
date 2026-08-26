import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import ElectronApp from "./ElectronApp.jsx";

const isElectron =
  new URLSearchParams(window.location.search).get("electron") === "true";
console.log(navigator.userAgent);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>{isElectron ? <ElectronApp /> : <App />}</React.StrictMode>,
);
