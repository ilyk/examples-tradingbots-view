import * as React from "react";
import {Button, ButtonGroup, Container, Modal, Table} from "react-bootstrap";
import {time} from "../../../_helpers";
import {candle_interval} from "../../../_bots";

/*
interface Candle {
    _id: string,
    interval: Interval,
    symbol: string,
    openTime: Date,
    openPrice: number,
    maxPrice: number,
    minPrice: number,
    closePrice: number,
    tradeVolume: number,
    closeTime: Date,
}
*/
const dateTimeFormat = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";
const emptyCandle = {
    _id: "",
    interval: candle_interval.m15,
    symbol: "",
    openTime: new Date(),
    openPrice: 0.0,
    maxPrice: 0.0,
    minPrice: 0.0,
    closePrice: 0.0,
    tradeVolume: 0.0,
    tradesNumber: 0,
    closeTime: new Date(),
};
export class CandlesTable extends React.Component {
    static defaultProps = {
        candlesUpdate: () => {
        },
        deleteCandle: () => {
        },
        saveCandle: () => {
        },
        candles: [],
        next: () => {
        },
        prev: () => {
        },
        page: 0,
        pages: 0,
        manual: false,
        mark: null,
    }

    componentDidMount() {
        this.props.candlesUpdate()
    }

    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            editCandle: emptyCandle
        }
    }

    showModal(c) {
        this.setState({
            showModal: true,
            editCandle: c,
            errorMessage: ""
        })
    }

    removeCandle(c) {
        if (!window.confirm("Are you sure you want to delete this candle")) return

        this.props.deleteCandle(c)
            .catch(window.alert)
            .finally(() => this.props.candlesUpdate())
    }

    saveCandle = () => {
        this.props.saveCandle(this.state.editCandle)
            .then(() => this.setState({showModal: false, editCandle: {}}))
            .then(() => this.props.candlesUpdate())
            .catch(window.alert)
    }

    editCandle = (property, value) => {
        let candle = this.state.editCandle
        candle[property] = value
        this.setState({editCandle: candle})
    }

    addCandle = () => {
        emptyCandle.openTime = time.formatUtcFromString(Date.now(), dateTimeFormat)
        emptyCandle.closeTime = time.formatUtcFromString(Date.now()+999, dateTimeFormat)
        this.setState({
            editCandle: emptyCandle,
            showModal: true
        })
    }

    render = () => (
        <Container fluid={true}>
            <Button variant={"secondary"} onClick={() => this.addCandle()}>Add New Candle</Button>
            <Table className="table-striped table-bordered">
                <thead>
                <tr>
                    {this.props.manual || <th>Symbol</th>}
                    <th>Interval</th>
                    {this.props.manual || <th>OpenTime</th>}
                    <th>OpenPrice</th>
                    <th>MaxPrice</th>
                    <th>MinPrice</th>
                    <th>ClosePrice</th>
                    <th>TradeVolume</th>
                    {!this.props.manual || <th>TradesNumber</th>}
                    {this.props.manual || <th>CloseTime</th>}
                    <th/>
                </tr>
                </thead>
                <tbody>
                {this.props.candles.map(candle => <CandleRow
                    edit={c => this.showModal(c)}
                    delete={c => this.removeCandle(c)}
                    key={candle._id}
                    manual={this.props.manual}
                    candle={candle} mark={this.props.mark}/>)}
                </tbody>
                <tfoot>
                <tr>
                    <td colSpan="9">
                        <ButtonGroup size={"lg"}>
                            <Button variant={"secondary"} onClick={() => this.props.prev()}>Prev</Button>
                            <Button variant={"secondary"} disabled>Page #{this.props.page} / {this.props.pages}</Button>
                            <Button variant={"secondary"} onClick={() => this.props.next()}>Next</Button>
                        </ButtonGroup>
                    </td>
                </tr>
                </tfoot>
            </Table>
            <CandleEdit show={this.state.showModal} candle={this.state.editCandle} edit={this.editCandle}
                        hide={() => this.setState({showModal: false})}
                        save={this.saveCandle} manual={this.props.manual}/>
        </Container>
    );
}

