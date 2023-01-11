import {authenticationService} from "./authentication.service";
import {appConfig, Project} from "../_helpers";
import {Subject} from "rxjs";
import {BotStatus, BotTag, Distribution} from "../_bots";
import {WebSocketClient} from "./websocket.service";

export const ServerStatus = {
    ONLINE: "Online",
    OFFLINE: "Offline",
    CONNECTING: "Connecting",
}

let initialized = false,
    ws = new WebSocketClient();
export const defaultHistoryBot = {
    state: {lastTimestamp: 0},
    config: {reload_on_each_job: false, interval: 0, trading_pair: "BNBUSDT", candle_interval: "15m"},
    status: BotStatus.STOPPED
};
export const defaultTelegramBot = {
    state: {lastTimestamp: 0},
    config: {
        reload_on_each_job: false,
        interval: 0,
        orderQuantity: 0.0,
        priceDelta: 0.0,
        apiToken: '',
        username: '',
        balance_check: []
    },
    status: BotStatus.STOPPED
};
export const defaultIcebergBot = {
    state: {lastTimestamp: 0},
    config: {
        reload_on_each_job: false,
        interval: 0,
        bidsAmount: 0.0,
        asksAmount: 0.0,
        orderCount: 0,
        priceNoise: 0.0001,
        amountNoise: 0.0001,
        distribution: Distribution.Flat,
        price_delta_asks: 0.0,
        price_range_asks: 0.0,
        price_delta_bids: 0.0,
        price_range_bids: 0.0,
        orderBookUpdateDelay: 0,
        priceCoefficient: 0.00000001,
        trading_pair: "",
        candles_interval: "15m",
        cross_rate: false,
        is_arbitrage: false,
    },
    status: BotStatus.STOPPED
};
export const defaultSimulationBot = {
    state: {lastTimestamp: 0},
    config: {
        interval: 0,
        reload_on_each_job: false,
        asks_amount: 0.0,
        bids_amount: 0.0,
        order_count: 0.0,
        price_noise: 0.0,
        amount_noise: 0.0,
        distribution: Distribution.Flat,
        price_delta_asks: 0.0,
        price_range_asks: 0.0,
        price_delta_bids: 0.0,
        price_range_bids: 0.0,
        min_trades: 0.0,
        max_trades: 0.0,
        trade_volume: 0.0,
        volume_coefficient: 0.0,
        price_coefficient: 0.0,
        order_filling_delay: 0,
        trade_quantity_noise_coefficient: 0.0,
        interval_noise: 0.0,
        open_close_interval: 0,
        cross_rate: false,
        trading_pair: "",
        candles_interval: "15m",
        simulation: true,
        is_arbitrage: false,
    },
    status: BotStatus.STOPPED
};
export const defaultOrderBookExchangerBot = {
    state: {lastTimestamp: 0},
    config: {
        reload_on_each_job: false,
        interval: 0,
        bids_amount: 0.0,
        asks_amount: 0.0,
        order_count: 0,
        price_noise: 0.0001,
        amount_noise: 0.0001,
        distribution: Distribution.Flat,
        price_range_asks: 0.0,
        price_range_bids: 0.0,
        orderBookUpdateDelay: 0,
        priceCoefficient: 0.00000001,
        trading_pair: "",
        bids_starting_price: 0,
        asks_starting_price: 0,
        transfusion_enabled: true,
        orderswatcher_enabled: true,
    },
    status: BotStatus.STOPPED
};
export const defaultFloatingWallBot = {
    state: {lastTimestamp: 0},
    config: {
        reload_on_each_job: false,
        interval: 0,
        bids_amount: 0.0,
        asks_amount: 0.0,
        order_count: 0,
        price_noise: 0.0001,
        amount_noise: 0.0001,
        distribution: Distribution.Flat,
        price_range_asks: 0.0,
        price_range_bids: 0.0,
        orderBookUpdateDelay: 0,
        priceCoefficient: 0.00000001,
        trading_pair: "",
        bids_starting_price: 0,
        asks_starting_price: 0,
        transfusion_enabled: true,
        orderswatcher_enabled: true,
    },
    status: BotStatus.STOPPED
};
export const defaultInSpreadTradingBot = {
    state: {lastTimestamp: 0},
    config: {
        reload_on_each_job: false,
        interval: 0,
        quote_currency: '',
        volume: 0.0,
        volume_noise: 0.0,
        price_noise: 0.0,
        side: '',
        min_trades: 0,
        max_trades: 0,
        filling_delay: 0.0001,
        precalculated_best_bid: 0.0,
        precalculated_best_ask: 0.0,
        interval_noise: 0,
        interval_volume_noise: 0,
        min_trade_amount: 0,
    },
    status: BotStatus.STOPPED
};
export const defaultHunterBot = {
    state: {lastTimestamp: 0},
    config: {
        reload_on_each_job: false,
        interval: 0,
        quote_currency: '',
        volume: 0.0,
        volume_noise: 0.0,
        price_noise: 0.0,
        side: '',
        min_trades: 0,
        max_trades: 0,
        filling_delay: 0.0001,
        precalculated_best_bid: 0.0,
        precalculated_best_ask: 0.0,
        interval_noise: 0,
        interval_volume_noise: 0
    },
    status: BotStatus.STOPPED
};
export const defaultPumpNDumpBot = {
    state: {lastTimestamp: 0},
    config: {
        reload_on_each_job: false,
        asks_amount: 0.0,
        bids_amount: 0.0,
        order_count: 0.0,
        price_noise: 0.0,
        amount_noise: 0.0,
        distribution: Distribution.Flat,
        price_delta_asks: 0.0,
        price_range_asks: 0.0,
        price_delta_bids: 0.0,
        price_range_bids: 0.0,
        min_trades: 0.0,
        max_trades: 0.0,
        trade_volume: 0.0,
        order_filling_delay: 0,
        trade_quantity_noise_coefficient: 0.0,
        interval_noise: 0.0,
        open_close_interval: 0,
        cross_rate: false,
        simulation: true,
    },
    status: BotStatus.STOPPED
};
const HistoryBotSubject = new Subject(defaultHistoryBot),
    HistoryBotMessageSubject = new Subject(""),
    LogsSubject = new Subject(""),
    ServerStatusSubject = new Subject(ServerStatus.OFFLINE);

