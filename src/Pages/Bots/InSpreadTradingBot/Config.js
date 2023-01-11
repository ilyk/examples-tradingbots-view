import * as React from "react";
import {Form, Formik} from "formik";
import {handleError, Project, time} from "../../../_helpers";
import {Container} from "react-bootstrap";
import {defaultInSpreadTradingBot} from "../../../_services";
import LoadingOverlay from "react-loading-overlay";
import {CheckBox, NumericField, SaveButton, SelectBox, SliderFloat, SliderInterval} from "../Elements/Config";

export class ConfigPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bot: defaultInSpreadTradingBot,
            loaded: false,
            errorMessage: '',
            quotes: [""],
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
        this.botApi.config()
            .then(config => this.updateConfig(config))
            .then(() => this.exchangeApi.quotes(Project.current.base_currency))
            .then(quotes => this.setState({quotes: quotes, loaded: true}))
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
                    <Form
                        className={`horizontal-form`}
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
                            <SelectBox label={"Quote Currency"}
                                       name={"bot.config.quote_currency"}
                                       values={this.state.quotes} emptyVal/>
                        </div>
                        <hr/>
                        <div className="row">
                            <SliderInterval label={"Interval"} name={"bot.config.interval"}/>
                            <CheckBox
                                label={"Re-read configuration on each iteration (otherwise reloads on start/stop)"}
                                name={"bot.config.reload_on_each_job"}/>

                            <SliderInterval label={"Filling Delay"} name={"bot.config.filling_delay"}
                                            step={10 * time.Millisecond}
                                            min={0}
                                            max={5 * time.Minute}/>

                            <NumericField name={"bot.config.volume"} label={"Volume"} min={0}/>
                            <SliderFloat name={"bot.config.interval_volume_noise"} label={"Interval Volume Noise"}/>
                            <SliderFloat name={"bot.config.volume_noise"} label={"Volume Noise"}/>
                            <SliderFloat name={"bot.config.price_noise"} label={"Price Noise"}/>

                            <SelectBox label={"Side"}
                                       name={"bot.config.side"}
                                       values={['', 'ask', 'bid']}
                                       valueToText={(v) => {
                                           return {'':'None','ask':'Sell','bid':'Buy'}[v]
                                       }}/>

                            <NumericField name={"bot.config.min_trades"} label={"Min Trades"} step={1}/>
                            <NumericField name={"bot.config.max_trades"} label={"Max Trades"} step={1}/>

                            <NumericField name={"bot.config.precalculated_best_ask"} label={"Precalculated Best Ask"}
                                          min={0}/>
                            <NumericField name={"bot.config.precalculated_best_bid"} label={"Precalculated Best Bid"}
                                          min={0}/>

                            <SliderFloat name={"bot.config.interval_noise"} label={"Interval Noise"}/>

                            <NumericField name={"bot.config.min_trade_amount"} label={"Min Trade Amount"} min={0}/>
                            <SaveButton/>
                        </div>
                    </Form>
                </Formik>
            </Container>
        </LoadingOverlay>;
    }
}