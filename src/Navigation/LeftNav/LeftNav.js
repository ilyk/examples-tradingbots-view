import React from "react";
import {BotStatus} from "../../_bots";
import './LeftNav.sass'
import {BotStatusIcon} from "./BotStatus";
import {Accordion, Image, Nav} from "react-bootstrap";
import MaterialIcon from "material-icons-react";

import {withRouter} from "react-router";
import {Status} from "../../_services";
import {Link} from "react-router-dom";
import {Exchanges, Project} from "../../_helpers";
import {Bots} from "../../_helpers/bots";

class _LeftNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            historyBotStatus: BotStatus.STOPPED,
            exchanges: {},
            currentProject: {id:""}
        };
        this.subscriptions = []
    }

    componentWillUnmount() {
        for (const idx in this.subscriptions) {
            if (this.subscriptions.hasOwnProperty(idx)) {
                this.subscriptions[idx].unsubscribe()
            }
        }
    }

    componentDidMount(): void {
        this.subscriptions.push(Status.bots.history.subscribe(x => this.setState({historyBotStatus: x.status})))
        this.subscriptions.push(Status.exchanges.subscribe(exchanges => {
            this.setState({exchanges: exchanges})
        }))
        this.subscriptions.push(Project.subscribeCurrentId((project) => this.setState({currentProject: project})))
    }

    render = () => {
        const {location} = this.props;
        return (
            <nav className="col-md-2 d-none d-md-block bg-light sidebar">
                <div className="sidebar-sticky">
                    <Nav activeKey={location.pathname}>
                        <ul className="nav flex-column">
                            <li className="nav-item">
                                <Link to="/" className={`nav-link ${location.pathname === "/" ? 'active' : ''}`}>
                                    <span data-feather="home"/>
                                    Dashboard <span className="sr-only">(current)</span>
                                </Link>
                            </li>
                        </ul>

                        <h6 className=" sidebar-heading d-flex w-100 justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
                            <span>System Bots</span>
                        </h6>
                        <ul className="nav flex-column mb-2">
                            <li className="nav-item">
                                <Link to="/bots/history"
                                      className={`nav-link ${location.pathname.indexOf("/bots/history") === 0 ? 'active' : ''}`}>
                                    <BotStatusIcon status={this.state.historyBotStatus} id={"history-bot-status"}/>
                                    <MaterialIcon icon={"insert_chart"} size={"sm"}/>&nbsp;&nbsp;
                                    History Robot
                                </Link>
                            </li>
                        </ul>

                        {!this.state.currentProject.id || <React.Fragment>
                        <h6 className=" sidebar-heading d-flex w-100 justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
                            <span>Exchanges ({this.state.currentProject.name})</span>
                        </h6>
                        <Accordion>
                            <ul className="nav flex-column mb-2">
                                {Exchanges.values().map(exchange => (
                                    <Exchange exchanges={this.state.exchanges} exchange={Exchanges[exchange]} key={exchange}/>
                                ))}
                            </ul>
                        </Accordion>
                        </React.Fragment>}

                        <h6 className=" sidebar-heading d-flex w-100 justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
                            <span>Profile</span>
                        </h6>
                        <ul className="nav flex-column mb-2">
                            <li className="nav-item">
                                <Link to="/profile"
                                      className={`nav-link ${location.pathname.indexOf("/profile") === 0 ? 'active' : ''}`}>
                                    <MaterialIcon icon={"person"} size={"sm"}/>
                                    <span>Edit Profile</span>
                                </Link>
                            </li>
                        </ul>
                    </Nav>
                </div>
            </nav>
        );
    }
}

const Exchange = withRouter(({exchange, location, exchanges}) => {
    const {id, name, logo} = exchange
    let link = `/exchange/${id}`
    return <li className="nav-item" key={id}>
        <Accordion.Toggle as={Link} variant="link" eventKey={id} to={link}
                          className={`nav-link ${location.pathname.indexOf(link) === 0 ? 'active' : ''}`}>
            <Image width={24} height={24} className={"md-24 md-dark mb-1 mr-2"} src={logo}/> {name}
        </Accordion.Toggle>
        <Accordion.Collapse eventKey={link} in={location.pathname.indexOf(link) === 0}>
            <ul className="nav flex-column mb-2 ml-4">
                {Object.keys((exchanges[id] || {accounts:[]}).accounts).map(
                    account => <Account exchanges={exchanges} exchange={{id, name, logo}} link={link}
                                        account={account} key={account}/>
                )}
            </ul>
        </Accordion.Collapse>
    </li>;
}), Account = withRouter(({exchange, link, account, exchanges, location}) => {
    let acc_link = `${link}/accounts/${account}`
    return <li className="nav-item" key={account}>
        <Link to={acc_link} className={`nav-link ${location.pathname.indexOf(acc_link) === 0 ? 'active' : ''}`}>
            <MaterialIcon icon={"vpn_key"} size={"sm"}/>&nbsp;&nbsp;
            {account}
        </Link>
        <ul className="nav flex-column mb-2 ml-3">
            {Bots.values().map((botName) => <Bot exchange={exchange} exchanges={exchanges} link={acc_link} account={account}
                                  bot={Bots[botName]} key={botName} />)}
        </ul>
    </li>;
}), Bot = withRouter(({location, exchange, link, bot, account, exchanges}) => {
    const {id, title, image} = bot
    let bot_link = `${link}/bot/${id}`
    return <li className="nav-item" key={id}>
        <Link to={bot_link} className={`nav-link ${location.pathname.indexOf(bot_link) === 0 ? 'active' : ''}`}>
            <BotStatusIcon status={exchanges[exchange.id].accounts[account][id].status}
                           id={`${exchange.id}-${id}-bot-status`}/>
            <Image width={24} height={24} src={image} className={"md-24 md-dark mb-1 mr-2"}/>
            {title}
        </Link>
    </li>;
})

export const LeftNav = withRouter(_LeftNav);
