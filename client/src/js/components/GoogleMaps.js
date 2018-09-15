import React from "react";
import GoogleMapReact from "google-map-react";

export class MapContainer extends React.Component {
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

    handleOnClick = (clickEvent) => {
        const {
            x, y, lat, lng, event,
        } = clickEvent;
        console.log(clickEvent);
    }

    render() {
        const { center, zoom } = this.state;
        return (
            <div style={{ height: "100vh", width: "100%" }}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: process.env.GOOGLE_MAPS_API_KEY }}
                    center={center}
                    defaultZoom={zoom}
                    onClick={this.handleOnClick}
                />
            </div>
        );
    }
}

export default MapContainer;
