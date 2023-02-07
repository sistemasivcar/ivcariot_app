export default {
    hasDevices(state) {
        return state.devices.length > 0
    },

    getDevices(state) {
        return state.devices
    }
}