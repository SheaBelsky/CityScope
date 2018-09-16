import React from "react";
import GoogleMapReact from "google-map-react";
import {
    Form, Icon, Modal, TextArea,
} from "semantic-ui-react";

import ReportIcon from "../../components/ReportIcon";
import UserViewTemplate from "../../components/UserViewTemplate";

class UserMapView extends React.Component {
    // Lifecycle methods
    constructor() {
        super();
        this.state = {
            center: {
                lat: 43.472572799999995,
                lng: -80.54004979999999,
            },
            clickedCoords: {},
            existingIncidentID: null,
            loaded: false,
            markers: [],
            reportDescription: "",
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

    // Handles when modal button is clicked
    handleModalCloseClick = () => {
        this.setState({
            showNewReportModal: false,
        });
    }

    // When someone clicks on the map
    handleOnClick = (clickEvent) => {
        const {
            lat, lng,
        } = clickEvent;
        fetch(`/api/distance/${lat}/${lng}`)
            .then(response => response.json())
            .then((response) => {
                const { existingIncidentID } = response;
                this.setState({
                    clickedCoords: {
                        lat, lng,
                    },
                    existingIncidentID,
                    showNewReportModal: true,
                });
            })
            .catch((error) => {
                console.error(error);
            });
        // API endpoint: Determine if there is an existing report within 100 meters of this location
        // If yes, get its information (incident ID) and add to this report
        // If not, the creation of this report should create a new incident (and incident ID)
    }

    // Sets state of the report description based on the textarea value
    handleTextAreaChange = (event) => {
        this.setState({ reportDescription: event.target.value });
    }

    // When all the Google Maps tiles have loaded
    handleTilesLoaded = () => {
        this.setState({
            loaded: true,
        });
    }

    // ==============
    // Custom Methods
    // ==============

    // Creates a new report by saving it in local storage
    createReport = () => {
        const { clickedCoords, existingIncidentID, reportDescription } = this.state;
        const now = Math.round((new Date()).getTime() / 1000);
        const report = {
            coordinates: `${clickedCoords.lat},${clickedCoords.lng}`,
            description: reportDescription,
            incidentID: existingIncidentID,
            createdAt: now,
            updatedAt: now,
        };
        fetch("/api/create/report", {
            method: "put",
            body: JSON.stringify(report),
            headers: {
                "Content-Type": "application/json",
            },
        }).then((response) => {
            this.getReports();
            this.resetModal();
        }).catch((err) => {
            console.error(err, "error");
        });
    }

    getReports = () => {
        fetch("/api/read/report")
            .then(response => response.json())
            .then((response) => {
                this.setState({
                    markers: response,
                });
            });
    }

    // Resets the modal (after submission or when closed)
    resetModal = () => {
        this.setState({
            existingIncidentID: null,
            reportDescription: "",
            showNewReportModal: false,
        });
    }

    // The render function
    render() {
        const {
            center, loaded, markers, reportDescription, showNewReportModal, zoom,
        } = this.state;
        return (
            <UserViewTemplate loaded={loaded}>
                <Modal
                    closeOnDocumentClick={true}
                    closeIcon={<Icon name="cancel" style={{ cursor: "pointer", padding: 16 }} onClick={this.handleModalCloseClick} />}
                    onClose={this.resetModal}
                    open={showNewReportModal}
                >
                    <Modal.Header>New Report</Modal.Header>
                    <Modal.Content>
                        <Modal.Description>
                            <Form onSubmit={this.createReport}>
                                <h2>Describe the issue in detail</h2>
                                <TextArea
                                    autoFocus
                                    name="issueDetails"
                                    onChange={this.handleTextAreaChange}
                                    placeholder="Tell us more"
                                    value={reportDescription}
                                />
                                <Form.Button
                                    style={{
                                        display: "block",
                                        margin: "10px auto",
                                    }}
                                >
                                    Create New Report
                                </Form.Button>
                            </Form>
                        </Modal.Description>
                    </Modal.Content>
                </Modal>
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
            </UserViewTemplate>
        );
    }
}

export default UserMapView;
