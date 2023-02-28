const getters = {
    getLocale(state) {
        return state.locale == 'es' ? '' : state.locale;
    },
    
}

export default getters;