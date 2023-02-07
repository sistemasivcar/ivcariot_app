const getters = {
    getUserName(state) {
        return state.auth.userData.name;
    },
    getToken(state) {
        return state.auth.token;
    },

    isAuth(state) {
        return state.auth != null
    }
}

export default getters;