import {OverlayTrigger, Tooltip} from "react-bootstrap";
import React from "react";

export class BotStatusIcon extends React.Component {
    props: {
        status: '',
        id: ''
    }

    render() {
        return (
            <React.Fragment>
                <OverlayTrigger
                    placement={"auto"}
                    overlay={
                        <Tooltip id={this.props.id}>
                            {this.props.status}
                        </Tooltip>
                    }
                >
                    <span className={`dot dot-xs ${this.props.status}`}/>
                </OverlayTrigger>
            </React.Fragment>
        );
    }
}