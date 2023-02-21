export default {

    // devices variable
    hasDevices(state) {
        return state.devices.length > 0
    },

    getDevices(state) {
        return state.devices
    },
    getSelectedDevice(state) {
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