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
            from: new Date(localStorage.getItem("pump-n-dump-log-date-from") || new Date() - (60 * 60 * 1000)),
            to: localStorage.getItem("pump-n-dump-log-date-to") ? new Date(localStorage.getItem("pump-n-dump-log-date-to")) : new Date(),
            severity: localStorage.getItem("pump-n-dump-log-severity") || priority.Info
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
                        lsPrefix={"pump-n-dump-"}
                        tag={`${this.props.account}-${text.capitalize(this.props.exchange)}PumpNDumpExchangeBot`}
                    />
                </Container>
            </LoadingOverlay>
        );
    }

    formatPart = obj => {
        return time.formatFromString(obj.timestamp, "MMMM d, yyyy HH:mm:ss") + " [" + priority.getName(obj.priority) + "] -- " + obj.message;
    }
}

