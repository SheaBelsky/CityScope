import React from "react";
import { NavLink } from "react-router-dom";
import {
    Dimmer, Grid, Icon, Loader, Menu, Segment, Sidebar,
} from "semantic-ui-react";

class UserViewTemplate extends React.Component {
    render() {
        const { children, loaded } = this.props;
        return (
            <div>
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
                                    <Menu.Item as={NavLink} to="/app/">
                                        <Icon name="home" />
                                        Map
                                    </Menu.Item>
                                    <Menu.Item as={NavLink} to="/app/user/myreports">
                                        <Icon name="gamepad" />
                                        My Reports
                                    </Menu.Item>
                                    <Menu.Item as={NavLink} to="/app/about">
                                        <Icon name="camera" />
                                        About
                                    </Menu.Item>
                                </Sidebar>
                            </Sidebar.Pushable>
                        </Grid.Column>
                        <Grid.Column width={13}>
                            {children}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}

export default UserViewTemplate;
