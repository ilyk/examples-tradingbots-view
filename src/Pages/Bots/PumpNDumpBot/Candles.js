import * as React from "react";
import {useState} from "react";
import {CandlesTable} from "../HistoryBot/CandlesTable";
import {Button} from "react-bootstrap";
import MaterialIcon from "material-icons-react";
import {Status} from "../../../_services";
import withObservableStream from "../../../_helpers/withObservableStream";

const Candles = ({api, exchange, account, ...props}) => {
    const [skip, setSkip] = useState(-5)
    const [limit, setLimit] = useState(5)
    const [total, setTotal] = useState(0)
    const [candles, setCandles] = useState([])

    const loadCandles = () => {
        setSkip(skip + limit)
        load()
    }
    const prevCandles = () => {
        setSkip(skip - limit)
        load()
    }
    const load = () => {
        debugger
        let _skip = skip
        if (skip < 0) {
            setSkip(0)
            _skip = 0
        }

        setCandles([])
        api.candles(_skip, limit)
            .then(response => {
                setCandles(response.data || [])
                setSkip(response.skip)
                setLimit(response.limit)
                setTotal(response.total)
            })
    }
    const botState = props[exchange]?.accounts[account]['pump-n-dump']

    return <div>
        <Button size={"sm"} variant={"info"}
                onClick={api.skipCandle} title="Skip Current Candle"
                style={{display: "flex"}}>
            <MaterialIcon icon={"skip_next"}/> Skip Current Candle
        </Button>
        <hr/>
        <CandlesTable page={(skip + limit) / limit}
                      pages={Math.ceil(total / limit)}
                      candles={candles}
                      candlesUpdate={load} mark={botState?.candle}
                      next={loadCandles} prev={prevCandles}
                      deleteCandle={api.deleteCandle} saveCandle={api.saveCandle} manual={true}/>
    </div>;
}

export default withObservableStream(Status.exchanges, {}, {})(Candles);
