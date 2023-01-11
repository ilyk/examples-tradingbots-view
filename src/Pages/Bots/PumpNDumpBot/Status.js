import * as React from "react";
import {defaultPumpNDumpBot, Status} from "../../../_services";
import {BotStatus} from "../../../_bots";
import {Button, ButtonGroup, Container} from "react-bootstrap";
import MaterialIcon from "material-icons-react";
import LoadingOverlay from "react-loading-overlay";
import {handleError, time} from "../../../_helpers";

export class StatusPage extends React.Component {
    static defaultProps = {
        exchange: "",
        account: "",
        botType: "pump-n-dump"
    }

    constructor(props) {
        super(props);
        this.state = {
            bot: defaultPumpNDumpBot,
            loaded: false,
            errorMessage: ''
        }
        this.exchangeApi = this.props.exchangeApi
        this.botApi = this.props.botApi
        this.subscriptions = []
        this.mounted = false
    }

    startBot = () => {
        this.botApi.start().then(() => {
            this.setState(state => {
                let bot = state.bot
                bot.status = BotStatus.STARTING
                console.log(bot)
                return ({bot: bot})
            })
        }).then(()=>this.setState({'errorMessage': ''})).catch(handleError(this))
    }
    stopBot = () => {
        this.botApi.stop().then(() => {
            this.setState(state => {
                let bot = state.bot
                bot.status = BotStatus.STOPPING
                return ({bot: bot})
            })
        }).then(()=>this.setState({'errorMessage': ''})).catch(handleError(this))
    }
    cancelOrders = () => {
        if (!window.confirm("Are you sure you want to cancel ALL orders placed by this bot?")) return
        this.botApi.cancelOrders()
    }

    componentDidUpdate(prevProp, prevState, snapshot) {
        if (this.props.account !== prevProp.account || this.props.exchange !== prevProp.exchange) {
            this.componentWillUnmount()
            this.componentDidMount()
        }
    }

    componentWillUnmount() {
        this.mounted = false
        for (const subscription of this.subscriptions) {
            if (typeof subscription.unsubscribe === 'function') {
                subscription.unsubscribe()
            }
        }
    }

    componentDidMount(): void {
        this.mounted = true
        this.subscriptions.push(Status.exchanges.subscribe(exchanges => this.setState(state => {
            let bot = state.bot
            if (typeof exchanges[this.props.exchange] !== 'undefined') {
                try {
                    bot.state = exchanges[this.props.exchange].accounts[this.props.account][this.props.botType]
                    bot.status = exchanges[this.props.exchange].accounts[this.props.account][this.props.botType].status
                } catch (e) {
                }
            }

            return {bot: bot, loaded: true}
        })))
    }

    disabledStart() {
        return this.state.bot.status !== BotStatus.STOPPED && this.state.bot.status !== BotStatus.SCHEDULED
    }

    disabledPause() {
        return this.state.bot.status === BotStatus.STOPPING || this.state.bot.status === BotStatus.STOPPED
    }

    render() {
        let state = this.state.bot.state || {};
        let candle = state.candle || {};
        return (
            <LoadingOverlay
                active={!this.state.loaded}
                spinner
                text='Loading...'
            >
                <Container fluid={true} className={"mt-3"}>
                    <div>
                        {this.state.errorMessage &&
                        <div className="alert alert-danger" role="alert">
                            {this.state.errorMessage}
                        </div>}
                        <p><b>Bot Status:</b> {this.state.bot.status}</p>
                        <div>
                            <ButtonGroup size={"sm"}>
                                <Button disabled={this.disabledStart()} size={"sm"} variant={"success"}
                                        onClick={this.startBot} title="Start Now!">
                                    <MaterialIcon icon={"play_circle_filled"}/>
                                </Button>
                                <Button disabled={this.disabledPause()} size={"sm"} variant={"danger"}
                                        onClick={this.stopBot} title="Stop">
                                    <MaterialIcon icon={"pause_circle_filled"}/>
                                </Button>
                            </ButtonGroup>
                        </div>
                        <p><Button disabled={this.disabledStart()} size={"sm"} variant={"danger"}
                                   onClick={this.cancelOrders} title="Cancel orders"
                                   style={{display: "flex", color: "black"}}>
                            <MaterialIcon icon={"delete_forever"}/> Cancel orders
                        </Button></p>

                        <p><b>Bot Status:</b></p>
                        {this.state.bot.status !== BotStatus.SCHEDULED || <li>Scheduled
                            Start: {time.formatFromString(state.scheduled, 'MMMM d, yyyy HH:mm')}</li>}
                        {this.disabledStart() || "Next Candle:"}
                        {!this.disabledStart() || "Current Candle:"}
                        {candle.interval === undefined ||
                        <Container fluid>
                            <table className="table-striped table-bordered">
                                <thead>
                                <tr>
                                    <th>Candle Interval</th>
                                    <th>Open Price</th>
                                    <th>Max Price</th>
                                    <th>Min Price</th>
                                    <th>Close Price</th>
                                    <th>Trade Volume</th>
                                    <th>Trades Number</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <th>{candle.interval}</th>
                                    <th>{candle.openPrice}</th>
                                    <th>{candle.maxPrice}</th>
                                    <th>{candle.minPrice}</th>
                                    <th>{candle.closePrice}</th>
                                    <th>{candle.tradeVolume}</th>
                                    <th>{candle.tradesNumber}</th>
                                </tr>
                                </tbody>
                            </table>
                            <p><Button size={"sm"} variant={"info"}
                                       onClick={this.botApi.skipCandle} title="Skip Current Candle"
                                       style={{display: "flex", color: "black"}}>
                                <MaterialIcon icon={"skip_next"}/> Skip Candle
                            </Button></p>
                        </Container>}
                        {candle.interval !== undefined ||
                        <strong>None</strong>
                        }
                    </div>
                </Container>
            </LoadingOverlay>
        );
    }
}
