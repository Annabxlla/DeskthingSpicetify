import WebSocket from 'ws';

class WebSocketServer {
    private wss: WebSocket.Server;
    private frontEndWs: WebSocket | null = null;
    private backEndWs: WebSocket | null = null;
    private access_token: string | null = null;

    constructor(port: number) {
        this.wss = new WebSocket.Server({ port });
        this.wss.on('connection', this.onConnection.bind(this));
        console.log(`WebSocket server started on port ${port}`);
    }

    private onConnection(ws: WebSocket): void {
        console.log('Client connected');
        ws.on('message', (message: string) => this.onMessage(message, ws));
        ws.on('close', () => this.onClose(ws));
    }

    private onMessage(message: string, ws: WebSocket): void {
        const parsedMessage = JSON.parse(message);
        console.log(`Received message: ${message}`);

        if (parsedMessage.type === 'spotify_token') {
            this.access_token = parsedMessage.token;
        } else if (parsedMessage.type === 'register') {
            if (parsedMessage.role === 'frontend') {
                this.frontEndWs = ws;
                if (this.access_token){
                    this.frontEndWs.send(JSON.stringify({ type: 'spotify_token', token: this.access_token }));
                }
                console.log('Frontend registered');
            } else if (parsedMessage.role === 'backend') {
                this.backEndWs = ws;
                console.log('Backend registered');
            }
        } else if (parsedMessage.type === 'request_token') {
            this.requestToken();
        }
    }

    private requestToken(): void {
        if (this.backEndWs) {
            this.backEndWs.send(JSON.stringify({ type: 'request_token' }));
        }
    }

    private onClose(ws: WebSocket): void {
        console.log('Client disconnected');
        if (this.frontEndWs === ws) {
            this.frontEndWs = null;
            console.log('Frontend disconnected');
        } else if (this.backEndWs === ws) {
            this.backEndWs = null;
            console.log('Backend disconnected');
        }
    }

    private testToken(token: string, ws: WebSocket): void {
        const uri = "https://api.spotify.com/v1/me/player/pause";
        fetch(uri, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
    }
}

new WebSocketServer(8081);
