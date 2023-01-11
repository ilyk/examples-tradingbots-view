import {handleError} from "../../../_helpers";
import {ExchangePage} from "../../../Components";

export class MxcConfigPage extends ExchangePage {
    static defaultProps = {
        exchange: "mxc",
        configFields: {
            "access_key": "Access Key",
            "secret_key": "Secret Key",
        },
    }

    onConfigSubmit = (account) => (values, actions) => {
        this.setState({errorMessage: ''})
        const {access_key, secret_key} = values

        this.api.forAccount(account).saveConfig({access_key, secret_key})
            .then(() => this.update())
            .then(() => actions.setSubmitting(false))
            .catch(handleError(this))
    }

    getId = (order) => order.id;
    getPrice = (order) => order.price;
    getAmount = (order) => order.quantity;
    isAsk = (order) => order.type === 'ASK';
}
