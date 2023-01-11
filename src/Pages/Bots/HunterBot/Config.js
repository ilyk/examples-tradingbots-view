import * as React from "react";
import {Form, Formik} from "formik";
import {handleError, Project} from "../../../_helpers";
import {Container} from "react-bootstrap";
import {defaultHunterBot} from "../../../_services";
import LoadingOverlay from "react-loading-overlay";
import {CheckBox, NumericField, SaveButton, SelectBox, SliderFloat, SliderInterval} from "../Elements/Config";

export class ConfigPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bot: defaultHunterBot,
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
                            <SliderInterval label={"Check Interval"} name={"bot.config.interval"}/>
                            <CheckBox
                                label={"Re-read configuration on each iteration (otherwise reloads on start/stop)"}
                                name={"bot.config.reload_on_each_job"}/>
                        </div>
                        <hr/>
                        <div className="row">
                            <NumericField name={"bot.config.buy_min_price"} label={"Buy Min Price"} step={0.00000001}
                                          min={0}/>
                            <NumericField name={"bot.config.buy_max_price"} label={"Buy Max Price"} step={0.00000001}/>
                            <NumericField name={"bot.config.ask_min_price"} label={"Ask Min Price"} step={0.00000001}/>
                            <NumericField name={"bot.config.ask_max_price"} label={"Ask Max Price"} step={0.00000001}/>

                            <NumericField name={"bot.config.amount"} label={"Amount"}/>
                            <NumericField name={"bot.config.bids_sum_amount"} label={"Bids SumAmount"}/>
                            <NumericField name={"bot.config.asks_sum_amount"} label={"Asks SumAmount"}/>
                            <SliderFloat name={"bot.config.amount_noise"} label={"Amount Noise"}/>
                            <SelectBox label={"Goal"}
                                       name={"bot.config.goal"}
                                       values={['', 'buy', 'sell']}
                                       valueToText={(v) => {
                                           return {'': 'Both', 'buy': 'Buy', 'sell': 'Sell'}[v]
                                       }}/>

                            <NumericField name={"bot.config.buy_limit"} label={"Buy Limit"}/>
                            <NumericField name={"bot.config.sell_limit"} label={"Sell Limit"}/>

                            <SaveButton/>
                        </div>
                    </Form>
                </Formik>
            </Container>
        </LoadingOverlay>;
    }
}