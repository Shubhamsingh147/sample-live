class UIController {
    constructor() {
        this.state = {};
        this.userInfo = {};
        this.callQuality = '';
    }

    showLoading() {
        console.log('Loading...');
    }

    showLogin() {
        console.log('Displaying login screen...');
    }

    showMain() {
        console.log('Displaying main interface...');
    }

    setState(newState) {
        this.state = { ...this.state, ...newState }; 
        console.log('State updated:', this.state);
    }

    setUserInfo(user) {
        this.userInfo = user;
        console.log('User information set:', this.userInfo);
    }

    updateUsersList(users) {
        console.log('Users list updated:', users);
    }

    showIncomingCall(callDetails) {
        console.log('Incoming call from:', callDetails);
    }

    showActiveCall(callDetails) {
        console.log('Active call with:', callDetails);
    }

    attachCallControls() {
        console.log('Call controls attached.');
    }

    startCallTimer() {
        console.log('Call timer started.');
    }

    stopCallTimer() {
        console.log('Call timer stopped.');
    }

    updateQuality(quality) {
        this.callQuality = quality;
        console.log('Call quality updated to:', quality);
    }

    endCall() {
        console.log('Ending the call.');
    }

    showNotification(message) {
        console.log('Notification:', message);
    }
}
