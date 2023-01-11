import * as React from "react";
import {Form, Formik} from "formik";
import {handleError, Project, time} from "../../../_helpers";
import {Distribution} from "../../../_bots";
import {Container} from "react-bootstrap";
import {defaultIcebergBot, Status} from "../../../_services";
import LoadingOverlay from "react-loading-overlay";
import {
    CheckBox,
    DatePicker,
    NumericField,
    SaveButton,
    SelectBox,
    SliderFloat,
    SliderInterval
} from "../Elements/Config";
import {Api} from "../../../_api";

export class ConfigPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bot: defaultIcebergBot,
            loaded: false,
            errorMessage: '',
            trading_pairs: [""],
            quotes: [""],
            intervals: [],
            cross_rate_quote_currencies: [],
            main_exchange_quote_currencies: [],
            exchanges:{},
        }
        this.subscriptions =  []
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

    handleTradingPairChange = (e) => {
        this.setState({intervals:[]})
        this.loadIntervals(e.currentTarget.value)
    }

    loadIntervals = (pair) => {
        Api.forHistory().tradeIntervals(pair)
            .then(intervals => this.setState({intervals: intervals}))
            .catch(handleError(this))
    }

    updateConfig = config => {
        this.setState(state => {
            let bot = state.bot
            bot.config = config

            return {bot: bot, loaded: true}
        })
    }

    componentDidUpdate(prevProp, prevState, snapshot) {
        if (this.props.account !== prevProp.account || this.props.exchange !== prevProp.exchange) {
            this.componentDidMount()
        }
    }

    handleCrossRateExchangeChange = (e) => {
        let exchange = e.currentTarget.value;
        this.setState(state => {
            const bot = state.bot
            bot.config.cross_rate_exchange = exchange
            return {bot: bot, cross_rate_quote_currencies:[]}
        }, () => {
            this.loadCrossRateCurrencies(exchange, this.state.bot.config.quote_currency)
        })
    }

    handleQuoteCurrencyChange = (e) => {
        const quoteCurrency = e.currentTarget.value;
        this.setState(state => {
            const bot = state.bot
            bot.config.quote_currency = quoteCurrency
            return {bot: bot, cross_rate_quote_currencies:[]}
        }, () => {
            this.loadCrossRateCurrencies(this.state.bot.config.cross_rate_exchange, quoteCurrency)
        })
    }

    handleMainExchangeChange = (e) => {
        let exchange = e.currentTarget.value;
        this.setState(state => {
            const bot = state.bot
            bot.config.cross_rate_exchange = exchange
            return {bot: bot}
        }, () => {
            this.loadMainExchangeCurrencies(exchange, Project.current.base_currency)
        })
    }

    loadCrossRateCurrencies = (exchange, quoteCurrency) => {
        if (!exchange) return
        Api.forExchangeAccount(exchange, "_").quotes(quoteCurrency)
            .then(c => this.setState({cross_rate_quote_currencies: c}))
    }

    loadMainExchangeCurrencies = (exchange, quoteCurrency) => {
        if (!exchange) return
        Api.forExchangeAccount(exchange, "_").quotes(quoteCurrency)
            .then(c => this.setState({main_exchange_quote_currencies: c}))
    }

    componentDidMount(): void {
        this.subscriptions.push(Status.exchanges.subscribe(exchanges => {
            this.setState({exchanges: exchanges})
        }))

        // noinspection DuplicatedCode
        Api.forHistory().tradePairs()
            .then(pairs => this.setState({trading_pairs: pairs}))
            .then(() => this.botApi.config())
            .then(config => this.updateConfig(config))
            .then(() => this.exchangeApi.quotes(Project.current.base_currency))
            .then(quotes => this.setState({quotes: quotes}))
            .then(() => this.loadIntervals(this.state.bot.config.trading_pair))
            .then(() => this.loadCrossRateCurrencies(this.state.bot.config.cross_rate_exchange, this.state.bot.config.quote_currency))
            .then(() => this.loadMainExchangeCurrencies(this.state.bot.config.main_exchange, Project.current.base_currency))
            .catch(handleError(this))
    }

    render() {
        return (
            <LoadingOverlay
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
                        {({setFieldValue, values}) =>
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
                                    <CheckBox label={"Arbitrage Mode"}
                                              name={"bot.config.is_arbitrage"}/>
                                    {!values.bot.config.is_arbitrage || <React.Fragment>
                                        <SliderFloat name={"bot.config.arbitrage_delta"} label={"Arbitrage delta"}/>
                                        <SelectBox label={"Main Exchange"}
                                                   name={"bot.config.main_exchange"}
                                                   values={Object.keys(this.state.exchanges)} emptyVal
                                                   onChange={(e) => {
                                                       this.handleMainExchangeChange(e)
                                                       setFieldValue("bot.config.main_exchange_quote_currency", "")
                                                       setFieldValue("bot.config.main_exchange_account", "")
                                                   }}/>
                                        <SelectBox label={"Main Exchange Quote Currency"}
                                                   name={"bot.config.main_exchange_quote_currency"}
                                                   values={this.state.main_exchange_quote_currencies} emptyVal/>
                                        <SelectBox label={"Main Exchange Account"}
                                                   name={"bot.config.main_exchange_account"}
                                                   values={typeof this.state.exchanges[values.bot.config.main_exchange] === "object"
                                                       ? Object.keys(this.state.exchanges[values.bot.config.main_exchange].accounts) : []} emptyVal/>
                                    </React.Fragment>}
                                    {values.bot.config.is_arbitrage || <React.Fragment>
                                        <DatePicker label={"Start Time (UTC)"} utc
                                                    name={"bot.config.lastTimestamp"}/>
                                        <SelectBox label={"Trading Pair"}
                                                   name={"bot.config.trading_pair"}
                                                   values={this.state.trading_pairs} emptyVal
                                                   onChange={(e) => {
                                                       this.handleTradingPairChange(e)
                                                       setFieldValue("bot.config.candles_interval", "")
                                                   }}/>
                                        <SelectBox label={"Candle Interval"}
                                                   name={"bot.config.candles_interval"}
                                                   values={this.state.intervals} emptyVal/>
                                    </React.Fragment>}
                                </div>
                                <div className={"row"}>
                                    <CheckBox label={"CrossRate"}
                                              name={"bot.config.cross_rate"}/>
                                    {!values.bot.config.cross_rate || <React.Fragment>
                                        <SliderInterval label={"CrossRate Interval"}
                                                        name={"bot.config.cross_rate_interval"}/>
                                        <SelectBox label={"CrossRate Exchange"}
                                                   name={"bot.config.cross_rate_exchange"}
                                                   values={Object.keys(this.state.exchanges)} emptyVal
                                                   onChange={(e) => {
                                                       this.handleCrossRateExchangeChange(e)
                                                       setFieldValue("bot.config.cross_rate_quote_currency", "")
                                                   }}/>
                                        <SelectBox label={"CrossRate Quote Currency"}
                                                   name={"bot.config.cross_rate_quote_currency"}
                                                   values={this.state.cross_rate_quote_currencies} emptyVal/>
                                    </React.Fragment>}
                                </div>
                                <div className={"row"}>
                                    <CheckBox
                                        label={"Re-read configuration on each iteration (otherwise reloads on start/stop)"}
                                        name={"bot.config.reload_on_each_job"}/>
                                    <SliderInterval label={"Iteration interval"}
                                                    name={"bot.config.interval"}/>
                                    <SliderInterval label={"OrderWatcher Interval"}
                                                    name={"bot.config.order_watcher_interval"}/>
                                    <SelectBox label={"Quote Currency"}
                                               name={"bot.config.quote_currency"}
                                               values={this.state.quotes} emptyVal
                                               onChange={(e) => {
                                                   this.handleQuoteCurrencyChange(e)
                                                   setFieldValue("bot.config.cross_rate_quote_currency", "")
                                               }}/>


                                    <NumericField name={"bot.config.asksAmount"} label={"Asks Amount"} min={0}/>
                                    <NumericField name={"bot.config.bidsAmount"} label={"Bids Amount"} min={0}/>
                                    <NumericField name={"bot.config.asks_count"} label={"Asks Count"} step={1}/>
                                    <NumericField name={"bot.config.bids_count"} label={"Bids Count"} step={1}/>

                                    <SliderFloat name={"bot.config.priceNoise"} label={"Price Noise"}/>
                                    <SliderFloat name={"bot.config.amountNoise"} label={"Amount Noise"}/>

                                    <SelectBox label={"Distribution"}
                                               name={"bot.config.distribution"}
                                               values={Distribution.values()}
                                               valueToText={Distribution.getValue}/>

                                    <SliderFloat name={"bot.config.price_delta_asks"} label={"Asks Price Delta"}/>
                                    <SliderFloat name={"bot.config.price_range_asks"} label={"Asks Price Range"}/>
                                    <SliderFloat name={"bot.config.price_delta_bids"} label={"Bids Price Delta"}/>
                                    <SliderFloat name={"bot.config.price_range_bids"} label={"Bids Price Range"}/>

                                    <SliderInterval label={"Order Book Update Delay"}
                                                    name={"bot.config.orderBookUpdateDelay"}
                                                    step={10 * time.Millisecond}
                                                    max={time.Minute}/>

                                    <NumericField name={"bot.config.priceCoefficient"} label={"Price Coefficient"}
                                                  step={0.00000001}/>

                                    <NumericField name={"bot.config.max_reap_asks_amount"}
                                                  label={"Max Reap Asks Amount"}
                                                  min={0}/>
                                    <NumericField name={"bot.config.max_reap_bids_amount"}
                                                  label={"Max Reap Bids Amount"}
                                                  min={0}/>
                                    <SaveButton/>
                                </div>
                            </Form>
                        }
                    </Formik>
                </Container>
            </LoadingOverlay>
        );
    }
}