class CandleRow extends React.PureComponent {
    props: {
        candle: null,
        more: () => {},
        edit: () => {},
        delete: () => {},
        manual: false,
        mark: null,
    }
    render = () =>
        <tr className={this.props.candle?._id === this.props.mark?._id ? "bg-info" : ""}>
            {this.props.manual || <td>{this.props.candle.symbol}</td>}
            <td>{this.props.candle.interval}</td>
            {this.props.manual || <td>{this.props.candle.openTime}</td>}
            <td>{this.props.candle.openPrice}</td>
            <td>{this.props.candle.maxPrice}</td>
            <td>{this.props.candle.minPrice}</td>
            <td>{this.props.candle.closePrice}</td>
            <td>{this.props.candle.tradeVolume}</td>
            {!this.props.manual || <td>{this.props.candle.tradesNumber}</td>}
            {this.props.manual || <td>{this.props.candle.closeTime}</td>}
            <td><ButtonGroup size="sm">
                <Button onClick={() => this.props.edit(this.props.candle)} variant="primary">Edit</Button>
                <Button onClick={() => this.props.delete(this.props.candle)} variant="danger">Delete</Button>
            </ButtonGroup></td>
        </tr>
}

const calcEndTime = (interval, openTime, edit) => {
    let utcDateFormat = dateTimeFormat.split("'Z'").join('X');
    let openDateTime = time.parseString(openTime, utcDateFormat)
    let duration = Math.trunc(time.StringToDuration(interval) / time.Millisecond)
    let closeTimeStamp = openDateTime.getTime() + duration - 1
    let closeTime = time.formatUtcFromString(closeTimeStamp, dateTimeFormat).split('.000Z').join('.999Z')

    edit('interval', interval)
    edit('openTime', openTime)
    edit('closeTime', closeTime)
}
const CandleEdit = ({show, hide, candle, edit, save, manual}) => <Modal show={show} size="lg" onHide={hide}>
    <Modal.Header closeButton>
        {candle._id && <Modal.Title>Edit Candle: {candle.openTime}</Modal.Title>}
        {!candle._id && <Modal.Title>Create New Candle</Modal.Title>}
    </Modal.Header>
    <Modal.Body>
        <div className="row">
            {manual || <div className="col-sm-12 col-md-6">
                <label htmlFor="candle_symbol" className={"col-sm-12 col-form-label"}>
                    <b>Symbol</b>
                </label>
                <div className="row">
                    <input type="text" onChange={e => edit("symbol", e.currentTarget.value)} className="form-control"
                           name="candle_symbol" id="candle_symbol" value={candle.symbol}/>
                </div>
            </div>}
            <div className="col-sm-12 col-md-6">
                <label htmlFor="candle_interval" className={"col-sm-12 col-form-label"}>
                    <b>Interval</b>
                </label>
                <div className="row">
                    <select onChange={e => calcEndTime(e.currentTarget.value, candle.openTime, edit)} className="form-control"
                           name="candle_interval" id="candle_interval" value={candle.interval}>
                        <option value="1m">1m</option>
                        <option value="3m">3m</option>
                        <option value="5m">5m</option>
                        <option value="15m">15m</option>
                        <option value="30m">30m</option>
                        <option value="1h">1h</option>
                        <option value="2h">2h</option>
                        <option value="4h">4h</option>
                        <option value="6h">6h</option>
                        <option value="8h">8h</option>
                        <option value="12h">12h</option>
                        <option value="1d">1d</option>
                        <option value="3d">3d</option>
                        <option value="1w">1w</option>
                        <option value="1M">1M</option>
                    </select>
                </div>
            </div>
            {manual || <div className="col-sm-12 col-md-6">
                <label htmlFor="candle_open_time" className={"col-sm-12 col-form-label"}>
                    <b>Open Time</b>
                </label>
                <div className="row">
                    <input type="text" onChange={e => calcEndTime(candle.interval, e.currentTarget.value, edit)}
                           className="form-control"
                           name="candle_open_time" id="candle_open_time" value={candle.openTime}/>
                </div>
            </div>}
            <div className="col-sm-12 col-md-6">
                <label htmlFor="candle_open_price" className={"col-sm-12 col-form-label"}>
                    <b>Open Price</b>
                </label>
                <div className="row">
                    <input type="number" onChange={e => edit("openPrice", e.currentTarget.value)} min="0.00000001"
                           step="0.00000001" className="form-control" name="candle_open_price" id="candle_open_price"
                           value={candle.openPrice}/>
                </div>
            </div>
            <div className="col-sm-12 col-md-6">
                <label htmlFor="candle_max_price" className={"col-sm-12 col-form-label"}>
                    <b>Max Price</b>
                </label>
                <div className="row">
                    <input type="number" onChange={e => edit("maxPrice", e.currentTarget.value)} min="0.00000001"
                           step="0.00000001" className="form-control" name="candle_max_price" id="candle_max_price"
                           value={candle.maxPrice}/>
                </div>
            </div>
            <div className="col-sm-12 col-md-6">
                <label htmlFor="candle_min_price" className={"col-sm-12 col-form-label"}>
                    <b>Min Price</b>
                </label>
                <div className="row">
                    <input type="number" onChange={e => edit("minPrice", e.currentTarget.value)} min="0.00000001"
                           step="0.00000001" className="form-control" name="candle_min_price" id="candle_min_price"
                           value={candle.minPrice}/>
                </div>
            </div>
            <div className="col-sm-12 col-md-6">
                <label htmlFor="candle_close_price" className={"col-sm-12 col-form-label"}>
                    <b>Close Price</b>
                </label>
                <div className="row">
                    <input type="number" onChange={e => edit("closePrice", e.currentTarget.value)} min="0.00000001"
                           step="0.00000001" className="form-control" name="candle_close_price" id="candle_close_price"
                           value={candle.closePrice}/>
                </div>
            </div>
            <div className="col-sm-12 col-md-6">
                <label htmlFor="candle_trade_volume" className={"col-sm-12 col-form-label"}>
                    <b>Trade Volume</b>
                </label>
                <div className="row">
                    <input type="number" onChange={e => edit("tradeVolume", e.currentTarget.value)} min="0.00000001"
                           step="0.00000001" className="form-control" name="candle_trade_volume"
                           id="candle_trade_volume" value={candle.tradeVolume}/>
                </div>
            </div>
            {!manual || <div className="col-sm-12 col-md-6">
                <label htmlFor="candle_trades_number" className={"col-sm-12 col-form-label"}>
                    <b>Trades Number</b>
                </label>
                <div className="row">
                    <input type="number" onChange={e => edit("tradesNumber", e.currentTarget.value)} min="1"
                           step="1" className="form-control" name="candle_trades_number"
                           id="candle_trades_number" value={candle.tradesNumber}/>
                </div>
            </div>}
            {manual || <div className="col-sm-12 col-md-6">
                <label htmlFor="candle_close_time" className={"col-sm-12 col-form-label"}>
                    <b>Close Time</b>
                </label>
                <div className="row">
                    <input type="text" onChange={e => edit("closeTime", e.currentTarget.value)} className="form-control"
                           readOnly name="candle_close_time" id="candle_close_time" value={candle.closeTime}/>
                </div>
            </div>}
        </div>
    </Modal.Body>
    <Modal.Footer>
        <Button onClick={save} variant="success">Save</Button>
        <Button onClick={hide} variant="secondary">Close</Button>
    </Modal.Footer>
</Modal>
