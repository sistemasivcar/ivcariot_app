export default {
    hasDevices(state) {
        return state.devices.length > 0
    },

    getDevices(state) {
        return state.devices
    },
    getSelectedDevice(state) {
        const dev = state.devices.find((device) => { return device.selected == true })
        return dev;
    },
    getIndexSelectedDevice(state,getters) {
        const dev = getters.getSelectedDevice;
        const index = state.devices.indexOf(dev)
        return index;
    }
}