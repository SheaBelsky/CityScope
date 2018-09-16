import React from "react";
import {
    Form, Modal, Icon, Table, TextArea,
} from "semantic-ui-react";

import AdminViewTemplate from "../../components/AdminViewTemplate";

class AdminListIncidents extends React.Component {
    // Lifecycle methods
    constructor() {
        super();
        this.state = {
            activeIncident: 0,
            incidents: [],
        };
    }

    // Get the browser's location and set the map's position based on it
    componentDidMount() {
        this.getIncidents();
    }

    // ==============
    // Custom Methods
    // ==============
    changeActiveIncident = (incident_id) => {
        this.setState({
            activeIncident: incident_id,
        });
    }

    getIncidents = () => {
        fetch("/api/read/incident")
            .then(response => response.json())
            .then((response) => {
                this.setState({
                    incidents: response,
                });
            });
    }

    // The render function
    render() {
        const { activeIncident, incidents } = this.state;
        return (
            <AdminViewTemplate loaded={true}>
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>ID #</Table.HeaderCell>
                            <Table.HeaderCell>Progress</Table.HeaderCell>
                            <Table.HeaderCell>Resolution</Table.HeaderCell>
                            <Table.HeaderCell>Updated On</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {
                            incidents.length > 0 && incidents.map((incident) => {
                                console.log(activeIncident, incident.incident_id, activeIncident === incident.incident_id);
                                return (
                                    <Table.Row key={incident.incident_id}>
                                        <Table.Cell onClick={() => this.changeActiveIncident(incident.incident_id)}>{incident.incident_id}</Table.Cell>
                                        <Table.Cell>{incident.progress}</Table.Cell>
                                        <Table.Cell>{incident.resolution}</Table.Cell>
                                        <Table.Cell>{`${new Date(incident.updated * 1000).toLocaleDateString()}`}</Table.Cell>
                                        <IncidentModal
                                            incident={incident}
                                            showModal={activeIncident === incident.incident_id}
                                        />
                                    </Table.Row>
                                );
                            })
                        }
                    </Table.Body>
                </Table>
            </AdminViewTemplate>
        );
    }
}

class IncidentModal extends React.Component {
    constructor(props) {
        super(props);
        const { incident } = props;
        this.state = {
            progress: incident.progress,
            resolution: incident.resolution,
        };
    }

    // ==============
    // Event handlers
    // ==============
    handleProgressChange = (event) => {
        this.setState({ progress: event.target.value });
    }

    handleResolutionChange = (event) => {
        this.setState({ resolution: event.target.value });
    }

    updateIncident = () => {
        const { progress, resolution } = this.state;
        const { incident } = this.props;
        const now = Math.round((new Date()).getTime() / 1000);
        const data = {
            progress,
            resolution,
            incident_id: incident.incident_id,
            updatedAt: now,
        };
        fetch(`/api/update/incident/${incident.incident_id}`, {
            method: "put",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        }).then((response) => {
            this.setState({
                progress: "",
                resolution: "",
            });
        }).catch((err) => {
            console.error(err, "error");
        });
    }

    render() {
        const { incident, showModal } = this.props;
        const { progress, resolution } = this.state;
        return (
            <Modal
                closeOnDocumentClick={true}
                closeIcon={<Icon name="cancel" style={{ cursor: "pointer", padding: 16 }} onClick={() => this.handleModalCloseClick(0)} />}
                open={showModal}
            >
                <Modal.Header>View Report</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <h2>Progress</h2>
                        <Form onSubmit={this.updateIncident}>
                            <h2>Incident Progress</h2>
                            <TextArea
                                autoFocus
                                name="progress"
                                onChange={this.handleProgressChange}
                                value={progress}
                            />
                            <h2>Incident Resolution</h2>
                            <TextArea
                                autoFocus
                                name="resolution"
                                onChange={this.handleResolutionChange}
                                value={resolution}
                            />
                            <Form.Button
                                style={{
                                    display: "block",
                                    margin: "10px auto",
                                }}
                            >
                                Edit Incident
                            </Form.Button>
                        </Form>
                    </Modal.Description>
                </Modal.Content>
            </Modal>
        );
    }
}

export default AdminListIncidents;
