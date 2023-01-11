import {handleError} from "../../../_helpers";
import {ExchangePage} from "../../../Components";

export class BinanceConfigPage extends ExchangePage {
    static defaultProps = {
        exchange: "binance",
        configFields: {
            "api_key": "Api Key",
            "api_secret": "Api Secret",
        },
    }

    onConfigSubmit = (account) => (values, actions) => {
        this.setState({errorMessage: ''})
        const {api_secret, api_key} = values

        this.api.forAccount(account).saveConfig({api_secret, api_key})
            .then(() => this.update())
            .then(() => actions.setSubmitting(false))
            .catch(handleError(this))
    }
    getId = (order) => order.orderId;
    getPrice = (order) => order.price;
    getAmount = (order) => order.origQty;
    isAsk = (order) => order.side !== 'BUY';
    getQuoteCurrency = (order) => order.symbol.replace(this.currency, "");
}
