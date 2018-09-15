import React from "react";
import GoogleMapReact from "google-map-react";
import {
    Dimmer, Grid, Icon, Loader, Menu, Segment, Sidebar,
} from "semantic-ui-react";

import UserViewTemplate from "../../components/UserViewTemplate";

class MapView extends React.Component {
    constructor() {
        super();
        this.state = {
            center: {
                lat: 59.95,
                lng: 30.33,
            },
            loaded: false,
            zoom: 18,
        };
    }

    // Get the browser's location and set the map's position based on it
    componentDidMount() {
        if (navigator && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const { coords } = pos;
                this.setState({
                    center: {
                        lat: coords.latitude,
                        lng: coords.longitude,
                    },
                });
            });
        }
    }

    // When someone clicks on the map
    handleOnClick = (clickEvent) => {
        console.log("click on map");
        const {
            x, y, lat, lng, event,
        } = clickEvent;
        // API endpoint: Determine if there is an existing report within 100 meters of this location
        // If yes, get its information (incident ID) and add to this report
        // If not, the creation of this report should create a new incident (and incident ID)
    }

    // When all the Google Maps tiles have loaded
    handleTilesLoaded = () => {
        console.log("loaded");
        this.setState({
            loaded: true,
        });
    }

    render() {
        const { center, loaded, zoom } = this.state;
        return (
            <UserViewTemplate loaded={loaded}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: process.env.GOOGLE_MAPS_API_KEY }}
                    center={center}
                    defaultZoom={zoom}
                    onClick={this.handleOnClick}
                    onTilesLoaded={this.handleTilesLoaded}
                />
            </UserViewTemplate>
        );
    }
}

export default MapView;
