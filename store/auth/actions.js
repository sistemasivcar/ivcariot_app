
const actions = {
    autologin(context) {
        let auth = null;

        try {
            auth = JSON.parse(localStorage.getItem('auth'))

        } catch (e) {
            console.log(e)
        }

        context.commit('setAuth', auth);


    },

    logout(context) {
        localStorage.removeItem('token');
        const auth = null;
        context.commit('setAuth', auth);
    },

    async login(context, user) {
        try {
            const res = await this.$axios.post("/user/login", user);
            if (res.data.status == 'success') {

                const token = res.data.token;
                const userData = res.data.userData;

                const auth = {
                    token,
                    userData
                };

                localStorage.setItem('auth', JSON.stringify(auth));
                context.commit('setAuth', auth);
            }
        } catch (err) {
            const error = new Error(err.message);
            throw error;
        }
    },
}

export default actions;