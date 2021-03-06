import React from "react";
import { BrowserRouter, Route } from "react-router-dom";

import About from "./pages/About";
import AdminMapView from "./pages/admin/AdminMapView";
import AdminListIncidents from "./pages/admin/AdminListIncidents";
import UserMapView from "./pages/user/UserMapView";

class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <div id="page-container">
                    <Route exact path="/" component={UserMapView} />
                    <Route exact path="/app" component={UserMapView} />
                    {/* <Route exact path="/about" component={About} /> */}
                    <Route exact path="/app/admin" component={AdminMapView} />
                    <Route exact path="/app/admin/incidents" component={AdminListIncidents} />
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
