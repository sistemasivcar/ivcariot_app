const mutations = {
    setAuth(state, auth) {
        state.auth = auth;
    },
    setUser(state, user) {
        state.auth.userData = user;
    },
    usePublicTemplates(state, newValue){
        state.auth.userData.config.usePublicTemplates=newValue;
    },
    setSubscription(state, subs){
        state.subscribed=subs;
    }

}

export default mutations