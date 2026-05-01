class SignalingServer {
    constructor() {
        this.onlinePeers = new Set();
        this.messages = [];
        this.pollingInterval = null;
    }

    initialize() {
        this.startPolling();
        console.log('Signaling server initialized.');
    }

    updatePresence(peerId, online) {
        if (online) {
            this.onlinePeers.add(peerId);
        } else {
            this.onlinePeers.delete(peerId);
        }
        localStorage.setItem('onlinePeers', JSON.stringify(Array.from(this.onlinePeers)));
    }

    getOnlinePeers() {
        return Array.from(this.onlinePeers);
    }

    sendCallRequest(callerId, calleeId) {
        this.storeMessage({ type: 'callRequest', callerId, calleeId });
        console.log(`Call request from ${callerId} to ${calleeId}.`);
    }

    sendCallAnswer(callerId, calleeId, accepted) {
        this.storeMessage({ type: 'callAnswer', callerId, calleeId, accepted });
        console.log(`${accepted ? 'Accepted' : 'Declined'} call from ${callerId}`);
    }

    sendIceCandidate(peerId, candidate) {
        this.storeMessage({ type: 'iceCandidate', peerId, candidate });
        console.log(`ICE candidate sent for ${peerId}.`);
    }

    storeMessage(message) {
        this.messages.push(message);
        localStorage.setItem('messages', JSON.stringify(this.messages));
    }

    getMessages() {
        return JSON.parse(localStorage.getItem('messages')) || [];
    }

    startPolling() {
        if (!this.pollingInterval) {
            this.pollingInterval = setInterval(() => {
                console.log('Polling for messages...');
            }, 5000);
        }
    }

    stopPolling() {
        clearInterval(this.pollingInterval);
        this.pollingInterval = null;
        console.log('Stopped polling.');
    }

    onMessage(callback) {
        const messages = this.getMessages();
        messages.forEach(callback);
    }

    disconnect(peerId) {
        this.updatePresence(peerId, false);
        console.log(`${peerId} disconnected.`);
    }
}

// Usage example
const signalingServer = new SignalingServer();
signalingServer.initialize();
