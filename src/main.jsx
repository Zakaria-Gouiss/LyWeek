import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

const isElectron = window.lyweekElectron?.isElectron === true;
document.documentElement.classList.toggle("electron-runtime", isElectron);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App isElectron={isElectron} />
  </React.StrictMode>,
);
