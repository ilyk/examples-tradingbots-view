import {deleteParams, getParams, handleJsonResponse, postParams, Project, putParams} from "../_helpers";
import {BotStatus} from "../_bots";

class HistoryApi {
    baseUrl = () => `${window.appConfig.apiUrl}/api/history`
    botBaseUrl = () => `${window.appConfig.apiUrl}/api/bots/history`
    saveCandle = (candle) =>
        fetch(
            `${this.baseUrl()}/candle${candle._id ? "/" + candle._id : ""}`,
            candle._id ? putParams(candle) : postParams(candle)
        ).then(handleJsonResponse)
    deleteCandle = (candle) =>
        fetch(`${this.baseUrl()}/candle/${candle._id}`, deleteParams()).then(handleJsonResponse)
    tradePairs = () =>
        fetch(`${this.baseUrl()}/trade_pairs`, getParams()).then(handleJsonResponse)
    tradeIntervals = (pair) =>
        fetch(`${this.baseUrl()}/trade_pairs/${pair}/intervals`, getParams()).then(handleJsonResponse)
    candles = (skip, limit, fromDate, symbol) => {
        let url = `${this.baseUrl()}?skip=${skip}&limit=${limit}&fromDate=${fromDate}&symbol=${symbol}`;
        return fetch(url, getParams()).then(handleJsonResponse)
    }
    saveBotConfig = (params) =>
        fetch(`${this.botBaseUrl()}/config`, putParams(params)).then(handleJsonResponse)
}

class BotApi {
    get project() {
        return Project.currentId
    }

    constructor(exchange, account, bot) {
        this.exchange = exchange
        this.account = account
        this.bot = bot
    }

    project: string
    exchange: string
    account: string
    bot: string
    baseUrl = () => `${window.appConfig.apiUrl}/api/projects/${this.project}/exchanges/${this.exchange}/accounts/${this.account}/bots/${this.bot}`
    config = () => fetch(`${this.baseUrl()}/config`, getParams()).then(handleJsonResponse)
    saveConfig = (params) => fetch(`${this.baseUrl()}/config`, putParams(params)).then(handleJsonResponse)
    state = () => fetch(`${this.baseUrl()}/state`, getParams()).then(handleJsonResponse)

    cancelOrders = () => fetch(`${this.baseUrl()}/orders`, deleteParams()).then(handleJsonResponse)

    start = () => fetch(`${this.baseUrl()}/status`, putParams(BotStatus.STARTING)).then(handleJsonResponse)
    stop = () => fetch(`${this.baseUrl()}/status`, putParams(BotStatus.STOPPING)).then(handleJsonResponse)
    schedule = () => fetch(`${this.baseUrl()}/status`, putParams(BotStatus.SCHEDULED)).then(handleJsonResponse)
}

class PumpNDumpBotApi extends BotApi {
    candles = (skip, limit) => {
        let url = `${this.baseUrl()}/candles?skip=${skip}&limit=${limit}`;
        return fetch(url, getParams()).then(handleJsonResponse)
    }
    saveCandle = (candle) =>
        fetch(
            `${this.baseUrl()}/candles${candle._id ? "/" + candle._id : ""}`,
            candle._id ? putParams(candle) : postParams(candle)
        ).then(handleJsonResponse)
    deleteCandle = (candle) =>
        fetch(`${this.baseUrl()}/candles/${candle._id}`, deleteParams()).then(handleJsonResponse)
    skipCandle = () =>
        fetch(`${this.baseUrl()}/skipCandle`, getParams())
}

class ExchangeApi {
    get project() {
        return Project.currentId
    }

    constructor(exchange) {
        this.exchange = exchange
    }

    project: string
    exchange: string
    forAccount = (account) => new ExchangeAccountApi(this.exchange, account)
    baseUrl = () => `${window.appConfig.apiUrl}/api/projects/${this.project}/exchanges/${this.exchange}`
    configs = () => fetch(`${this.baseUrl()}/config`, getParams()).then(handleJsonResponse)
}

class ExchangeAccountApi {
    get project() {
        return Project.currentId
    }

    constructor(exchange, account) {
        this.exchange = exchange
        this.account = account
    }

    project: string
    exchange: string
    account: string
    baseUrl = () => `${window.appConfig.apiUrl}/api/projects/${this.project}/exchanges/${this.exchange}/accounts/${this.account}`
    createOrder = (price, amount, isAsk, quoteCurrency) => {
        return fetch(`${this.baseUrl()}/orders`, postParams({
            price: price,
            amount: amount,
            isAsk: isAsk,
            quoteCurrency: quoteCurrency
        })).then(handleJsonResponse);
    }
    quotes = (currency) => fetch(`${this.baseUrl()}/quotes/${currency}`, getParams()).then(handleJsonResponse)
    balance = () => fetch(`${this.baseUrl()}/balance`, getParams()).then(handleJsonResponse)
    orders = () => fetch(`${this.baseUrl()}/orders`, getParams()).then(handleJsonResponse)
    orderBook = quote => fetch(`${window.appConfig.apiUrl}/api/projects/${this.project}/exchanges/${this.exchange}/orderBook/${quote}`, getParams()).then(handleJsonResponse)
    cancelOrder = ({id, currency, price, amount, isAsk, quoteCurrency}) =>
        fetch(`${this.baseUrl()}/orders/${id}?currency=${currency}&price=${price}&amount=${amount}&isAsk=${isAsk}&quoteCurrency=${quoteCurrency}`,
            deleteParams())
            .then(handleJsonResponse)
    config = () => fetch(`${this.baseUrl()}/config`, getParams()).then(handleJsonResponse)
    deleteAccount = () => fetch(`${this.baseUrl()}`, deleteParams())
    saveConfig = (params) => fetch(`${this.baseUrl()}/config`, putParams(params)).then(handleJsonResponse)

    forBot = (bot) => bot === 'pump-n-dump'
        ? new PumpNDumpBotApi(this.exchange, this.account, bot)
        : new BotApi(this.exchange, this.account, bot)
}

class ProjectApi {
    constructor(id?) {
        this.project = id ? id : (Project ? Project.currentId : "")
    }

    project: string
    list = () => fetch(`${window.appConfig.apiUrl}/api/projects`, getParams())
        .then(handleJsonResponse)
    get = () => fetch(`${window.appConfig.apiUrl}/api/projects/${this.project}`, getParams())
        .then(handleJsonResponse)
    save = (params) => fetch(`${window.appConfig.apiUrl}/api/projects/${this.project}`, putParams(params))
        .then(handleJsonResponse)
    delete = () => fetch(`${window.appConfig.apiUrl}/api/projects/${this.project}`, deleteParams())
}

class UserApi {
    constructor(username) {
        this.username = username
    }

    username: ""
    updateProfile = (params) => fetch(`${window.appConfig.apiUrl}/api/user/${this.username}`, putParams(params))
        .then(handleJsonResponse)
    profile = () => fetch(`${window.appConfig.apiUrl}/api/user/${this.username}`, getParams())
        .then(handleJsonResponse)
}

export const Api = {
    forExchange: (exchange) => new ExchangeApi(exchange),
    forExchangeAccount: (exchange, account) => new ExchangeAccountApi(exchange, account),
    forHistory: () => new HistoryApi(),
    forUser: (username) => new UserApi(username),
    forProject: (id) => new ProjectApi(id),
}