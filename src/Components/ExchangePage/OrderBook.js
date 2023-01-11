import React, {useState} from "react";
import {Container, Table} from "react-bootstrap";
import {handleError, Project} from "../../_helpers";
import {Api} from "../../_api";
import {Exchange} from "../../_services";
import {useParams} from "react-router";

export const OrderBook = () => {
    let {exchange, account} = useParams();

    const [loading, setLoading] = useState(true);
    const [projId, setProjId] = useState("");
    const [quote, setQuote] = useState("");
    const [orderBook, setOrderBook] = useState([])
    const [quotes, setQuotes] = useState([])
    const api = Api.forExchangeAccount(exchange, account)
    const loadOrders = () => {
        setLoading(true)
        api.orderBook(quote)
            .then(setOrderBook)
            .catch(handleError(this))
            .then(() => setLoading(false))
    }

    Project.subscribeCurrentId(proj => {
        if (proj.id !== projId) {
            setProjId(proj.id)
            //setBase(proj.base_currency)
            api.quotes(proj.base_currency).then(setQuotes).then(() => setLoading(false))
        }
    })

    return (
        <Container fluid>
            <h1>{Exchange.of(exchange).name()} Order Book</h1>
            <div className={`form-group row col-lg-6 col-sm-12`}>
                <label htmlFor="QuoteCurrency" className={"col-sm-12 col-form-label"}>
                    <b>Quote Currency</b>
                </label>
                <div className="row col-sm-12">
                    <div className="col-sm-8">
                        <select name="QuoteCurrency" id="QuoteCurrency" className={"form-control"} onChange={e => {
                            setQuote(e.target.value)
                        }} disabled={loading}>
                            <option value="" disabled={true} selected>[Please select]</option>
                            {quotes.map(v => (
                                <option key={v} value={v}>{v}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-sm-4">
                        <button className="btn btn-primary" onClick={loadOrders} disabled={loading}>Load</button>
                    </div>
                </div>
            </div>
            <div className={`row`}>
                <div className={`col-sm-6`}>
                    <Table className="table table-borderless table-danger table-striped table-sm">
                        <thead>
                        <tr>
                            <th>Account</th>
                            <th>Bot</th>
                            <th>Price</th>
                            <th>Amount</th>
                        </tr>
                        </thead>
                        <tbody>
                        {(orderBook.Asks || []).map((ask, idx) =>
                            <tr key={idx} className={ask.Bot !== "" ? "font-weight-bold" : ""}>
                                <td>{ask.Account}</td>
                                <td>{ask.Bot}</td>
                                <td>{ask.Price}</td>
                                <td>{ask.Quantity}</td>
                            </tr>)}
                        </tbody>
                    </Table>
                </div>
                <div className={`col-sm-6`}>
                    <Table className="table table-borderless table-success table-striped table-sm">
                        <thead>
                        <tr>
                            <th>Account</th>
                            <th>Bot</th>
                            <th>Price</th>
                            <th>Amount</th>
                        </tr>
                        </thead>
                        <tbody>
                        {(orderBook.Bids || []).map((bid, idx) =>
                            <tr key={idx} className={bid.Bot !== "" ? "font-weight-bold" : ""}>
                                <td>{bid.Account}</td>
                                <td>{bid.Bot}</td>
                                <td>{bid.Price}</td>
                                <td>{bid.Quantity}</td>
                            </tr>)}
                        </tbody>
                    </Table>
                </div>
            </div>
        </Container>
    );
}