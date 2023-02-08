export default {
    setDevices(state, devices) {
        state.devices = devices;
    },
    deleteDevice(state, deviceToDel) {
        const index = state.devices.findIndex(dev => dev.dId === deviceToDel.dId );
        console.log(index);
        state.devices.splice(index, 1);
        
    },
    pushDevice(state,device) {
        state.devices.push(device)
    }
}