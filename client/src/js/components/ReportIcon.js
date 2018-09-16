import React from "react";
import {
    Icon, Modal,
} from "semantic-ui-react";

class ReportIcon extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            incident: null,
            showModal: false,
        };
    }

    componentDidMount() {
        const { marker } = this.props;
        fetch(`/api/read/incident/${marker.incident_id}`)
            .then(response => response.json())
            .then((response) => {
                this.setState({
                    incident: response[0],
                });
            }).catch((error) => {
                console.error(error);
            });
    }

    handleClick = () => {
        this.setState({
            showModal: true,
        });
    }

    handleModalCloseClick = () => {
        this.setState({
            showModal: false,
        });
    }

    render() {
        const { admin = false, marker } = this.props;
        const { showModal } = this.state;
        const {
            coordinates: {
                lat, lng,
            },
            updated,
            description,
            id,
        } = marker;

        const iconStyles = {
            cursor: "pointer",
        };
        return (
            <div>
                <Icon
                    className="reportIcon"
                    key={id}
                    name="exclamation triangle"
                    onClick={this.handleClick}
                    size="big"
                    style={iconStyles}
                />
                <Modal
                    closeOnDocumentClick={true}
                    closeIcon={<Icon name="cancel" style={{ cursor: "pointer", padding: 16 }} onClick={this.handleModalCloseClick} />}
                    open={showModal}
                >
                    <Modal.Header>View Report</Modal.Header>
                    <Modal.Content>
                        <Modal.Description>
                            <h2>Report Details</h2>
                            {description}
                            <h2 style={{ marginTop: 10 }}>Created At</h2>
                            {`${new Date(updated * 1000).toLocaleDateString()}`}
                        </Modal.Description>
                    </Modal.Content>
                </Modal>
            </div>
        );
    }
}

export default ReportIcon;
