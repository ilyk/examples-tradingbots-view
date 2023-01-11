import * as React from "react";
import {Form, Formik} from "formik";
import {handleError, Project, time} from "../../../_helpers";
import {Distribution} from "../../../_bots";
import {Container} from "react-bootstrap";
import {defaultPumpNDumpBot, Status} from "../../../_services";
import LoadingOverlay from "react-loading-overlay";
import {CheckBox, NumericField, SaveButton, SelectBox, SliderFloat, SliderInterval} from "../Elements/Config";

export class ConfigPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bot: defaultPumpNDumpBot,
            loaded: false,
            errorMessage: '',
            quotes: [""],
            intervals: [],
            cross_rate_quote_currencies: [],
            main_exchange_quote_currencies: [],
            exchanges: {},
        }
        this.subscriptions = []
        this.exchangeApi = this.props.exchangeApi
        this.botApi = this.props.botApi
    }

    componentWillUnmount() {
        for (const subscription of this.subscriptions) {
            if (typeof subscription.unsubscribe === 'function') {
                subscription.unsubscribe()
            }
        }
    }

    updateConfig = config => {
        this.setState(state => {
            let bot = state.bot

            if (!config.order_book_update_interval) {
                config.order_book_update_interval = time.Millisecond
            }
            bot.config = config

            return {bot: bot, loaded: true}
        })
    }

    componentDidUpdate(prevProp, prevState, snapshot) {
        if (this.props.account !== prevProp.account || this.props.exchange !== prevProp.exchange) {
            this.componentDidMount()
        }
    }

    componentDidMount(): void {
        this.subscriptions.push(Status.exchanges.subscribe(exchanges => {
            this.setState({exchanges: exchanges})
        }))

        this.botApi.config()
            .then(config => this.updateConfig(config))
            .then(() => this.exchangeApi.quotes(Project.current.base_currency))
            .then(quotes => this.setState({quotes: quotes}))
            .catch(handleError(this))
    }

    render() {
        return <LoadingOverlay
            active={!this.state.loaded}
            spinner
            text='Loading...'
        >
            <Container fluid={true} className={"mt-3"}>
                <Formik initialValues={{bot: this.state.bot}} onSubmit={(values, actions) => {
                    let that = this
                    that.setState({errorMessage: ''})
                    this.botApi.saveConfig(values.bot.config)
                        .then(config => this.updateConfig(config))
                        .catch(handleError(that))
                        .finally(() => actions.setSubmitting(false))
                }} enableReinitialize={true}>
                    {({values}) =>
                        <Form
                            className={`horizontal-form ${values.bot.config.is_arbitrage ? "" : ""}`}
                            style={{
                                padding: '20px',
                                margin: '-20px',
                            }}>
                            {this.state.errorMessage &&
                            <div className="alert alert-danger" role="alert">
                                {this.state.errorMessage}
                            </div>}
                            <h3>
                                Bot config
                            </h3>
                            <div className={"row"}>
                                <CheckBox
                                    label={"Re-read configuration on each iteration (otherwise reloads on start/stop)"}
                                    name={"bot.config.reload_on_each_job"}/>

                                <SliderInterval label={"OrderWatcher Interval"}
                                                name={"bot.config.order_watcher_interval"}/>

                                <CheckBox label={"Simulation"} name={"bot.config.simulation"}/>
                                <SelectBox label={"Quote Currency"}
                                           name={"bot.config.quote_currency"}
                                           values={this.state.quotes} emptyVal/>
                                <NumericField name={"bot.config.asks_amount"} label={"Asks Amount"} min={0}/>
                                <NumericField name={"bot.config.bids_amount"} label={"Bids Amount"} min={0}/>
                                <NumericField name={"bot.config.asks_count"} label={"Asks Count"} step={1}/>
                                <NumericField name={"bot.config.bids_count"} label={"Bids Count"} step={1}/>

                                <SliderFloat name={"bot.config.price_noise"} label={"Price Noise"}/>
                                <SliderFloat name={"bot.config.amount_noise"} label={"Amount Noise"}/>

                                <SelectBox label={"Distribution"}
                                           name={"bot.config.distribution"}
                                           values={Distribution.values()}
                                           valueToText={Distribution.getValue}/>

                                <SliderFloat name={"bot.config.price_delta_asks"} label={"Asks Price Delta"}/>
                                <SliderFloat name={"bot.config.price_range_asks"} label={"Asks Price Range"}/>
                                <SliderFloat name={"bot.config.price_delta_bids"} label={"Bids Price Delta"}/>
                                <SliderFloat name={"bot.config.price_range_bids"} label={"Bids Price Range"}/>

                                <SliderInterval label={"Order Filling Delay"}
                                                name={"bot.config.order_filling_delay"}
                                                step={100 * time.Millisecond}
                                                min={0}
                                                max={5 * time.Minute}/>
                                <NumericField name={"bot.config.trade_quantity_noise_coefficient"}
                                              label={"Trade Quantity Noise Coefficient"}
                                              min={0}/>
                                <SliderFloat name={"bot.config.interval_noise"} label={"Interval Noise"}/>
                                <SliderInterval label={"Open Close Interval"}
                                                name={"bot.config.open_close_interval"}
                                                min={10 * time.Millisecond}
                                                step={10 * time.Millisecond}
                                                max={time.Minute}/>
                                <SliderInterval label={"Order Book Update Delay"}
                                                name={"bot.config.orderBookUpdateDelay"}
                                                min={10 * time.Millisecond}
                                                step={10 * time.Millisecond}
                                                max={time.Minute}/>
                                <NumericField name={"bot.config.max_reap_asks_amount"} label={"Max Reap Asks Amount"}
                                              min={0}/>
                                <NumericField name={"bot.config.max_reap_bids_amount"} label={"Max Reap Bids Amount"}
                                              min={0}/>

                                <SaveButton/>
                            </div>
                        </Form>
                    }
                </Formik>
            </Container>
        </LoadingOverlay>;
    }
}