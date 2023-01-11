import * as React from "react";
import {handleError, Project} from "../../_helpers";
import LoadingOverlay from "react-loading-overlay";
import {Accounts} from "./Accounts";
import {Exchange} from "../../_services";
import {Container} from "react-bootstrap";
import {Api} from "../../_api";

export class ExchangePage extends React.Component {
    static defaultProps = {
        exchange: "",
        configFields: {api_key: ""},
    }

    constructor(props) {
        super(props);
        this.state = {
            exchange: {},
            balances: {},
            showConfig: {},
            loaded: false,
            accounts: [],
        }
        this.currency = Project.current.base_currency
        this.api = Api.forExchange(this.props.exchange)
    }

    componentDidMount(): void {
        this.update();
    }

    update() {
        this.api.configs()
            .then(config => this.setState((state) => {
                let showConfig = {}
                Object.keys(config).forEach(k => {
                    showConfig[k] = !config[k][Object.keys(this.props.configFields)[0]]
                })
                return {exchange: config, loaded: !!state.balances, showConfig: showConfig}
            }))
            .catch(handleError(this))
    }

    delete = (account) => {
        if (!window.confirm("Are you sure you want to delete account: " + account + "?")) {
            return
        }
        this.api.forAccount(account).deleteAccount().then(() => this.update())
    }

    render() {
        return (
            <Container fluid>
                <LoadingOverlay
                    active={!this.state.loaded}
                    spinner
                    text='Loading...'
                >
                    <h1>
                        <span>{Exchange.of(this.props.exchange).name()}</span>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <a className="btn btn-sm btn-dark" href={`/exchange/${this.props.exchange}/orderBook`}>OrderBook</a>
                    </h1>
                    {this.state.errorMessage &&
                    <div className="alert alert-danger" role="alert"> {this.state.errorMessage} </div>}
                    <Accounts that={this} onConfigSubmit={this.onConfigSubmit} configFields={this.props.configFields}/>
                </LoadingOverlay>
            </Container>
        );
    }

    getId = (order) => order.id;
    getPrice = (order) => order.price;
    getAmount = (order) => order.amount;
    isAsk = (order) => order.type === 'ask';
    getQuoteCurrency = () => '-';
}
