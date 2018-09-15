import React from "react";
import GoogleMapReact from "google-map-react";
import { Dimmer, Loader } from "semantic-ui-react";

class MapView extends React.Component {
    constructor() {
        super();
        this.state = {
            center: {
                lat: 59.95,
                lng: 30.33,
            },
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
        const {
            x, y, lat, lng, event,
        } = clickEvent;
        // API endpoint: Determine if there is an existing report within 100 meters of this location
        // If yes, get its information (incident ID) and add to this report
        // If not, the creation of this report should create a new incident (and incident ID)
    }

    // When all the Google Maps tiles have loaded
    handleTilesLoaded = () => {
        const { undim } = this.props;
        undim();
    }

    render() {
        const { center, zoom } = this.state;
        return (
            <div className="mapContainer">
                <GoogleMapReact
                    bootstrapURLKeys={{ key: process.env.GOOGLE_MAPS_API_KEY }}
                    center={center}
                    defaultZoom={zoom}
                    onClick={this.handleOnClick}
                    onTilesLoaded={this.handleTilesLoaded}
                />
            </div>
        );
    }
}

export default MapView;
