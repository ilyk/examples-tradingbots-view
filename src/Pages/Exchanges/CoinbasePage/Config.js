import {handleError} from "../../../_helpers";
import {ExchangePage} from "../../../Components";

export class CoinbaseConfigPage extends ExchangePage {
    static defaultProps = {
        exchange: "coinbase",
        configFields: {
            "api_key": "Api Key",
            "api_secret": "Api Secret",
            "api_passphrase": "Api Passphrase",
        },
    }

    onConfigSubmit = (account) => (values, actions) => {
        this.setState({errorMessage: ''})
        const {api_secret, api_key, api_passphrase} = values

        this.api.forAccount(account).saveConfig({api_secret, api_key, api_passphrase})
            .then(() => this.update())
            .then(() => actions.setSubmitting(false))
            .catch(handleError(this))
    }
    getId = (order) => order.id;
    getPrice = (order) => order.price;
    getAmount = (order) => order.size;
    isAsk = (order) => order.side.toLowerCase() !== 'buy';
    getQuoteCurrency = (order) => order.product_id.split("-")[1];
}
