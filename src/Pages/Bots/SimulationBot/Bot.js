import * as React from "react";
import {Container, Tab, Tabs} from "react-bootstrap";
import {Config} from "./Config";
import {StatusPage} from "./Status";
import {LogsPage} from "./Logs";
import {Route, Switch, useParams, withRouter} from "react-router";
import {Api} from "../../../_api";

export const SimulationBotPage = withRouter(({location, history}) => {
    let {exchange, account} = useParams();
    const exchangeApi = Api.forExchangeAccount(exchange, account)
    const botApi = exchangeApi.forBot("simulation")
    const baseUrl = `/exchange/${exchange}/accounts/${account}/bot/simulation`

    if (location.pathname.split("/").length < 8) {
        history.push(`${location.pathname}/status`)
    }

    return <Container fluid={true}>
        <div id="simulationBot">
            <h3>[{exchange} ({account})] Simulation Bot</h3>
            <Tabs id={"simulation-bot"}
                  activeKey={location.pathname.split("/")[7] || "status"}
                  onSelect={k => {
                      history.push(`${baseUrl}/${k}`)
                  }}>
                <Tab title="Status" eventKey="status">
                    <Switch>
                        <Route path={`${baseUrl}/status`}
                            render={props => <StatusPage key={Date.now()} exchange={exchange} account={account}
                                                exchangeApi={exchangeApi} botApi={botApi} {...props}/>}/>
                    </Switch>
                </Tab>
                <Tab eventKey="config" title="Configuration">
                    <Switch>
                        <Route path={`${baseUrl}/config`}
                               render={props => <Config key={Date.now()} exchange={exchange} account={account}
                                               exchangeApi={exchangeApi} botApi={botApi} {...props}/>}/>
                    </Switch>
                </Tab>
                <Tab eventKey="logs" title="Logs">
                    <Switch>
                        <Route path={`${baseUrl}/logs`}
                               render={props => <LogsPage key={Date.now()} exchange={exchange} account={account}
                                                 api={botApi} {...props}/>}/>
                    </Switch>
                </Tab>
            </Tabs>
        </div>
    </Container>;
})
