
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

    async fetchUserData(context) {
        try {
            const token = context.rootGetters['auth/getToken'];
            const axiosHeader = {
                headers: {
                    'x-auth-token': token
                }
            };
            const res = await this.$axios.get("/user", axiosHeader);

            if (res.data.status == 'success') {
                context.commit('setUser', res.data.data);
                
            }

        } catch (e) {
            console.log(e)
        }
        
    },

    async updateProfile(context,user) {
        try {
            const token = context.rootGetters['auth/getToken'];
            const toSend = {
                updatedUser:user
            }
            const axiosHeader = {
                headers: {
                    'x-auth-token': token
                }
            };
            const res = await this.$axios.put("/user", toSend, axiosHeader);
            if (res.data.status == 'success') {
                return true;
            }

        } catch (e) {
            throw new Error('The email may already exists')
        }

    }
}

export default actions;