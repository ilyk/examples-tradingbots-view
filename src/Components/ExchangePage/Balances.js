import * as React from "react";
import {handleError, text} from "../../_helpers";

export class Balances extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            balances: {}
        }
    }

    componentDidMount() {
        this.props.api.balance()
            .then(balances => this.setState({balances: balances}))
            .catch(handleError(this))
    }

    render = () => (
        <React.Fragment>
            <h4>Balances</h4>
            <table className="table table-striped table-hover">
                <thead>
                <tr>
                    <th>Currency</th>
                    <th>Available</th>
                    <th>Total</th>
                </tr>
                </thead>
                <tbody>
                {Object.keys(this.state.balances).map(c => (
                    <tr key={c}>
                        <th>{c.toUpperCase()}:</th>
                        <td>
                            {text.formatFloat(this.state.balances[c].Available)}
                        </td>
                        <td>
                            {text.formatFloat(this.state.balances[c].Total)}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </React.Fragment>
    )
}