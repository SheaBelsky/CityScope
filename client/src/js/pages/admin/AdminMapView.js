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
                lat: 43.472572799999995,
                lng: -80.54004979999999,
            },
            loaded: false,
            markers: [],
            showNewReportModal: false,
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
        this.getReports();
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
    getReports = () => {
        fetch("/api/read/report")
            .then(response => response.json())
            .then((response) => {
                this.setState({
                    markers: response,
                });
            });
    }

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
                                const [lat, lng] = marker.coordinates.split(",");
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
