export default {
    setDevices(state, devices) {
        state.devices = devices;
    },
    deleteDevice(state, deviceToDel) {
        const index = state.devices.findIndex(dev => dev.dId === deviceToDel.dId );
        state.devices.splice(index, 1);
    },
    setSelectedDevice(state, device) {
        state.selectedDevice = device;
    },
    setStatus(state, payload){

        const device = state.devices.find(d => d.dId = payload.dId);
        device.status=payload.status;
    }


}