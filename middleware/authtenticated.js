//If the user does not have a token, we send it to login
export default function ({ store, redirect }) {

    store.dispatch("auth/autologin");

    if (!store.getters['auth/isAuth']) {
        return redirect("/auth/login");
    }
}