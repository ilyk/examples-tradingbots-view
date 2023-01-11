import * as React from "react";
import {authenticationService, ServerStatus, Status} from "../../_services";
import {Link} from "react-router-dom";
import './TopNav.sass'
import {history, Project} from "../../_helpers";

export class TopNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            serverStatus: ServerStatus.OFFLINE,
            user: "—",
            projects: [],
            currentProject: {id: ""}
        }
        this.subscriptions = []
    }

    componentWillUnmount() {
        for (const idx in this.subscriptions) {
            if (this.subscriptions.hasOwnProperty(idx)) {
                this.subscriptions[idx].unsubscribe()
            }
        }
    }

    componentDidMount() {
        authenticationService.currentUser.subscribe(x => {
            this.setState({user: x})
        });
        this.subscriptions.push(Status.server.subscribe(status => this.setState({serverStatus: status})))
        this.subscriptions.push(Project.subscribeCurrentId(current => this.setState({currentProject: current})))
        this.subscriptions.push(Project.projects.subscribe(projects => this.setState({projects: projects})))
    }

    logout = () => {
        authenticationService.logout();
        history.go('/login');
    }

    render() {
        return (
            <nav
                className="navbar navbar-dark navbar-expand-lg navbar-light bg-dark fixed-top flex-md-nowrap p-0 shadow">
                <Link to="/" className="navbar-brand col-sm-3 col-md-2 mr-0">
                    <span className={"dot dot-sm " + this.state.serverStatus}/>
                    MMachine
                </Link>
                <ul className="nav nav-tabs mr-auto bg-dark">
                    {this.state.projects.map((proj, idx) => (
                        <li className="nav-item text-light" key={idx}>
                            <Link className={`nav-link ${this.state.currentProject.id !== proj.id || "active"}`}
                                  to={`/projects/${proj.id}`}>
                                {proj.name} ({proj.id})</Link>
                        </li>
                    ))}
                    <li className="nav-item text-light" onClick={Project.createNew}>
                        <button className={`nav-link ${this.state.currentProject.id !== "" || "active"}`}>+</button>
                    </li>
                </ul>
                <ul className="navbar-nav mr-0">
                    <li className="nav-item text-nowrap">
                        <button className="nav-link" onClick={this.logout}>Sign out
                            ({this.state.user.username})
                        </button>
                    </li>
                </ul>
            </nav>
        );
    }
}