import * as React from "react";
import {getParams, handleError, handleJsonResponse, priority} from "../../_helpers";
import styles from "./LogViewer.module.sass";
import {Panel} from "./Panel";
import {Viewer} from "./Viewer";
import {StatusBar} from "./StatusBar";
import {Status} from "../../_services";

export class LogViewer extends React.Component {
    static defaultProps = {
        format: line => line,
        from: new Date(),
        to: new Date(),
        severity: priority.Info,
        tag: "",
        lsPrefix: "",
    }

    constructor(props) {
        super(props);
        this.subscriber = this.props.subscriber || Status.messages.logs;
        this.state = {
            lines: [],
            ids: [],
            filteredLines: [],
            status: "",
            from: props.from,
            to: props.to,
            severity: props.severity,
            loaded: false,
            tag: props.tag,
            tags: [],
            search: "",
            subscription: {},
        }
    }

    componentWillUnmount = () => {
        if (typeof super.componentWillUnmount === 'function') {
            super.componentWillUnmount();
        }
        if (typeof this.state.subscription.unsubscribe === 'function') {
            this.state.subscription.unsubscribe()
        }
        this.subscriber.unsubscribe()
    }

    componentDidMount = () => {
        this.load()
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (prevProps.tag !== this.props.tag) {
            this.componentWillUnmount()
            this.componentDidMount()
        }
        if (prevState.tag !== this.state.tag ||
            prevState.from !== this.state.from ||
            prevState.to !== this.state.to ||
            prevState.severity !== this.state.severity) {
            this.load()
        }
    }

    load = () => {
        this.setState({lines: [], loaded: false})
        const url = this.props.url
            .replace(":from", this.state.from.toISOString())
            .replace(":to", this.state.to.toISOString())
            .replace(":severity", this.state.severity)
        fetch(url, getParams())
            .then(handleJsonResponse)
            .catch(handleError(this))
            .then(logs => this.setState(() => {
                let _logs = (logs || []).reverse();
                let ids = [], tags = []
                _logs.map(log => {
                    ids.push(log.timestamp + "_" + log.id)
                    tags.push(log.tag)
                    return log
                })
                return {lines: _logs, ids: ids, tags: tags};
            }))
            .then(() => this.updateFilters())
            .then(this.setState({loaded: true}))
            .then(() => this.subscribe())
    }

    subscribe = () => {
        this.setState(state => {
            if (typeof state.subscription.unsubscribe === 'function') {
                state.subscription.unsubscribe()
            }
            return ({
                subscription: this.subscriber.subscribe(
                    state.severity,
                    state.from,
                    state.to,
                    state.tag,
                    log => this.logCallback(log),
                )
            });
        })
    }

    logCallback = log => {
        this.setState(prevState => {
            const id = log.timestamp + "_" + log.id
            if (prevState.ids.indexOf(id) !== -1) return
            let array = prevState.lines

            if (prevState.severity >= log.priority && new Date(log.timestamp) >= prevState.from && new Date(log.timestamp) <= prevState.to) {
                array.unshift(log)
            }

            return {
                lines: array,
                loaded: true,
            }
        });
        this.search(this.state.search);
    }

    search = text => {
        this.setState({search: text})
        this.updateFilters()
    }

    updateFilters = () => {
        this.setState(state => {
            const filteredLines = []
            for (let i = 0; i < state.lines.length; i++) {
                if (state.tag && state.lines[i].tag !== state.tag) {
                    continue
                }
                if (state.search) {
                    try {
                        let r = new RegExp(state.search)
                        if (!r.test(this.props.format(state.lines[i]))) {
                            continue
                        }
                    } catch (e) {
                        continue
                    }
                }

                filteredLines.push(state.lines[i])
            }

            return {
                filteredLines: filteredLines,
                status: "Total lines: " + state.lines.length + "; Showing: " + filteredLines.length
            }
        })
    }

    render = () => <div className={styles.LogViewer}>
        <Panel from={this.state.from} updateFrom={from => this.setState({from: from})}
               to={this.state.to} updateTo={to => this.setState({to: to})}
               severity={this.state.severity} updateSeverity={severity => this.setState({severity: severity})}
               search={this.search} lsPrefix={this.props.lsPrefix}/>
        <Viewer lines={this.state.filteredLines} format={this.props.format}/>
        <StatusBar text={this.state.status}/>
    </div>
}