const ExchangesStatusSubject = new Subject({})

interface Log {
    tag: string,
    timestamp: string,
    message: string,
    priority: string,
    file_name: string,
    file_line: number,
}

interface PongBot {
    telegram: BotStatus,
    iceberg: BotStatus,
    simulation: BotStatus,
}

interface PongExchange {
    status: string,
    bots: PongBot,
}

interface Pong {
    pong: boolean,
    history_bot: { state: { lastTimestamp: number }, config: { reload_on_each_job: boolean, interval: number }, status: BotStatus },
    exchanges: {
        exchangeName: PongExchange,
    }
}

function processPongMessage(status: Pong) {
    if (typeof status.history_bot !== 'undefined') {
        let bot = status.history_bot;
        bot.state.lastTimestamp = new Date(bot.state.lastTimestamp).toISOString();
        HistoryBotSubject.next(bot)
    }
    if (typeof status.exchanges !== 'undefined') {
        ExchangesStatusSubject.next(status.exchanges)
    }

    ServerStatusSubject.next(ServerStatus.ONLINE)
}

function processLogMessage(log: Log) {
    switch (log.tag) {
        default:
            LogsSubject.next(log)
            break;
        case BotTag.HISTORY:
            HistoryBotMessageSubject.next(log)
            break;
    }
}

let pingInterval;

function startPinging() {
    stopPinging()
    pingInterval = setInterval(() => {
        ws.send(JSON.stringify({ping: true}))
    }, 1000) // once per second
}

function stopPinging() {
    clearInterval(pingInterval)
}

class LoggerSubscriber {
    constructor(subject: Subject) {
        this.subject = subject
    }

    subscribe = (severity: number, from: Date, to: Date, tag: string, callback: function) => {
        ws.send(JSON.stringify({
            projectId: Project.currentId,
            logSubscribe: true,
            priority: severity,
            from: from.toISOString(),
            to: to.toISOString(),
            tag: tag,
        }))
        return this.subject.asObservable().subscribe(callback)
    }

    unsubscribe = () => {
        ws.send(JSON.stringify({
            logSubscribe: false,
        }))
    }
}

class Message {
    send() {
        ws.send(JSON.stringify(this.getMessage()))
    }

    getMessage() {
        return {};
    }
}

export class StartHistoryBot extends Message {
    getMessage() {
        return {startHistory: true}
    }
}

export class StopHistoryBot extends Message {
    getMessage() {
        return {stopHistory: true}
    }
}

export const Status = {
    server: ServerStatusSubject.asObservable(),
    exchanges: ExchangesStatusSubject.asObservable(),
    bots: {
        history: HistoryBotSubject.asObservable(),
    },
    messages: {
        history: new LoggerSubscriber(HistoryBotMessageSubject),
        logs: new LoggerSubscriber(LogsSubject),
    },
    ws: ws,
    init: function () {
        if (initialized) return

        let wsUrl = `${appConfig.wsUrl}?token=${authenticationService.token()}`;
        if (localStorage.getItem("project_current")) {
            wsUrl = wsUrl.replace("/ws", `/api/projects/${localStorage.getItem("project_current")}/ws`)
        }

        console.log("Connecting to WebSocket on " + wsUrl)
        ws.open(wsUrl)

        ws.onopen = () => {
            ServerStatusSubject.next(ServerStatus.CONNECTING)
            startPinging()
            initialized = true
        }
        ws.onclose = () => {
            console.log("WebSocketClient: closed", arguments);
            ServerStatusSubject.next(ServerStatus.OFFLINE)
            initialized = false
            stopPinging()
        };
        ws.onmessage = (msg) => {
            const dataFromServer = JSON.parse(msg.data);

            if (typeof dataFromServer.pong !== 'undefined' && dataFromServer.pong) {
                processPongMessage(dataFromServer)
            } else if (typeof dataFromServer.tag !== 'undefined') {
                processLogMessage(dataFromServer)
            }
        };

        initialized = true
    },
    stop: function () {
        if (!initialized) return
        ws.close()
    },
    switchUrl: function (url) {
        if (!initialized) return
        ws.url = url
        ws.close(3666, 'Switching url')
    },
}

Project.subscribeCurrentId(() => {
    let wsUrl = `${appConfig.wsUrl}?token=${authenticationService.token()}`;
    let projectId = `${localStorage.getItem("project_current")}`;
    let url = wsUrl;

    if (projectId) {
        url = wsUrl.replace("/ws", `/api/projects/${projectId}/ws`);
    }
    if (initialized && url !== ws.url) {
        Status.switchUrl(url)
    }
})
