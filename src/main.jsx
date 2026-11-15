import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

const isElectron =
  new URLSearchParams(window.location.search).get("electron") === "true";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App isElectron={isElectron} />
  </React.StrictMode>,
);
