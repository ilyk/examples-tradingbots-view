import {handleError} from "../../../_helpers";
import {ExchangePage} from "../../../Components";

export class UpbitConfigPage extends ExchangePage {
    static defaultProps = {
        exchange: "upbit",
        configFields: {
            "access_key": "Access Key",
            "secret_key": "Secret Key",
        },
    }

    onConfigSubmit = (account) => (values, actions) => {
        this.setState({errorMessage: ''})
        const {secret_key, access_key} = values

        this.api.forAccount(account).saveConfig({secret_key, access_key})
            .then(() => this.update())
            .then(() => actions.setSubmitting(false))
            .catch(handleError(this))
    }

    getId = (order) => order.uuid;
    getPrice = (order) => order.price;
    getAmount = (order) => order.volume;
    isAsk = (order) => order.side === 'ask';
}
