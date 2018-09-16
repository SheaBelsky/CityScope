import React from "react";
import GoogleMapReact from "google-map-react";
import { Icon } from "semantic-ui-react";

import ReportIcon from "../../components/ReportIcon";
import AdminViewTemplate from "../../components/AdminViewTemplate";

class AdminMapView extends React.Component {
    // Lifecycle methods
    constructor() {
        super();
        this.state = {
            center: {
                lat: 59.95,
                lng: 30.33,
            },
            loaded: false,
            markers: [],
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
        fetch("/api/read/report")
            .then(response => response.json())
            .then((response) => {
                this.setState({
                    markers: response,
                });
            });
    }

    // ==============
    // Event handlers
    // ==============

    // When all the Google Maps tiles have loaded
    handleTilesLoaded = () => {
        this.setState({
            loaded: true,
        });
    }

    // ==============
    // Custom Methods
    // ==============

    // The render function
    render() {
        const {
            center, loaded, markers, zoom,
        } = this.state;
        return (
            <AdminViewTemplate loaded={loaded}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: process.env.GOOGLE_MAPS_API_KEY }}
                    center={center}
                    defaultZoom={zoom}
                    onClick={this.handleOnClick}
                    onTilesLoaded={this.handleTilesLoaded}
                >
                    {
                        markers.length > 0 && markers.map((marker) => {
                            if (marker !== null && typeof marker === "object") {
                                // const [lat, lng] = marker.coordinates.split(",");
                                console.log(marker);
                                return (
                                    <ReportIcon
                                        admin={true}
                                        className="reportIcon"
                                        key={marker.report_id}
                                        lat={lat}
                                        lng={lng}
                                        marker={marker}
                                    />
                                );
                            } else {
                                return (
                                    <Icon
                                        name="exclamation triangle"
                                    />
                                );
                            }
                        })
                    }
                </GoogleMapReact>
            </AdminViewTemplate>
        );
    }
}

export default AdminMapView;
