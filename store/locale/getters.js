const getters = {
    getLocale(state) {
        return state.locale == 'es' ? '' : state.locale;
    },
    getRealLocale(state){
        return state.locale;
    }
    
}

export default getters;