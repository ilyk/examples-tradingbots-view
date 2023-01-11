import * as React from "react";
import {Container} from "react-bootstrap";
import LoadingOverlay from "react-loading-overlay";
import {Status} from "../../../_services";
import {priority, time} from "../../../_helpers";
import {LogViewer} from "../../../Components/LogsViewer";
import {Api} from "../../../_api";

export class LogsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: true,
            from: new Date(localStorage.getItem("history-log-date-from") || new Date() - (60 * 60 * 1000)),
            to: localStorage.getItem("history-log-date-to") ? new Date(localStorage.getItem("history-log-date-to")) : new Date(),
            severity: localStorage.getItem("history-log-severity") || priority.Info
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
                    <LogViewer url={`${Api.forHistory().botBaseUrl()}/logs?from=:from&to=:to&severity=:severity`}
                               from={this.state.from}
                               to={this.state.to}
                               severity={this.state.severity}
                               format={this.formatPart}
                               subscriber={Status.messages.history}
                               lsPrefix={"history-"}
                    />
                </Container>
            </LoadingOverlay>
        );
    }

    formatPart = obj => {
        return time.formatFromString(obj.timestamp, "MMMM d, yyyy HH:mm") + " [" + priority.getName(obj.priority) + "] -- " + obj.message;
    }
}

