import * as React from "react";
import {Button, Container} from "react-bootstrap";
import {defaultHistoryBot, StartHistoryBot, Status, StopHistoryBot} from "../../../_services";
import {BotStatus} from "../../../_bots";
// noinspection ES6CheckImport
import MaterialIcon, {colorPalette} from 'material-icons-react';
import {time} from "../../../_helpers";

import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import LoadingOverlay from "react-loading-overlay";

export class StatusPage extends React.Component {
    startBot = () => {
        new StartHistoryBot().send()
        this.setState(state => {
            let bot = state.bot
            bot.status = BotStatus.STARTING
            console.log(bot)
            return ({bot: bot})
        })
    }
    stopBot = () => {
        new StopHistoryBot().send()
        this.setState(state => {
            let bot = state.bot
            bot.status = BotStatus.STOPPING
            console.log(bot)
            return ({bot: bot})
        })
    }

    constructor() {
        super();
        this.state = {
            bot: defaultHistoryBot,
            loaded: false,
        }
        this.subscriptions = []
    }

    componentDidMount(): void {
        this.subscriptions.push(Status.bots.history.subscribe(value => this.setState({bot: value, loaded: true})))
    }

    componentWillUnmount() {
        for (const subscription of this.subscriptions) {
            if (typeof subscription.unsubscribe === 'function') {
                subscription.unsubscribe()
            }
        }
    }

    render() {
        return (
            <LoadingOverlay
                active={!this.state.loaded}
                spinner
                text='Loading...'
            >
                <Container fluid={true} className={"mt-3"}>
                    <div className={"row"}>
                        <dl>
                            <dt>Bot Status:</dt>
                            <dd>
                                {this.state.bot.status}
                                {
                                    (this.state.bot.status === BotStatus.STOPPED &&
                                        <Button size={"sm"} variant={"link"}
                                                onClick={this.startBot}><MaterialIcon
                                            icon={"play_circle_filled"}
                                            color={colorPalette.green.default}/></Button>)
                                }{
                                (this.state.bot.status !== BotStatus.STOPPING && this.state.bot.status !== BotStatus.STOPPED &&
                                    <Button size={"sm"} variant={"link"}
                                            onClick={this.stopBot}><MaterialIcon
                                        icon={"pause_circle_filled"}
                                        color={colorPalette.orange.default}/></Button>)
                            }
                            </dd>
                            <dt>Bot State:</dt>
                            <dd>Last
                                Timestamp: {time.formatFromString(this.state.bot.state.lastTimestamp, 'MMMM d, yyyy HH:mm')}</dd>
                        </dl>
                    </div>
                </Container>
            </LoadingOverlay>
        );
    }
}