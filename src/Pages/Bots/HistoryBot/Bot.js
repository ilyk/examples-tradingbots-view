import * as React from "react";
import {Container, Tab, Tabs} from "react-bootstrap";
import {StatusPage} from "./Status";
import {ConfigPage} from "./Config";
import {LogsPage} from "./Logs";
import {Route, Switch, withRouter} from "react-router";
import {HistoryBotCandlesPage} from "./CandlesPage";

export const HistoryBotPage = withRouter(({location, history}) => {
        if (location.pathname.split("/").length < 4) {
            history.push(`${location.pathname}/status`)
        }
        return <Container fluid={true}>
            <div id="historyBot">
                <h3>History Bot</h3>
                <Tabs id={"history-bot"}
                      activeKey={location.pathname.split("/")[3] || "status"}
                      onSelect={k => {
                          history.push(`/bots/history/${k}`)
                      }}>
                    <Tab title="Status" eventKey="status">
                        <Switch>
                            <Route path="/bots/history/status" component={StatusPage}/>
                        </Switch>
                    </Tab>
                    <Tab eventKey="config" title="Configuration">
                        <Switch>
                            <Route path="/bots/history/config" component={ConfigPage}/>
                        </Switch>
                    </Tab>
                    <Tab eventKey="logs" title="Logs">
                        <Switch>
                            <Route path="/bots/history/logs" component={LogsPage}/>
                        </Switch>
                    </Tab>
                    <Tab eventKey="candles" title="Candles">
                        <Switch>
                            <Route path="/bots/history/candles" component={HistoryBotCandlesPage}/>
                        </Switch>
                    </Tab>
                </Tabs>
            </div>
        </Container>;
    }
)