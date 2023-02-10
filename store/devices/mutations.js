export default {
    setDevices(state, devices) {
        state.devices = devices;
    },
    deleteDevice(state, deviceToDel) {
        const index = state.devices.findIndex(dev => dev.dId === deviceToDel.dId );
        console.log(index);
        state.devices.splice(index, 1);
        
    },
    setSelectedDevice(state) {
        const dev = state.devices.find((device) => { return device.selected == true })
       if (dev) {
        state.selectedDevice = dev;
       }
  
    }

}