import {Exchanges} from "../_helpers";

export const Exchange = {
    of: exchange => ({
        name: () => Exchanges[exchange].name,
        component: () => Exchanges[exchange].component,
    })
}
