const actions = {
    async fetchDevices(context) {
        try {
            const token = context.rootGetters['auth/getToken'];
            const axiosHeader = {
                headers: {
                    'x-auth-token': token
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

            const response = await this.$axios.post('/device', toSend, axiosHeader);
            if (response.data.status === 'success') {
                await context.dispatch('fetchDevices');
                return true;
            }
        } catch (e) {
            if (e.response.data.err.errors.dId.kind == 'unique') {
                throw new Error('Device aleady exists')
            } else {
                console.log(e)
                throw new Error('Falied to create device')

            }
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
                    dId: device.dId,
                }
            };

            const response = await this.$axios.delete('/device', axiosHeader);

            if (response.data.status == 'success' && response.data.data.n === 1) {
                context.commit('deleteDevice', device)
            }
        } catch (e) {
            const error = new Error('Falied to delete device')
            throw error;
        }

    },

    async updateSaverRule(context, payload) {
        try {

            const token = context.rootGetters['auth/getToken'];

            const axiosHeader = {
                headers: {
                    'x-auth-token': token
                },
            };

            const toSend = {
                status: payload.status,
                emqxRuleId: payload.emqxRuleId,
            }
            await this.$axios.put('/device/saver-rule', toSend, axiosHeader);
        } catch (e) {
            console.log(e)
            const error = new Error('Fail updating saver rule')
            throw error;
        }
    },

    async updateSelected(context, device) {
        try {
            const token = context.rootGetters['auth/getToken'];
            const toSend = {
                dId: device.dId
            };
            const axiosHeader = {
                headers: {
                    'x-auth-token': token
                }
            };

            const response = await this.$axios.put('/device', toSend, axiosHeader);
            if (response.data.status === 'success') {
                return true;
            }
        } catch (e) {
            console.log(e)
            throw new Error('Falied to load devices')

        }
}
        
};

export default actions;