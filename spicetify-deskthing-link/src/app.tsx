async function main() {
  while (!Spicetify?.showNotification) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  let socket: WebSocket;
  let reconnectInterval: NodeJS.Timeout;

  function connect() {
    socket = new WebSocket('ws://localhost:8081');

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: 'register', role: 'backend' }));
      Spicetify.showNotification('Connected to WebSocket server');
      clearInterval(reconnectInterval);
      const token = Spicetify.Platform.Session.accessToken;
      socket.send(JSON.stringify({ type: 'spotify_token', token: token }));
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'request_token') {
        const newToken = Spicetify.Platform.Session.accessToken;
        socket.send(JSON.stringify({ type: 'spotify_token', token: newToken }));
        Spicetify.showNotification('Token refreshed and sent to server');
      }
    };

    socket.onclose = () => {
      Spicetify.showNotification('Disconnected from WebSocket server');
      attemptReconnect();
    };

    socket.onerror = (err) => {
      console.error('WebSocket error:', (err as ErrorEvent).message);
      attemptReconnect(); // Attempt to reconnect on error
    };
  }

  function attemptReconnect() {
    if (!reconnectInterval) {
      reconnectInterval = setInterval(() => {
        console.log('Attempting to reconnect to WebSocket server...');
        connect();
      }, 10000);
    }
  }

  // Initially connect to the WebSocket server
  connect();
}

export default main;