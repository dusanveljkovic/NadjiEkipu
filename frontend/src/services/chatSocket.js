class ChatSocket {
  constructor() {
    this.ws = null;
    this.listeners = {};
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
  }

  connect(chatId, token) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.disconnect();
    }

    const API_URL = 'http://localhost:8000';
    // Convert http to ws and remove /api from path
    const wsUrl = API_URL.replace('http', 'ws').replace('/api', '');

    // Django Channels WebSocket URL
    const wsPath = `${wsUrl}/ws/chat/${chatId}/?token=${token}`;

    console.log('Connecting to WebSocket:', wsPath);

    this.ws = new WebSocket(wsPath);

    this.ws.onopen = () => {
      console.log(`Connected to chat ${chatId}`);
      this.reconnectAttempts = 0;
      this.emit('connected', { chatId });
    };

    this.ws.onclose = (event) => {
      console.log(`Disconnected from chat ${chatId}`, event);
      this.emit('disconnected', { chatId, code: event.code });

      // Attempt to reconnect if not closed intentionally
      if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        setTimeout(() => {
          console.log(`Reconnecting attempt ${this.reconnectAttempts}...`);
          this.connect(chatId, token);
        }, this.reconnectDelay * this.reconnectAttempts);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.emit('error', error);
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Received message:', data);

        if (data.type === 'history') {
          this.emit('history', data);
        } else if (data.type === 'message') {
          this.emit('message', data);
        } else if (data.type === 'typing') {
          this.emit('typing', data);
        } else {
          this.emit('message', data);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    return this.ws;
  }

  disconnect() {
    if (this.ws) {
      // Send close frame
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.close(1000, 'Normal closure');
      }
      this.ws = null;
    }
    this.listeners = {};
  }

  sendMessage(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const data = {
        type: 'message',
        message: message
      };
      console.log('sent message: ' + data.message)
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  sendTyping(isTyping) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const data = {
        type: 'typing',
        is_typing: isTyping
      };
      this.ws.send(JSON.stringify(data));
    }
  }

  on(event, callback) {
    this.listeners[event] = callback;
  }

  off(event, callback) {
    this.listeners[event] = []
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event](data);
    }
  }

  get isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  }
}

// Create singleton instance
const chatSocket = new ChatSocket();
export default chatSocket;
