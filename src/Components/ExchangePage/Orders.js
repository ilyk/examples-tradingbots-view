import React, {useState} from "react";
import {Button, Container, Modal, Table} from "react-bootstrap";
import {handleError} from "../../_helpers";
import {Api} from "../../_api";

export const Orders = ({exchange, account, currency, getId, getPrice, getAmount, isAsk, getQuoteCurrency}) => {
    const [orders, setOrders] = useState([])
    const api = Api.forExchangeAccount(exchange, account)
    const loadOrders = () => {
        api.orders()
            .then(setOrders)
            .catch(handleError(this))
    }
    const cancelOrder = (idx) => {
        if (!window.confirm("Are you sure you want to cancel this order?")) {
            return
        }
        const order = orders[idx]

        const [id, price, amount, ask, quoteCurrency] =
            [getId(order), getPrice(order), getAmount(order), isAsk(order), getQuoteCurrency(order)]
        api.cancelOrder({id, currency, price, amount, ask, quoteCurrency})
            .then(() => {
                setOrders(orders => {
                    orders.splice(idx, 1)
                    return orders
                })
            }).catch(handleError(this))

    }
    const [showCreateOrder, setShowCreateOrder] = useState(false);
    const [creatingOrder, setCreatingOrder] = useState(false);
    const [manualOrderQuoteCurrency, setManualOrderQuoteCurrency] = useState("");
    const [manualOrderIsAsk, setManualOrderIsAsk] = useState(true);
    const [manualOrderPrice, setManualOrderPrice] = useState(0.0);
    const [manualOrderAmount, setManualOrderAmount] = useState(0.0);
    const [quoteCurrencies, setQuoteCurrencies] = useState([]);
    const handleCloseNewOrder = () => setShowCreateOrder(false);
    const handleShowNewOrder = () => {
        loadQuotes();
        setShowCreateOrder(true);
    }
    const createOrder = () => {
        setCreatingOrder(true)
        api.createOrder(manualOrderPrice, manualOrderAmount, manualOrderIsAsk, manualOrderQuoteCurrency)
            .then(() => {
                alert("Order created!")
                handleCloseNewOrder()
            })
            .catch(handleError({
                setState: (o) => {
                    alert(o.errorMessage)
                }
            }))
            .finally(() => setCreatingOrder(false))
    }
    const loadQuotes = () => api.quotes("-").then(q => setQuoteCurrencies(q))

    return (
        <Container fluid>
            <Table title={"Orders"}>
                <thead>
                <tr>
                    {orders.length === 0 || Object.keys(orders[0]).map(key => <th key={key}>{key}</th>)}
                    <th/>
                </tr>
                </thead>
                <tbody>
                {orders.map((order, idx) => (
                    <tr key={idx}>
                        {Object.keys(order).map(key => <td key={key}>{order[key]}</td>)}
                        <td><Button size={"sm"} variant={"danger"} onClick={() => cancelOrder(idx)}>Cancel</Button></td>
                    </tr>
                ))}
                </tbody>
            </Table>
            <div className="text-center">
                <Button variant="primary" size={"lg"} onClick={handleShowNewOrder}>
                    New Limit Order
                </Button>
                <Button variant={"info"} size={"lg"} onClick={loadOrders}>Get Orders</Button>
            </div>
            <Modal show={showCreateOrder} onHide={handleCloseNewOrder}>
                <Modal.Header closeButton>
                    <Modal.Title>New Limit Order</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className={`horizontal-form`}>
                        <div className={"row"}>
                            <div className={`form-group row col-lg-6 col-sm-12`}>
                                <label htmlFor="price"
                                       className={"col-sm-12 col-form-label"}>
                                    <b>Price</b>
                                </label>
                                <div className="col-sm-12">
                                    <input type={"number"} name="price" id="price" className={"form-control"}
                                           onChange={e => setManualOrderPrice(e.currentTarget.value)}
                                           value={manualOrderPrice}
                                           disabled={creatingOrder} min={0.0001} step={0.0001}/>
                                </div>
                            </div>
                            <div className={`form-group row col-lg-6 col-sm-12`}>
                                <label htmlFor="amount"
                                       className={"col-sm-12 col-form-label"}>
                                    <b>Amount</b>
                                </label>
                                <div className="col-sm-12">
                                    <input type={"number"} name="amount" id="amount" className={"form-control"}
                                           onChange={e => setManualOrderAmount(e.currentTarget.value)}
                                           value={manualOrderAmount}
                                           disabled={creatingOrder} min={0.0001} step={0.0001}/>
                                </div>
                            </div>
                            <div className={`form-group row col-lg-6 col-sm-12`}>
                                <label htmlFor="side"
                                       className={"col-sm-12 col-form-label"}>
                                    <b>Side</b>
                                </label>
                                <div className="col-sm-12">
                                    <select name="side" id="side" className="form-control" defaultValue={manualOrderIsAsk}
                                            onChange={e => setManualOrderIsAsk(e.currentTarget.value === "ask")}>
                                        <option value="ask">Ask</option>
                                        <option value="bid">Bid</option>
                                    </select>
                                </div>
                            </div>
                            <div className={`form-group row col-lg-6 col-sm-12`}>
                                <label htmlFor="qcurr"
                                       className={"col-sm-12 col-form-label"}>
                                    <b>Quote Currency</b>
                                </label>
                                <div className="col-sm-12">
                                    <select name="qcurr" id="qcurr" className="form-control" defaultValue={manualOrderQuoteCurrency}
                                            onChange={e => setManualOrderQuoteCurrency(e.currentTarget.value)}>
                                        <option disabled value="">Please select</option>
                                        {quoteCurrencies.map((qc, i) => <option key={i} value={qc}>{qc}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" disabled={creatingOrder} onClick={handleCloseNewOrder}>Close</Button>
                    <Button variant="primary" disabled={creatingOrder} onClick={createOrder}>Create</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}