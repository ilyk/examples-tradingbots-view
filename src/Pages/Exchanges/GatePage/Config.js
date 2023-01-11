import {handleError} from "../../../_helpers";
import {ExchangePage} from "../../../Components";

export class GateConfigPage extends ExchangePage {
    static defaultProps = {
        exchange: "gate",
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
    getId = (order) => order.id;
    getPrice = (order) => order.price;
    getAmount = (order) => order.amount;
    isAsk = (order) => order.side.toLowerCase() !== 'buy';
    getQuoteCurrency = (order) => order.currency_pair.split("_")[0];
}
