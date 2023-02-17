const mutations = {
    setAuth(state, auth) {
        state.auth = auth;
    },
    setUser(state, user) {
        state.auth.userData = user;
    }
}

export default mutations