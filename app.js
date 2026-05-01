/**
 * Main Application - Orchestrates all components
 */
class CareConnectApp {
    constructor() {
        this.ui = new UIController();
        this.webrtc = new WebRTCHandler();
        this.signaling = new SignalingServer();
        this.currentPeerId = null;
        this.userId = this.generateUserId();
    }

    generateUserId() {
        return 'user_' + Math.random().toString(36).substr(2, 9);
    }

    async initialize() {
        this.ui.showLoading();
        
        // Initialize microphone
        const hasAudio = await this.webrtc.initializeLocalStream();
        if (!hasAudio) {
            this.ui.showLogin();
            this.ui.showNotification('Microphone access required for calling', 'warning');
            return;
        }
        
        this.ui.showLogin();
        this.attachLoginHandler();
    }

    attachLoginHandler() {
        this.ui.onLogin = (role, name) => {
            this.startSession(role, name);
        };
    }

    startSession(role, name) {
        this.currentUser = { role, name };
        this.ui.setUserInfo(name, role);
        this.ui.showMain();
        
        // Initialize signaling
        this.signaling.initialize(
            this.userId,
            name,
            role,
            () => this.updateUsersList()
        );
        
        // Setup message handlers
        this.signaling.onMessage('call-request', (msg) => this.handleCallRequest(msg));
        this.signaling.onMessage('call-answer', (msg) => this.handleCallAnswer(msg));
        this.signaling.onMessage('ice-candidate', (msg) => this.handleIceCandidate(msg));
        
        // Update users list
        this.updateUsersList();
        
        // Attach UI handlers
        this.ui.onUserSelected = (user) => this.initiateCall(user);
        this.ui.onAcceptCall = () => this.acceptIncomingCall();
        this.ui.onRejectCall = () => this.rejectIncomingCall();
        this.ui.onEndCall = () => this.endCall();
        this.ui.onToggleMic = () => this.webrtc.toggleMicrophone();
        this.ui.onToggleVolume = () => this.webrtc.toggleRemoteAudio();
        this.ui.onLogout = () => this.logout();
    }

    updateUsersList() {
        const peers = this.signaling.getOnlinePeers();
        this.ui.updateUsersList(peers);
    }

    async initiateCall(targetUser) {
        this.currentPeerId = targetUser.id;
        this.webrtc.createPeerConnection(
            (candidate) => this.signaling.sendIceCandidate(targetUser.id, candidate),
            (state) => this.onConnectionStateChange(state)
        );
        
        const offer = await this.webrtc.createOffer();
        this.signaling.sendCallRequest(targetUser.id, offer);
        
        this.ui.showNotification('Calling ' + targetUser.name + '...', 'info');
    }

    async handleCallRequest(msg) {
        this.currentPeerId = msg.from;
        this.incomingOffer = msg.offer;
        this.ui.showIncomingCall(msg.fromName);
    }

    async acceptIncomingCall() {
        this.webrtc.createPeerConnection(
            (candidate) => this.signaling.sendIceCandidate(this.currentPeerId, candidate),
            (state) => this.onConnectionStateChange(state)
        );
        
        await this.webrtc.handleOffer(this.incomingOffer);
        const answer = await this.webrtc.createAnswer();
        this.signaling.sendCallAnswer(this.currentPeerId, answer);
        
        const peers = this.signaling.getOnlinePeers();
        const caller = peers.find(p => p.id === this.currentPeerId);
        this.ui.showActiveCall(caller?.name || 'Caller');
        this.webrtc.startStatsMonitoring((stats) => this.ui.updateQuality(stats.quality, stats.state));
    }

    rejectIncomingCall() {
        this.currentPeerId = null;
        this.ui.endCall();
        this.ui.showNotification('Call rejected', 'info');
    }

    async handleCallAnswer(msg) {
        await this.webrtc.handleAnswer(msg.answer);
        
        const peers = this.signaling.getOnlinePeers();
        const answerer = peers.find(p => p.id === msg.from);
        this.ui.showActiveCall(answerer?.name || 'Caller');
        this.webrtc.startStatsMonitoring((stats) => this.ui.updateQuality(stats.quality, stats.state));
    }

    async handleIceCandidate(msg) {
        await this.webrtc.addIceCandidate(msg.candidate);
    }

    onConnectionStateChange(state) {
        if (state === 'disconnected' || state === 'failed' || state === 'closed') {
            this.endCall();
        }
    }

    endCall() {
        this.webrtc.close();
        this.currentPeerId = null;
        this.ui.endCall();
    }

    logout() {
        this.signaling.disconnect();
        this.webrtc.cleanup();
        this.ui.showLogin();
        this.attachLoginHandler();
    }
}

// Initialize app when page loads
window.addEventListener('DOMContentLoaded', () => {
    window.app = new CareConnectApp();
    window.app.initialize();
});