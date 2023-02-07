const getters = {
    getUserName(state) {
        return state.auth.userData.name;
    },
    getName(state) {
        return "gassston";
    },

    isAuth(state) {
        return state.auth != null
    }
}

export default getters;