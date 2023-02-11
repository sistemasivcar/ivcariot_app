export default {

    // devices variable
    hasDevices(state) {
        return state.devices.length > 0
    },

    getDevices(state) {
        return state.devices
    },

    // selectedDevice variable
    getSelectedDevice(state) {
        const dev = state.devices.find((device) => { return device.selected == true })
        return dev;
    },
    getIndexSelectedDevice(state,getters) {
        const dev = getters.getSelectedDevice;
        const index = state.devices.indexOf(dev)
        return index;
    },
    getSelDevice(state) {
        return state.selectedDevice;
    },
    getWidgetsSelectedDevice(state) {
        return state.selectedDevice.templateId.widgets;
    },

    getAlarmRulesSelectedDevice(state) {
        return state.selectedDevice.alarmRules;
    },
    hasAlarmRules(state) {
        try {
            return state.selectedDevice.alarmRules.length>0;
        } catch (e) {
            console.log(e)
        }
    },
}