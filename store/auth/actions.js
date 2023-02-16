
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
        localStorage.clear();
        const auth = null;
        context.commit('setAuth', auth);
        this.$router.replace('/')
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
            if (err.response && err.response.data.status == "error" && err.response.data.message == 'Invalid credentials') {
                throw new Error('Invalid credentials');
            }
            throw new Error('Something was wrong! Try later');
        }
    },
}

export default actions;