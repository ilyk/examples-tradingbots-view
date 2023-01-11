import {handleError} from "../../../_helpers";
import {ExchangePage} from "../../../Components";

export class BithumbConfigPage extends ExchangePage {
    static defaultProps = {
        exchange: "bithumb",
        configFields: {
            "api_key": "Api Key",
            "api_secret": "Secret Key",
        },
    }

    onConfigSubmit = (account) => (values, actions) => {
        this.setState({errorMessage: ''})
        const {api_key, api_secret} = values

        this.api.forAccount(account).saveConfig({api_key, api_secret})
            .then(() => this.update())
            .then(() => actions.setSubmitting(false))
            .catch(handleError(this))
    }

    getId = (order) => order.orderId;
    getPrice = (order) => order.price;
    getAmount = (order) => order.quantity;
    isAsk = (order) => order.side !== 'buy';
    getQuoteCurrency = (order) => order.symbol.split("-")[1];
}
