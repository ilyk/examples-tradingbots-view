import * as React from "react";
import {Container} from "react-bootstrap";
import {defaultHistoryBot, Status} from "../../../_services";
import {Form, Formik} from "formik";
import {handleError} from "../../../_helpers";

import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import LoadingOverlay from "react-loading-overlay";
import {CheckBox, SaveButton, SelectBox, SliderInterval, TextField} from "../Elements/Config";
import {candle_intervals} from "../../../_bots";
import {Api} from "../../../_api";

export class ConfigPage extends React.Component {
    constructor() {
        super();
        this.state = {
            bot: defaultHistoryBot,
            loaded: false,
        }
        this.subscriptions =  []
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
                        <Formik initialValues={{bot: this.state.bot}} onSubmit={(values, actions) => {
                            this.setState({errorMessage: ''})
                            const {interval, reload_on_each_job, trading_pair, candle_interval} = values.bot.config,
                                requestParams = {
                                    interval,
                                    reload_on_each_job,
                                    trading_pair,
                                    candle_interval
                                }

                            Api.forHistory().saveBotConfig(requestParams)
                                .then(() => actions.setSubmitting(false))
                                .catch(handleError(this))
                        }} enableReinitialize={true}>
                            <Form className={"form-horizontal"}>
                                {this.state.errorMessage &&
                                <div className="alert alert-danger"
                                     role="alert"> {this.state.errorMessage} </div>}
                                <h3>
                                    Bot config
                                </h3>
                                <div className={"row"}>
                                    <CheckBox
                                        label={"Re-read configuration on each iteration (otherwise reloads on start/stop)"}
                                        name={"bot.config.reload_on_each_job"}/>
                                    <SliderInterval label={"Iteration interval"}
                                                    name={"bot.config.interval"}/>
                                    <TextField label={"Trading Pair"}
                                               name={"bot.config.trading_pair"}/>
                                    <SelectBox label={"Candle Interval"}
                                               name={"bot.config.candle_interval"}
                                               values={Object.keys(candle_intervals)}
                                               valueToText={i => candle_intervals[i]}/>

                                    <SaveButton/>
                                </div>
                            </Form>
                        </Formik>
                    </div>
                </Container>
            </LoadingOverlay>
        );
    }
}