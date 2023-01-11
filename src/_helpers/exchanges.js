import {
    BinanceConfigPage,
    BithumbConfigPage,
    BitmaxConfigPage,
    BittrexConfigPage,
    CoinbaseConfigPage,
    CoinoneConfigPage,
    DummyExchangePage,
    GateConfigPage,
    KucoinConfigPage,
    MxcConfigPage,
    PoloniexConfigPage,
    UpbitConfigPage,
} from "../Pages/Exchanges";
import coinone_logo from '../_resources/logos/coinone.jpg'
import bittrex_logo from '../_resources/logos/bittrex.svg'
import coinbase_logo from '../_resources/logos/coinbase-pro.svg'
import dummy_logo from '../_resources/logos/dummy.svg'
import upbit_logo from '../_resources/logos/upbit.svg'
import binance_logo from '../_resources/logos/binance.svg'
import poloniex_logo from '../_resources/logos/poloniex.svg'
import gate_logo from '../_resources/logos/gateio.svg'
import bitmax_logo from '../_resources/logos/bitmax.webp'
import kucoin_logo from '../_resources/logos/kucoin.svg'
import mxc_logo from '../_resources/logos/mxc.png'
import bithumb_logo from '../_resources/logos/bithumb.svg'

export const Exchanges = {
    coinone: {
        id: "coinone",
        name: "Coinone",
        component: CoinoneConfigPage,
        logo: coinone_logo,
    },
    bittrex: {
        id: "bittrex",
        name: "Bittrex",
        component: BittrexConfigPage,
        logo: bittrex_logo,
    },
    coinbase: {
        id: "coinbase",
        name: "Coinbase",
        component: CoinbaseConfigPage,
        logo: coinbase_logo,
    },
    upbit: {
        id: "upbit",
        name: "Upbit",
        component: UpbitConfigPage,
        logo: upbit_logo,
    },
    binance: {
        id: "binance",
        name: "Binance",
        component: BinanceConfigPage,
        logo: binance_logo,
    },
    poloniex: {
        id: "poloniex",
        name: "Poloniex",
        component: PoloniexConfigPage,
        logo: poloniex_logo,
    },
    gate: {
        id: "gate",
        name: "Gate.io",
        component: GateConfigPage,
        logo: gate_logo,
    },
    bitmax: {
        id: "bitmax",
        name: "Bitmax",
        component: BitmaxConfigPage,
        logo: bitmax_logo,
    },
    kucoin: {
        id: "kucoin",
        name: "Kucoin",
        component: KucoinConfigPage,
        logo: kucoin_logo,
    },
    mxc: {
        id: "mxc",
        name: "Mxc",
        component: MxcConfigPage,
        logo: mxc_logo,
    },
    bithumb: {
        id: "bithumb",
        name: "Bithumb",
        component: BithumbConfigPage,
        logo: bithumb_logo,
    },
    dummy: {
        id: "dummy",
        name: "Dummy (Sandbox)",
        component: DummyExchangePage,
        logo: dummy_logo,
    },
    values: () => [
        "coinone",
        "bittrex",
        "coinbase",
        "upbit",
        "binance",
        "poloniex",
        "gate",
        "bitmax",
        "kucoin",
        "mxc",
        "bithumb",
        "dummy",
    ]
}