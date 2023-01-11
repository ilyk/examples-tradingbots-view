import {handleError} from "../../../_helpers";
import {ExchangePage} from "../../../Components";

export class BitmaxConfigPage extends ExchangePage {
    static defaultProps = {
        exchange: "bitmax",
        configFields: {
            "api_key": "Api Key",
            "api_secret": "Api Secret Key",
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
    getAmount = (order) => order.orderQty;
    isAsk = (order) => order.side !== 'Buy';
    getQuoteCurrency = (order) => order.symbol.split("/")[1];
}
