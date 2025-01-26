import { DeskThing } from 'deskthing-server';
import WebSocket from 'ws';
/**
 *  /-------------------------------------------------------------\
 * |                                                               |
 * |                      WebSocket Client                         |
 * |                                                               |
 *  \-------------------------------------------------------------/
 */

class WebSocketClient {
    private ws: WebSocket;
    private token: string | null = null;
    private url: string;
    private reconnectInterval: number = 5000;
    private reconnectTimeout: NodeJS.Timeout | null = null;

    constructor(url: string) {
        this.url = url;
        this.ws = new WebSocket(url);
        this.initialize();
    }

    private initialize() {
        this.ws.on('open', this.onOpen.bind(this));
        this.ws.on('message', this.onMessage.bind(this));
        this.ws.on('close', this.onClose.bind(this));
        this.ws.on('error', this.onError.bind(this));
        DeskThing.sendLog('WebSocket client started');
    }

    private onOpen() {
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }
        this.ws.send(JSON.stringify({ type: 'register', role: 'frontend' }));
    }

    private onMessage(message: string) {
        const parsedMessage = JSON.parse(message);
        DeskThing.sendLog(`Received message: ${message}`);

        if (parsedMessage.type === 'spotify_token') {
            this.token = parsedMessage.token;
            DeskThing.sendLog(`Received token: ${this.token}`);
        }
    }

    private onClose() {
        DeskThing.sendLog('Connection closed');
        this.reconnect();
    }

    private onError(error: Error) {
        DeskThing.sendError(`WebSocket error: ${error}`);
    }

    private reconnect() {
        if (!this.reconnectTimeout) {
            this.reconnectTimeout = setTimeout(() => {
                DeskThing.sendLog('Attempting to reconnect...');
                this.ws = new WebSocket(this.url);
                this.initialize();
            }, this.reconnectInterval);
        }
    }

    public requestToken() {
        this.ws.send(JSON.stringify({ type: 'request_token' }));
    }

    public getToken(): string | null {
        return this.token;
    }
}

export default WebSocketClient;