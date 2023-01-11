import * as React from "react";
import {defaultTelegramBot, Status} from "../../../_services";
import {BotStatus} from "../../../_bots";
import LoadingOverlay from "react-loading-overlay";
import {Button, Container, Jumbotron} from "react-bootstrap";
import MaterialIcon, {colorPalette} from "material-icons-react";
import {handleError} from "../../../_helpers";
import {Field, Form, Formik} from "formik";

export class StatusPage extends React.Component {
    static defaultProps = {
        exchange: "",
        account: "",
        botType: "telegram"
    }

    constructor(props) {
        super(props);
        this.state = {
            bot: defaultTelegramBot,
            loaded: false,
            errorMessage: ''
        }
        this.exchangeApi = this.props.exchangeApi
        this.botApi = this.props.botApi
        this.subscriptions = []
    }

    startBot = () => {
        this.botApi.start().then(() => {
            this.setState(state => {
                let bot = state.bot
                bot.status = BotStatus.STARTING
                console.log(bot)
                return ({bot: bot})
            })
        })
    }
    stopBot = () => {
        this.botApi.stop().then(() => {
            this.setState(state => {
                let bot = state.bot
                bot.status = BotStatus.STOPPING
                console.log(bot)
                return ({bot: bot})
            })
        })
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
        this.subscriptions.push(Status.exchanges.subscribe(exchanges => this.setState(state => {
            let bot = state.bot
            if (typeof exchanges[this.props.exchange] !== 'undefined') {
                bot.status = exchanges[this.props.exchange].accounts[this.props.account][this.props.botType].status
            }

            return {bot: bot}
        })))
        this.botApi.config()
            .then(this.updateConfig)
            .catch(handleError(this))
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
                {this.state.bot.config.apiToken && <Container fluid={true} className={"mt-3"}>
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
                        </dl>
                    </div>
                </Container>}
                {this.state.bot.config.apiToken !== '' || <Jumbotron>
                    <h3>How to register telegram bot API token:</h3>
                    <ul>
                        <li>Start chat with <a href="http://t.me/BotFather" rel="noopener noreferrer"
                                               target="_blank">BotFather</a></li>
                        <li>Say "/start" to the BotFather</li>
                        <li>Say "/newbot" to the BotFather</li>
                        <li>Enter bot's display name (how others will see him)</li>
                        <li>Enter bot's username. It must end with `bot` suffix</li>
                        <li>In the last response you'll see something like<br/>
                            <div style={{width: "100%", background: "gray", color: "light-green"}}>
                                Done! Congratulations on your new bot. You will find it at t.me/NewCreated_bot.
                                You can now add a description, about section and profile picture for your bot, see
                                /help for a list of commands. By the way, when you've finished creating your cool bot,
                                ping our Bot Support if you want a better username for it. Just make sure the bot is
                                fully
                                operational before you do this.<br/>
                                <br/>
                                Use this token to access the HTTP API:<br/>
                                xxxxxxxxx:XXX-XXXXX_XXX_XXXXXXXXXXXXXXXXXXXXX<br/>
                                <br/>
                                For a description of the Bot API, see this page: https://core.telegram.org/bots/api
                            </div>
                        </li>
                        <li>Please bring bot's username (which ends with `bot`) and token (which was in the response) to
                            this page below
                        </li>
                    </ul>
                </Jumbotron>}
                <Container fluid={true} className={"mt-3"}>
                    <Formik initialValues={{bot: this.state.bot}} onSubmit={(values, actions) => {
                        let that = this
                        that.setState({errorMessage: ''})

                        this.botApi.saveConfig(values.bot.config)
                            .then(this.updateConfig)
                            .finally(() => actions.setSubmitting(false))
                    }} enableReinitialize={true}>
                        {({isSubmitting}) => (
                            <Form className={"horizontal-form"}>
                                {this.state.errorMessage &&
                                <div className="alert alert-danger" role="alert">
                                    {this.state.errorMessage}
                                </div>}
                                <h3>
                                    Telegram API bot configuration
                                </h3>
                                <div className={"row"}>
                                    <div className="form-group row col-lg-6 col-sm-12">
                                        <label htmlFor={"bot.config.username"}
                                               className={"col-sm-12 col-form-label"}>
                                            <b>Telegram bot username</b>
                                        </label>
                                        <div className="col-sm-12">
                                            <Field id={"bot.config.username"} name={"bot.config.username"}
                                                   className="form-control"/>
                                        </div>
                                    </div>
                                    <div className="form-group row col-lg-6 col-sm-12">
                                        <label htmlFor={"bot.config.apiToken"}
                                               className={"col-sm-12 col-form-label"}>
                                            <b>Telegram bot Api Token</b>
                                        </label>
                                        <div className="col-sm-12">
                                            <Field id={"bot.config.apiToken"} name={"bot.config.apiToken"}
                                                   className="form-control"/>
                                        </div>
                                    </div>
                                    <Button block={true} variant={"primary"} size={"sm"} type={"submit"}
                                            disabled={isSubmitting}>
                                        Save
                                    </Button>
                                </div>
                            </Form>)}
                    </Formik>
                </Container>
            </LoadingOverlay>
        );
    }
}