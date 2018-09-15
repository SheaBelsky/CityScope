import React from "react";
import { BrowserRouter, Route } from "react-router-dom";

import UserMapView from "./pages/user/UserMapView";

class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <div id="page-container">
                    <Route
                        exact
                        path="/"
                        render={() => (
                            <UserMapView undim={this.undim} />
                        )}
                    />
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
