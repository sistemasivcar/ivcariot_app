//The AUTOLOGIN for pages that requried a token and the user aleready have one
export default function ({ store, redirect }) {

    store.dispatch("auth/autologin");

    if (store.getters['auth/isAuth']) {
        console.log('esta auth')
        return redirect("/app/dashboard");
    }
}