import {handleError} from "../../../_helpers";
import {ExchangePage} from "../../../Components";

export class BittrexConfigPage extends ExchangePage {
    static defaultProps = {
        exchange: "bittrex",
        configFields: {
            "api_key": "Api Key",
            "api_secret": "Api Secret Key",
            "api_subaccount_id": "Api Subaccount Id (Optional)",
        },
    }

    onConfigSubmit = (account) => (values, actions) => {
        this.setState({errorMessage: ''})
        const {api_key, api_secret, api_subaccount_id} = values

        this.api.forAccount(account).saveConfig({api_key, api_secret, api_subaccount_id})
            .then(() => this.update())
            .then(() => actions.setSubmitting(false))
            .catch(handleError(this))
    }

    getId = (order) => order.id;
    getPrice = (order) => order.limit;
    getAmount = (order) => order.quantity;
    isAsk = (order) => order.direction !== 'BUY';
}
