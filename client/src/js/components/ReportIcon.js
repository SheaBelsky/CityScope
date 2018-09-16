import React from "react";
import { Icon } from "semantic-ui-react";

class ReportIcon extends React.Component {
    handleClick = () => {
        console.log("click");
    }

    render() {
        const { marker } = this.props;
        const {
            coordinates: {
                lat, lng,
            },
            createdAt,
            description,
            id,
            updatedAt,
        } = marker;

        const iconStyles = {
            cursor: "pointer",
            pointerEvents: "none",
        };
        return (
            <Icon
                className="reportIcon"
                key={id}
                name="exclamation triangle"
                onClick={this.handleClick}
                size="big"
                style={iconStyles}
            />
        );
    }
}

export default ReportIcon;
