import * as React from "react";
import {FieldArray, Form, Formik} from "formik";
import {handleError, Project} from "../../../_helpers";
import {Button, Container} from "react-bootstrap";
import {defaultTelegramBot} from "../../../_services";
import LoadingOverlay from "react-loading-overlay";
import {
    CheckBox,
    NumericField,
    SaveButton,
    SelectBox,
    SliderFloat,
    SliderInterval,
    TextField
} from "../Elements/Config";

export class Config extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bot: defaultTelegramBot,
            loaded: false,
            quotes: [""],
            errorMessage: ''
        }
        this.exchangeApi = this.props.exchangeApi
        this.botApi = this.props.botApi
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
            .then(quotes => this.setState({quotes: quotes}))
            .catch(handleError(this))
    }

    updateConfig = config => {
        this.setState(state => {
            let bot = state.bot
            bot.config = config

            return {bot: bot, loaded: true}
        })
    }

    render() {
        return (
            <LoadingOverlay
                active={!this.state.loaded}
                spinner
                text='Loading...'
            >
                {this.state.bot.config.apiToken && <Container fluid={true} className={"mt-3"}>
                    <Formik initialValues={{bot: this.state.bot}} onSubmit={(values, actions) => {
                        let that = this
                        that.setState({errorMessage: ''})

                        this.botApi.saveConfig(values.bot.config)
                            .then(config => this.updateConfig(config))
                            .catch(handleError(that))
                            .finally(() => actions.setSubmitting(false))
                    }} enableReinitialize={true}>
                        {({values}) => (
                            <Form className={"horizontal-form"}>
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
                                    <SelectBox label={"Quote Currency"}
                                               name={"bot.config.quote_currency"}
                                               values={this.state.quotes} emptyVal />
                                </div>
                                <h5>Order Quantity
                                    <hr/>
                                </h5>
                                <div className={"row"}>
                                    <SliderInterval label={"Periodicity"} name={"bot.config.orderQty_interval"}/>
                                    <NumericField name={"bot.config.orderQuantity"} label={"Order Quantity"}
                                                  step={0.00000001}/>
                                    <SliderFloat name={"bot.config.priceDelta"} label={"Price Delta"}/>
                                </div>
                                <h5>Balances
                                    <hr/>
                                </h5>

                                <FieldArray name={"bot.config.balance_check"} render={({remove, push}) => (
                                    <div className={"row"}>
                                        <SliderInterval label={"Periodicity"} name={"bot.config.interval"}/>
                                        {values.bot.config.balance_check.length > 0 && values.bot.config.balance_check.map((check, index) => (
                                            <div className={"row"} key={index}>
                                                <div className={"col"}>
                                                    <TextField label={"Cryptocurrency code"}
                                                               className={"col-sm-12 col-md-12 col-lg-12"}
                                                               name={`bot.config.balance_check.${index}.currency_code`}/>
                                                </div>
                                                <div className={"col"}>
                                                    <NumericField label={"Cryptocurrency balance"}
                                                                  className={"col-sm-12 col-md-12 col-lg-12"}
                                                                  name={`bot.config.balance_check.${index}.currency_balance`}/>
                                                </div>
                                                <div className={"col"}>
                                                    <SliderFloat label={"Balance change delta"}
                                                                 className={"col-sm-12 col-md-12 col-lg-12"}
                                                                 name={`bot.config.balance_check.${index}.balance_change_delta`}/>
                                                </div>
                                                <div className="col-1">
                                                    <Button type="button" variant={"secondary"}
                                                            onClick={() => remove(index)}>X</Button>
                                                </div>
                                            </div>
                                        ))}
                                        <div className={"form-group row col-lg-6 col-sm-12"}>
                                            <Button variant={"secondary"} type="button"
                                                    onClick={() => push({
                                                        currency_code: '',
                                                        currency_balance: '0.0',
                                                        balance_change_delta: '0.1'
                                                    })}>
                                                Add Cryptocurrency
                                            </Button>
                                        </div>
                                    </div>
                                )}/>
                                <h5>Trades
                                    <hr/>
                                </h5>
                                <div className={"row"}>
                                    <SliderInterval label={"Periodicity"} name={"bot.config.trades_interval"}/>
                                </div>
                                <div className={"row"}>
                                    <SaveButton/>
                                </div>
                            </Form>)}
                    </Formik>
                </Container>}
            </LoadingOverlay>
        );
    }
}