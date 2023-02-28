//The AUTOLOGIN for pages that requried a token and the user aleready have one
export default function ({ store, redirect }) {

    store.dispatch("auth/autologin");

    if (store.getters['auth/isAuth']) {
        if (store.state.locale.locale == 'es') {
            
            return redirect(`/app/dashboard`);
        }
        return redirect(`/en/app/dashboard`);
    }
}