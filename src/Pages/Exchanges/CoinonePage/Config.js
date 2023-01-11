import {handleError} from "../../../_helpers";
import {ExchangePage} from "../../../Components";

export class CoinoneConfigPage extends ExchangePage {
    static defaultProps = {
        exchange: "coinone",
        configFields: {
            "access_token": "Access Token",
            "secret_key": "Secret Key",
        },
    }

    onConfigSubmit = (account) => (values, actions) => {
        this.setState({errorMessage: ''})
        const {access_token, secret_key} = values

        this.api.forAccount(account).saveConfig({access_token, secret_key})
            .then(() => this.update())
            .then(() => actions.setSubmitting(false))
            .catch(handleError(this))
    }

    getId = (order) => order.orderId;
    getPrice = (order) => order.price;
    getAmount = (order) => order.qty;
    isAsk = (order) => order.type !== 'bid';
}
