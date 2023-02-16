const mutations = {
    setNotifications(state, notifications) {
        state.notifications = notifications;
    },
    setDeviceNotifications(state, notifications) {
        state.deviceNotifications = notifications;
    }
}

export default mutations;