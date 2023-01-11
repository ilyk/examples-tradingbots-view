import * as React from "react";
import {CandlesTable} from "./CandlesTable"
import DatePicker from "react-datepicker";
import {Api} from "../../../_api";

class HistoryBotCandlesPage extends React.Component {
    constructor() {
        super();
        this.state = {
            candles: [],
            total: 0,
            limit: 5,
            skip: -5,
            fromDate: new Date("2017-11-06").toISOString(),
            symbol: "",
            symbols: []
        }
        this.api = Api.forHistory()
    }

    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
        if (prevState.fromDate !== this.state.fromDate
            || prevState.symbol !== this.state.symbol
            || prevState.limit !== this.state.limit) {
            this.load(this.state.limit, 0)
        }
    }

    componentDidMount(): void {
        this.loadCandles()
        Api.forHistory().tradePairs().then(pairs => this.setState({symbols: pairs}))
    }

    loadCandles = () => {
        const limit = this.state.limit;
        const skip = this.state.skip + limit;

        this.load(limit, skip)
    }

    load = (limit, skip) => {
        if (skip < 0) {
            skip = 0
        }


        this.setState({candles: []},
            () => this.api.candles(skip, limit, this.state.fromDate, this.state.symbol)
                .then(response => {
                    const limit = response.limit;
                    const skip = response.skip;
                    const data = response.data;
                    const total = response.total;

                    this.setState({
                        candles: data || [],
                        skip: skip,
                        limit: limit,
                        total: total,
                    })
                })
        )
    }

    prevCandles = () => {
        const limit = this.state.limit;
        const skip = this.state.skip - limit;

        this.load(limit, skip)
    }

    setSymbol = (symbol) => {
        this.setState({symbol: symbol})
    }
    setFromDate = (fromDate) => {
        this.setState({fromDate: fromDate})
    }
    setLimit = (limit) => {
        this.setState({limit: limit, skip: -limit})
    }

    render() {
        return (
            <div id="candles">
                <Filters setLimit={this.setLimit} setSymbol={this.setSymbol} setFromDate={this.setFromDate}
                         state={this.state}/>
                <CandlesTable page={(this.state.skip + this.state.limit) / this.state.limit}
                              pages={Math.ceil(this.state.total / this.state.limit)}
                              candles={this.state.candles} candlesUpdate={() => this.load(this.state.limit, this.state.skip)}
                              next={this.loadCandles} prev={this.prevCandles}
                              deleteCandle={this.api.deleteCandle} saveCandle={this.api.saveCandle}/>
            </div>
        );
    }
}

export {HistoryBotCandlesPage}

const Filters = ({state, setFromDate, setSymbol, setLimit}) => {
    return (
        <div className="form-inline">
            <div className="form-group mb-2">
                <label htmlFor="fromDate" className="mr-2">From Date</label>
                <DatePicker id="fromDate"
                            showMonthDropdown
                            showYearDropdown
                            className="form-control"
                            dateFormat="MMMM d, yyyy HH:mm"
                            selected={new Date(state.fromDate)}
                            onChange={val => setFromDate(val.toISOString())}/>
            </div>
            <div className="form-group mx-sm-3 mb-2">
                <label htmlFor="symbol" className="mr-2">Symbol</label>
                <select className="form-control" id={"symbol"} onChange={e => setSymbol(e.currentTarget.value)}
                        value={state.symbol}>
                    <option value="">All</option>
                    {state.symbols.map((s, i) => <option key={i} value={s}>{s}</option>)}
                </select>
            </div>
            <div className="form-group mx-sm-3 mb-2">
                <label htmlFor="limit" className={"mr-2"}>Limit</label>
                <select className="form-control" id={"limit"} onChange={e => setLimit(e.currentTarget.value)}
                        value={state.limit}>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
            </div>
        </div>
    );
}
