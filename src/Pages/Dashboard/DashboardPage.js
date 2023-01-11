import React from 'react';

import './dashboard.css'

import {authenticationService} from '../../_services';
import {Exchanges, history} from "../../_helpers";
import {Bots} from "../../_helpers/bots";

class DashboardPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: authenticationService.currentUserValue,
        };
        this.subscriptions = []
    }

    componentDidMount() {
        this.subscriptions.push(authenticationService.currentUser.subscribe(x => {
            this.setState({currentUser: x})
        }))
        if (!authenticationService.isAuthenticated()) {
            history.push('/login');
        }
    }

    componentWillUnmount() {
        for (const subscription of this.subscriptions) {
            if (typeof subscription.unsubscribe === 'function') {
                subscription.unsubscribe()
            }
        }
    }

    render() {
        const {user} = this.state;
        return (
            <div>
                <h1>Welcome to the MMachine, {user.firstName}!</h1>
                <p>MARKET MAKING AUTOMATION<br/>
                    Supported Exchanges:
                    <ul>{Exchanges.values().map((exchange,i) => <li key={i}>{Exchanges[exchange].name}</li>)}</ul>
                    Supported Bots:
                    <ul>{Bots.values().map((bot,i) => <li key={i}>{Bots[bot].title}</li>)}</ul>
                </p>
            </div>
        );
    }
}

export {DashboardPage};