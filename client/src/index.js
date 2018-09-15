// Node module imports
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";

// Import pages
import UserMapView from "./js/pages/user/MapView";

import "./css/index.less";

ReactDOM.render(
    <BrowserRouter>
        <div id="page-container">
            <Route exact path="/" component={UserMapView} />
        </div>
    </BrowserRouter>,
    document.getElementById("root"),
);
