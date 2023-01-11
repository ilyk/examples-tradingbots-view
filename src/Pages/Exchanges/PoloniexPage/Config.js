import {handleError} from "../../../_helpers";
import {ExchangePage} from "../../../Components";

export class PoloniexConfigPage extends ExchangePage {
    static defaultProps = {
        exchange: "poloniex",
        configFields: {
            "api_key": "Api Key",
            "api_secret": "Api Secret",
        },
    }

    onConfigSubmit = (account) => (values, actions) => {
        this.setState({errorMessage: ''})
        const {api_secret, api_key} = values

        this.api.forAccount(account).saveConfig({api_key, api_secret})
            .then(() => this.update())
            .then(() => actions.setSubmitting(false))
            .catch(handleError(this))
    }
    getId = (order) => order.orderNumber;
    getPrice = (order) => order.rate;
    getAmount = (order) => order.startingAmount;
    isAsk = (order) => order.type.toLowerCase() !== 'buy';
    getQuoteCurrency = () => "";
}
