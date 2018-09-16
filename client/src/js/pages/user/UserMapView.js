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
                lat: 59.95,
                lng: 30.33,
            },
            clickedCoords: {},
            loaded: false,
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
            x, y, lat, lng, event,
        } = clickEvent;
        this.setState({
            clickedCoords: {
                lat, lng,
            },
            showNewReportModal: true,
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
        const { clickedCoords, reportDescription } = this.state;
        const now = new Date();
        const report = {
            coordinates: clickedCoords,
            description: reportDescription,
            createdAt: now,
            updatedAt: now,
        };
        let numReports = localStorage.getItem("numReports");
        if (numReports !== null && !isNaN(numReports)) {
            numReports = parseInt(numReports);
            report.id = numReports + 1;
            const stringifiedReport = JSON.stringify(report);
            localStorage.setItem("numReports", `${report.id}`);
            localStorage.setItem(`report${report.id}`, stringifiedReport);
        } else {
            report.id = 1;
            const stringifiedReport = JSON.stringify(report);
            localStorage.setItem("numReports", "1");
            localStorage.setItem("report1", stringifiedReport);
        }
        this.resetModal();
    }

    // Retrieves markers from localStorage, processes them, and returns in the form of an array
    processsMarkers = () => {
        let numReports = localStorage.getItem("numReports");
        const markers = [];
        if (numReports !== null && !isNaN(numReports)) {
            numReports = parseInt(numReports);
            for (let i = 1; i <= numReports; i++) {
                const report = localStorage.getItem(`report${i}`);
                markers.push(JSON.parse(report));
            }
        }
        return markers;
    }

    // Resets the modal (after submission or when closed)
    resetModal = () => {
        this.setState({
            reportDescription: "",
            showNewReportModal: false,
        });
    }

    // The render function
    render() {
        const {
            center, loaded, reportDescription, showNewReportModal, zoom,
        } = this.state;
        const markers = this.processsMarkers();
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
                                return (
                                    <ReportIcon
                                        className="reportIcon"
                                        key={marker.id}
                                        lat={marker.coordinates.lat}
                                        lng={marker.coordinates.lng}
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
