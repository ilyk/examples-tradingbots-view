export function WebSocketClient() {
    this.number = 0;	// Message number
    this.autoReconnectInterval = 5 * 1000;	// ms
    this.opened = false;
    this.url = ""
}

WebSocketClient.prototype.open = function (url) {
    this.url = url;
    if (this.instance && this.instance.readyState !== WebSocket.CLOSED) {
        this.instance.close(3665, "re-open websocket")
    }

    this.instance = new WebSocket(this.url);
    this.instance.onopen = (e) => {
        this.opened = true
        this.onopen(e)
    }

    this.instance.onmessage = (data, flags) => {
        this.number++;
        this.onmessage(data, flags, this.number);
    }

    this.instance.onclose = (e) => {
        this.opened = false
        switch (e.code) {
            case 1000:	// CLOSE_NORMAL
                console.log("WebSocket: closed. Code 1000.");
                break;
            case 1006: // CLOSE_ABNORMAL
                console.log("WebSocket: closed abnormally");
                this.reconnect(e)
                break;
            case 3666: // switch url.
                console.log(`switching url to: ${this.url}`)
                this.open(this.url)
                break;
            case 3665: // no reconnect
                console.log(`closing. reason: ${e.reason}`)
                break;
            default: // Abnormal closure
                console.log(`WebSocket: closed. Code: ${e.code}.`);
                this.reconnect(e)
                break;
        }
        this.onclose(e);
    }

    this.instance.onerror = (e) => {
        switch (e.code) {
            case 'ECONNREFUSED':
                this.reconnect(e);
                break;
            default:
                this.onerror(e);
                break;
        }
    }
}
WebSocketClient.prototype.send = function (data, option) {
    //console.log("WebSocketClient: Sending message: ", data)
    try {
        this.instance.send(data, option);
    } catch (e) {
        this.instance.onerror('error', e);
    }
}
WebSocketClient.prototype.close = function (code: number, data: string) {
    try {
        this.instance.close(code, data)
    } catch (e) {
        this.instance.onerror('error', e);
    }
}
WebSocketClient.prototype.reconnect = function (e) {
    if (this.opened) {return}
    console.log(`WebSocketClient: retry in ${this.autoReconnectInterval}ms`, e);
    setTimeout(()=> {
        console.log("WebSocketClient: reconnecting...", this.url);
        this.open(this.url);
    }, this.autoReconnectInterval);
}
WebSocketClient.prototype.onopen = function (e) {
    console.log("WebSocketClient: open", arguments);
}
WebSocketClient.prototype.onmessage = function (data, flags, number) {
    console.log("WebSocketClient: message", arguments);
}
WebSocketClient.prototype.onerror = function (e) {
    console.log("WebSocketClient: error", arguments);
}
WebSocketClient.prototype.onclose = function (e) {
    this.opened = false
    console.log("WebSocketClient: closed", arguments);
}
