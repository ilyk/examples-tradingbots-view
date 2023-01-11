import iceberg_logo from "../Navigation/LeftNav/iceberg.png";
import telegram_logo from "../Navigation/LeftNav/telegram.svg";
import simulation_logo from "../Navigation/LeftNav/simulation.svg";
import orderbook_extender_logo from "../Navigation/LeftNav/orderbook_extender.svg";
import inspread_logo from "../Navigation/LeftNav/inspread.svg";
import hunter_logo from "../Navigation/LeftNav/hunter.svg";
import floating_wall_logo from "../Navigation/LeftNav/floating_wall_logo.svg";
import pump_n_dump_logo from "../Navigation/LeftNav/pump_n_dump_logo.svg";

export const Bots = {
    iceberg: {
        id: "iceberg",
        image: iceberg_logo,
        title: "Iceberg Bot",
    },
    telegram: {
        id: "telegram",
        image: telegram_logo,
        title: "Telegram Bot",
    },
    simulation: {
        id: "simulation",
        image: simulation_logo,
        title: "Simulation Bot",
    },
    orderbook_extender: {
        id: "orderbook_extender",
        image: orderbook_extender_logo,
        title: "OrderBook Extender Bot",
    },
    inspread: {
        id: "inspread",
        image: inspread_logo,
        title: "InSpread Trading Bot",
    },
    hunter: {
        id: "hunter",
        image: hunter_logo,
        title: "Hunter Bot",
    },
    "floating-wall": {
        id: "floating-wall",
        image: floating_wall_logo,
        title: "Floating Wall Bot",
    },
    "pump-n-dump": {
        id: "pump-n-dump",
        image: pump_n_dump_logo,
        title: "Pump&Dump Bot",
    },
    values: () => [
        "iceberg",
        "telegram",
        "simulation",
        "orderbook_extender",
        "inspread",
        "hunter",
        "floating-wall",
        "pump-n-dump",
    ]
}