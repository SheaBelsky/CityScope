import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import {
    Dimmer, Grid, Icon, Loader, Menu, Segment, Sidebar,
} from "semantic-ui-react";

import UserMapView from "./pages/user/MapView";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
        };
    }

    undim = () => {
        this.setState({
            loaded: true,
        });
    }

    render() {
        const { loaded } = this.state;
        return (
            <Grid className="gridContainer">
                <Dimmer active={!loaded}>
                    <Loader disabled={loaded}>
                        <h1>CityScope</h1>
                        Loading data, please wait...
                    </Loader>
                </Dimmer>
                <Grid.Row>
                    <Grid.Column width={3}>
                        <Sidebar.Pushable as={Segment}>
                            <Sidebar
                                as={Menu}
                                animation="overlay"
                                className="sidebarMenu"
                                icon="labeled"
                                inverted
                                vertical
                                visible={true}
                                width="thin"
                            >
                                <h1>CityScope</h1>
                                <Menu.Item as="a">
                                    <Icon name="home" />
                                    Map
                                </Menu.Item>
                                <Menu.Item as="a">
                                    <Icon name="gamepad" />
                                    My Reports
                                </Menu.Item>
                                <Menu.Item as="a">
                                    <Icon name="camera" />
                                    About
                                </Menu.Item>
                            </Sidebar>
                        </Sidebar.Pushable>
                    </Grid.Column>
                    <Grid.Column width={13}>
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
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

export default App;
