class UIController {
    constructor() {
        this.userInfo = null;
        this.usersList = [];
        this.callTimer = null;
    }

    showLoading() {
        console.log('Loading...');
    }

    showLogin() {
        console.log('Showing login screen...');
    }

    showMain() {
        console.log('Showing main interface...');
    }

    setUserInfo(userInfo) {
        this.userInfo = userInfo;
        console.log('User info set:', userInfo);
    }

    updateUsersList(users) {
        this.usersList = users;
        console.log('Users list updated:', users);
    }

    showIncomingCall(callData) {
        console.log('Incoming call from:', callData);
    }

    showActiveCall(callData) {
        console.log('Active call with:', callData);
    }

    startCallTimer() {
        this.callTimer = setInterval(() => {
            console.log('Call timer running...');
        }, 1000);
    }

    stopCallTimer() {
        clearInterval(this.callTimer);
        console.log('Call timer stopped.');
    }

    updateQuality(quality) {
        console.log('Call quality updated:', quality);
    }

    endCall() {
        console.log('Ending call...');
    }

    showNotification(message) {
        console.log('Notification:', message);
    }

    attachLoginHandlers() {
        console.log('Login handlers attached.');
    }

    attachCallControls() {
        console.log('Call controls attached.');
    }
}

// Example usage (to be removed in actual implementation):
const uiController = new UIController();
uiController.showLoading();
