const actions = {
    async fetchDevices(context) {
        try {
            const token = context.rootGetters['auth/getToken'];
            const axiosHeader = {
                headers: {
                    'x-auth-token':token
                }
            };

            const response = await this.$axios.get('/device', axiosHeader);
            if (response.data.status == 'success') {

                const devices = response.data.data;
                context.commit('setDevices', devices);
            }
        } catch (e) {
            const error = new Error('Falied to load devices')
            throw error;
        }
    },

    async newDevice(context, device) {
        try {
            const token = context.rootGetters['auth/getToken'];
            const toSend = {
                newDevice: device
            };
            const axiosHeader = {
                headers: {
                    'x-auth-token': token
                }
            };

            const response = await this.$axios.post('/device', toSend,axiosHeader);
            if (response.data.status == 'success') {

                const newDevice = response.data.data;
                context.commit('pushDevice', newDevice);
            }
        } catch (e) {
            const error = new Error('Falied to create device')
            throw error;
        }
    },

    async deleteDevice(context, device) {
        try {
            const token = context.rootGetters['auth/getToken'];

            const axiosHeader = {
                headers: {
                    'x-auth-token': token
                },
                params: {
                    dId:device.dId
                }
            };

            const response = await this.$axios.delete('/device', axiosHeader);
            
            if (response.data.status == 'success' && response.data.data.n === 1) {
                context.commit('deleteDevice', device)
            }
        }catch (e) {
            const error = new Error('Falied to delete device')
            throw error;
        }
        
    }
        
};

export default actions;