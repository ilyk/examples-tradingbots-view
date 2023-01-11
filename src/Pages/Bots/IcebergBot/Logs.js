import * as React from "react";
import {Container} from "react-bootstrap";
import LoadingOverlay from "react-loading-overlay";
import {priority, text, time} from "../../../_helpers";
import {LogViewer} from "../../../Components/LogsViewer";

export class LogsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: true,
            from: new Date(localStorage.getItem("iceberg-log-date-from") || new Date() - (60 * 60 * 1000)),
            to: localStorage.getItem("iceberg-log-date-to") ? new Date(localStorage.getItem("iceberg-log-date-to")) : new Date(),
            severity: localStorage.getItem("iceberg-log-severity") || priority.Info
        }
    }

    render() {
        return (
            <LoadingOverlay
                active={!this.state.loaded}
                spinner
                text='Loading...'
            >
                <Container fluid className={"mt-3"} style={{height: "500px"}}>
                    <LogViewer
                        url={`${this.props.api.baseUrl()}/logs?&from=:from&to=:to&severity=:severity`}
                        from={this.state.from}
                        to={this.state.to}
                        severity={this.state.severity}
                        format={this.formatPart}
                        lsPrefix={"iceberg-"}
                        tag={`${this.props.account}-${text.capitalize(this.props.exchange)}IcebergExchangeBot`}
                    />
                </Container>
            </LoadingOverlay>
        );
    }

    formatPart = obj => {
        return time.formatFromString(obj.timestamp, "MMMM d, yyyy HH:mm:ss") + " [" + priority.getName(obj.priority) + "] -- " + obj.message;
    }
}

