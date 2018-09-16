// Node module imports
import React from "react";
import ReactDOM from "react-dom";

import App from "./js/App";

// Import pages
import "./img/cityIcon192.png";
import "./img/cityIcon512.png";
import "./css/index.less";


ReactDOM.render(
    <App />,
    document.getElementById("root"),
);

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js");
}
