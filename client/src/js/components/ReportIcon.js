import React from "react";
import { Icon, Modal } from "semantic-ui-react";

class ReportIcon extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
        };
    }

    handleClick = () => {
        console.log("click");
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
        const { marker } = this.props;
        const { showModal } = this.state;
        const {
            coordinates: {
                lat, lng,
            },
            createdAt,
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
                            <div>
                                <h2>Describe the issue in detail</h2>
                                {description}
                                <h2>Created At</h2>
                                {createdAt}
                            </div>
                        </Modal.Description>
                    </Modal.Content>
                </Modal>
            </div>
        );
    }
}

export default ReportIcon;
