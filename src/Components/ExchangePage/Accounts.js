import {Route, Switch, withRouter} from "react-router";
import {Container, Tab, Tabs} from "react-bootstrap";
import * as React from "react";
import {Field, Form, Formik} from "formik";
import {SaveButton} from "../../Pages/Bots/Elements/Config";
import {Orders} from "./Orders";
import {Balances} from "./Balances";

export const Accounts = withRouter(({location, history, that, onConfigSubmit, configFields}) => {
    if (location.pathname.split("/").length < 4  && Object.keys(that.state.exchange).length > 0) {
        history.push(`${location.pathname}/accounts/${Object.keys(that.state.exchange)[0]}`)
    }
    return (
        <Tabs id={"exchange"}
              activeKey={"__" + (location.pathname.split("/")[4] || Object.keys(that.state.exchange)[0])}
              onSelect={k => {
                  if (k === '__new') {
                      let account = prompt("Enter account name:")
                      that.setState(state => {
                          state.exchange[account] = {}
                          state.showConfig[account] = true
                          return {exchange: state.exchange, showConfig: state.showConfig}
                      }, () => history.push(`/exchange/${that.props.exchange}/accounts/${account}`))
                      return
                  }
                  history.push(`/exchange/${that.props.exchange}/accounts/${k.split('__')[1]}`)
              }}>
            {Object.keys(that.state.exchange).map(account => (
                <Tab title={account} eventKey={"__" + account} key={account}>
                    <Switch>
                        <Route path={`/exchange/${that.props.exchange}/accounts/${account}`}
                               render={() => <Account
                                   account={account}
                                   that={that}
                                   onConfigSubmit={onConfigSubmit}
                                   configFields={configFields}
                               />} />
                    </Switch>
                </Tab>
            ))}
            <Tab title="+" eventKey="__new">
                <Container fluid className={"mt-3"}>
                </Container>
            </Tab>
        </Tabs>
    );
}), Account = withRouter(({location, history, account, that, onConfigSubmit, configFields})=> {
    if (location.pathname.split("/").length < 6) {
        history.push(`${location.pathname}/${(that.state.showConfig[account] ? "config" : "orders")}`)
    }
    const api = that.api.forAccount(account)
    return (
        <Container fluid className={"mt-3"}>
            <Tabs id={`exchange-${account}`}
                  variant={"pills"}
                  activeKey={location.pathname.split("/")[5]}
                  onSelect={(k) => history.push(`/exchange/${that.props.exchange}/accounts/${account}/${k}`)}>
                {that.state.showConfig[account] || <Tab title={"Orders"} eventKey={"orders"}>
                    <Orders exchange={that.props.exchange} account={account} currency={that.currency}
                            getId={that.getId}
                            getPrice={that.getPrice}
                            getAmount={that.getAmount}
                            isAsk={that.isAsk}
                            getQuoteCurrency={that.getQuoteCurrency}
                    />
                </Tab>}
                {that.state.showConfig[account] || <Tab title={"Balances"} eventKey={"balance"}>
                    <Switch>
                        <Route path={`/exchange/${that.props.exchange}/accounts/${account}/balance`}
                               render={() => <Balances account={account} api={api}/>}/>
                    </Switch>
                </Tab>}
                <Tab title={"Config"} eventKey={"config"} tabClassName={that.state.showConfig[account] ? "hidden" : ""}>
                    <Switch>
                        <Route path={`/exchange/${that.props.exchange}/accounts/${account}/config`}
                               render={() => <Config
                                   account={account}
                                   that={that}
                                   onConfigSubmit={onConfigSubmit}
                                   configFields={configFields}
                               />}/>
                    </Switch>
                </Tab>
            </Tabs>
        </Container>
    );
}), Config = ({that, account, onConfigSubmit, configFields}) => (
    <Container fluid={true} className={"mt-3"}>
        <div>
            <Formik initialValues={that.state.exchange[account]}
                    onSubmit={onConfigSubmit(account)} enableReinitialize={true}>
                {({isSubmitting}) => (
                    <Form>
                        <h4>Config</h4>
                        <div className={"row"}>
                            {Object.keys(configFields).map(key=>(
                                <div key={key} className="form-group row col-sm-12">
                                    <label htmlFor={key}
                                           className={"col-sm-3 col-form-label"}>
                                        <b>{configFields[key]}</b>
                                    </label>
                                    <div className="col-sm-9">
                                        <Field type={"text"} name={key} id={key}
                                               className={"form-control"}
                                               disabled={isSubmitting}/>
                                    </div>
                                </div>
                            ))}
                            <SaveButton/>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
        <hr/>
        <button onClick={() => that.delete(account)}
                className={"btn btn-danger btn-block btn-sm"}>Delete account
        </button>
    </Container>
)
