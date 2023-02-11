const actions = {
    async fetchNotifications(context) {
        try {
            const token = context.rootGetters['auth/getToken'];
            const axiosHeader = {
                headers: {
                    'x-auth-token': token
                }
            };

            const response = await this.$axios.get('/notification', axiosHeader);
            if (response.data.status == 'success') {
                const notifications = response.data.data;
                context.commit('setNotifications', notifications);
            }
        } catch (e) {
            const error = new Error('Falied to load notifications')
            throw error;
        }
    },
    async setReaded(context, notif) {
        try{
        const token = context.rootGetters['auth/getToken'];
        const toSend = {
            notifId:notif._id
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