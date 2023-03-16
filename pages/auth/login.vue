<template>
  <div class="container login-page">
    <div class="col-lg-4 col-md-6 ml-auto mr-auto">
      <card class="card-login card-white">
        <template slot="header">
          <img src="/img//card-info.png" alt="" />
          <h1 class="card-title">Ivcar IoT</h1>
        </template>

        <div @keyup.enter="login()">
          <base-input
            name="email"
            v-model="user.email"
            :placeholder="$t('auth.emailinp')"
            addon-left-icon="tim-icons icon-email-85"
          >
          </base-input>

          <base-input
            name="password"
            v-model="user.password"
            type="password"
            :placeholder="$t('auth.passwordinp')"
            addon-left-icon="tim-icons icon-lock-circle"
          >
          </base-input>
        </div>

        <div slot="footer">
          <base-button
            native-type="submit"
            type="info"
            class="mb-3"
            size="lg"
            @click="login()"
            block
          >
            Login
          </base-button>
          <div class="pull-left">
            <h6>
              <nuxt-link class="link footer-link text-info" to="/auth/register">
                {{$t('auth.registerlink')}}
              </nuxt-link>
            </h6>
          </div>

          <div class="pull-right">
            <h6><a href="#help!!!" class="link footer-link text-info">{{ $t('auth.helplink') }}</a></h6>
          </div>
        </div>
      </card>
    </div>
  </div>
</template>

<script>
const Cookie = process.client ? require("js-cookie") : undefined;
export default {
  middleware:'notAuthenticated',
  name: "login-page",
  layout: "auth",
  head: {
    title: 'IvcarIoT - Login',
    meta: [
      {
        hid: 'login',
        name: 'login',
        content: 'login'
      }
    ],
  },
  data() {
    return {
      user: {
        email: "",
        password: ""
      }
    };
  },
  methods: {
    async login() {
      try {

        if(!this.user.email || !this.user.password){
          this.$notify({
          type: "warning",
          icon:'tim-icons icon-alert-circle-exc',
          message:'Campos inválidos!'
        });
        return;
        }

        await this.$store.dispatch('auth/login', this.user);
        this.$notify({
          type: "success",
          icon: "tim-icons icon-check-2",
          message: "Bienvenido, " + this.$store.getters['auth/getUserName'] + "!"
        });
        $nuxt.$router.push("/app/dashboard");

      } catch (e) {
        this.$notify({
          type: "danger",
          icon:'tim-icons icon-alert-circle-exc',
          message:e
        });
      }
    },

    // isAuthtenticated(){
    //   if(this.$store.getters.isAuth){
    //     this.$router.push("/app/dashboard");
    //   }
  },
  
  mounted(){
    this.$store.dispatch('auth/autologin');
  }
};
</script>

<style>
.navbar-nav .nav-item p {
  line-height: inherit;
  margin-left: 5px;
}
</style>
