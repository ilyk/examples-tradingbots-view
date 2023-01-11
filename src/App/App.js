import React from 'react';
import {Row} from 'react-bootstrap';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import '../_fonts/index.css'

import Container from "react-bootstrap/Container";
import {authenticationService, ServerStatus, Status} from "../_services";
import {
    DashboardPage,
    FloatingWallBotPage,
    HistoryBotPage,
    HunterBotPage,
    IcebergBotPage,
    InSpreadTradingBotPage,
    Landing,
    LoginPage,
    OrderBookExtenderBotPage,
    ProfilePage,
    ProjectPage,
    PumpNDumpBotPage,
    SimulationBotPage,
    TelegramBotPage,
} from '../Pages';
import {Route, Router, Switch} from 'react-router';
import {Exchanges, history, Project} from '../_helpers'
import {LeftNav, TopNav} from "../Navigation";
import "react-datepicker/dist/react-datepicker.css";
import {OrderBook} from "../Components/ExchangePage/OrderBook";

export class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            authenticated: authenticationService.isAuthenticated(),
            user: authenticationService.currentUserValue,
            serverStatus: ServerStatus.OFFLINE,
        }
        this.subscriptions = []
    }

    componentDidMount() {
        if (!authenticationService.isAuthenticated() && !window.location.href === "/login") {
            authenticationService.checkAndRefresh()
                .catch((error) => {
                    if (typeof error.message != 'undefined' && error.message === 'Failed to fetch') {
                        return
                    }

                    history.push("/login")
                })
        }
        this.subscriptions.push(authenticationService.authenticated.subscribe(auth => {
            this.setState({authenticated: auth})
            if (auth) {
                Status.init()
                Project.loadProjects()
            } else {
                Status.stop()
                history.push("/login")
            }
        }))
    }

    componentWillUnmount() {
        for (const subscription of this.subscriptions) {
            if (typeof subscription.unsubscribe === 'function') {
                subscription.unsubscribe()
            }
        }
    }

    render() {
        const authenticated = this.state.authenticated
        return (
            <Router history={history}>
                <div>
                    {authenticated && <TopNav/>}
                    <Container fluid={true}>
                        {(authenticated &&
                            <Row>
                                <LeftNav/>
                                <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
                                    <div
                                        className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                                        <Switch>
                                            <Route path="/profile"
                                                   render={props => <ProfilePage key={Date.now()} {...props} />}/>
                                            <Route path="/projects/:projectId"
                                                   render={props => <ProjectPage key={Date.now()} {...props} />}/>
                                            <Route path="/bots/history"
                                                   render={props => <HistoryBotPage key={Date.now()} {...props} />}/>
                                            <Route path="/exchange/:exchange/accounts/:account/bot/iceberg"
                                                   render={props => <IcebergBotPage key={Date.now()} {...props} />}/>
                                            <Route path="/exchange/:exchange/accounts/:account/bot/telegram"
                                                   render={props => <TelegramBotPage key={Date.now()} {...props} />}/>
                                            <Route path="/exchange/:exchange/accounts/:account/bot/simulation"
                                                   render={props => <SimulationBotPage key={Date.now()} {...props} />}/>
                                            <Route path="/exchange/:exchange/accounts/:account/bot/orderbook_extender"
                                                   render={props => <OrderBookExtenderBotPage
                                                       key={Date.now()} {...props} />}/>
                                            <Route path="/exchange/:exchange/accounts/:account/bot/inspread"
                                                   render={props => <InSpreadTradingBotPage
                                                       key={Date.now()} {...props} />}/>
                                            <Route path="/exchange/:exchange/accounts/:account/bot/hunter"
                                                   render={props => <HunterBotPage
                                                       key={Date.now()} {...props} />}/>
                                            <Route path="/exchange/:exchange/accounts/:account/bot/floating-wall"
                                                   render={props => <FloatingWallBotPage
                                                       key={Date.now()} {...props} />}/>
                                            <Route path="/exchange/:exchange/accounts/:account/bot/pump-n-dump"
                                                   render={props => <PumpNDumpBotPage
                                                       key={Date.now()} {...props} />}/>
                                            <Route path="/exchange/:exchange/orderBook"
                                                   render={props => <OrderBook key={Date.now()} {...props} />}/>

                                            {Exchanges.values().map((exchange, idx) => (
                                                <Route path={`/exchange/${exchange}`} key={idx}
                                                       component={Exchanges[exchange].component}/>
                                            ))}

                                            <Route path="/" component={DashboardPage}/>
                                        </Switch>
                                    </div>
                                </main>
                            </Row>) ||
                        <Switch>
                            <Route path="/login" component={LoginPage}/>
                            <Route path="/" component={Landing}/>
                        </Switch>}
                    </Container>
                </div>
            </Router>
        );
    }
}
