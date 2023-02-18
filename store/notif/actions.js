const actions = {
    async fetchNotifications(context, numberPage) {
        try {
            const token = context.rootGetters['auth/getToken'];
            const axiosHeader = {
                headers: {
                    'x-auth-token': token
                },
                params: {
                    numberPage: numberPage || 1
                }
            };

            const response = await this.$axios.get('/notification', axiosHeader);
            if (response.data.status == 'success') {
                const notifications = response.data.data;
                context.commit('setNotifications', notifications);
            }
        } catch (e) {
            console.log(e)
            const error = new Error('')
            throw error;
        }
    },
    async fetchNotificationsForDevice(context, numberPage) {
        try {
            const token = context.rootGetters['auth/getToken'];
            const device = context.rootGetters['devices/getSelDevice'];
            if (!device) return;
            const axiosHeader = {
                headers: {
                    'x-auth-token': token
                },
                params: {
                    numberPage: numberPage || 1,
                    dId: device.dId
                }
            };

            const response = await this.$axios.get('/notification/fordevice', axiosHeader);
            if (response.data.status == 'success') {
                const notifications = response.data.data;
                context.commit('setDeviceNotifications', notifications);
            }
        } catch (e) {
            console.log(e)
            const error = new Error('')
            throw error;
        }
    },
    async setReaded(context, notifId) {
        try{
        const token = context.rootGetters['auth/getToken'];
        const toSend = {
            notifId: notifId
        }
        const axiosHeader = {
            headers: {
                'x-auth-token': token
            }   
        };
        const response = await this.$axios.put('/notification', toSend,axiosHeader);
        if (response.data.status == 'success') {
            return true;

        }
    } catch(e) {
        const error = new Error('Falied to update notification')
        throw error;
    }

    }
};

export default actions;