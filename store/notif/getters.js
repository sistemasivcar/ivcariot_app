const getters = {
    getNotifications(state) {
        return state.notifications;
    },
    getUnrededNotifications(state) {
        return state.notifications.filter(notif => notif.readed == false)
    },
    getDeviceNotifications(state) {
        return state.deviceNotifications;
    }
    
};

export default getters;