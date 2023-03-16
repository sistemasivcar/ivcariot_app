<template>
  <div class="container login-page">
    <div class="col-lg-4 col-md-6 ml-auto mr-auto">
      <card class="card-login card-white">
        <template slot="header">
          <img src="/img//card-info.png" alt="" />
          <h1 class="card-title">IvcarIoT</h1>
        </template>

        <div @keyup.enter="register()">
          <base-input
            name="name"
            v-model="user.name"
            class="info"
            :class="{ 'has-danger': !nameValidity }"
            :placeholder="$t('auth.fullnameinp')"
            addon-left-icon="tim-icons icon-badge"
          >
          </base-input>
          <p v-if="!nameValidity" class="text-danger">
            {{ $t("auth.invfullname") }}
          </p>

          <base-input
            name="phone"
            v-model="phone"
            :class="{ 'has-danger': !phonenumberValidity }"
            :placeholder="$t('auth.phoneinp')"
            addon-left-icon="tim-icons icon-mobile"
          >
          </base-input>
          <p v-if="!phonenumberValidity" class="text-danger">
            {{ $t("auth.phoneinv") }}
          </p>

          <base-input
            name="email"
            v-model="user.email"
            :placeholder="$t('auth.emailinp')"
            type="email"
            :class="{ 'has-danger': !emailValidity }"
            addon-left-icon="tim-icons icon-email-85"
          >
          </base-input>
          <p v-if="!emailValidity" class="text-danger">
            {{ $t("auth.emailinv") }}
          </p>

          <base-input
            name="password"
            v-model="user.password"
            type="password"
            :class="{ 'has-danger': !passwordValidity }"
            :placeholder="$t('auth.passwordinp')"
            addon-left-icon="tim-icons icon-lock-circle"
          >
          </base-input>
          <p v-if="!passwordValidity" class="text-danger">
            {{ $t("auth.passwordinv") }}
          </p>
        </div>

        <div slot="footer">
          <base-button
            native-type="submit"
            type="info"
            class="mb-3"
            size="lg"
            @click="register"
            block
          >
            {{ $t("auth.registerbtn") }}
          </base-button>

          <div class="">
            <h6>
              <nuxt-link class="link footer-link text-info" to="/auth/login">
                {{ $t("auth.loginlink") }}
              </nuxt-link>
            </h6>
          </div>

          <div class="pull-right">
            <!-- <h6><a href="#help!!!" class="link footer-link text-info">{{ $t('auth.helplink') }}</a></h6> -->
          </div>
        </div>
      </card>
    </div>
  </div>
</template>
<script>
export default {
  middleware: "notAuthenticated",
  layout: "auth",
  data() {
    return {
      phone: "",
      user: {
        name: "",
        email: "",
        password: ""
      },
      isValidForm: false,
      nameValidity: true,
      emailValidity: true,
      passwordValidity: true,
      phonenumberValidity: true
    };
  },
  methods: {
    clearInputs() {
      this.name = "";
      this.email = "";
      this.password = "";
    },

    validateForm() {
      var phonesValidos = /^[0-9]+$/;
      const regexEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

      if (!this.phone || !this.phone.match(phonesValidos)) {
        this.phonenumberValidity = false;
        this.isValidForm = false;
      } else {
        this.phonenumberValidity = true;
        this.isValidForm = true;
      }

      if (!this.user.name || this.user.name.length < 3) {
        this.isValidForm = false;
        this.nameValidity = false;
      } else {
        this.nameValidity = true;
        this.isValidForm = true;
      }
      if (!this.user.email.match(regexEmail)) {
        this.isValidForm = false;
        this.emailValidity = false;
      } else {
        this.emailValidity = true;
        this.isValidForm = true;
      }
      if (!this.user.password || this.user.password.length < 3) {
        this.isValidForm = false;
        this.passwordValidity = false;
      } else {
        this.passwordValidity = true;
        this.isValidForm = true;
      }
    },
    async register() {
      try {
        this.validateForm();

        if (!this.isValidForm) return;

        this.user.phones = [this.phone];
        this.user.config = {
          usePublicTemplates: false,
          notifDesconnectedDevices: false
        };

        console.dir(this.user);

        const res = await this.$axios.post("/user/register", this.user);
        console.dir(res);
        if (res.data.status === "error") {
          this.$notify({
            type: "success",
            icon: "tim-icons icon-check-2",
            message: "Registro exitoso! Ahora te podés loguar"
          });
        }
        if (res.data.status === "success") {
          this.$notify({
            type: "success",
            icon: "tim-icons icon-check-2",
            message: "Registro exitoso! Ahora te podés loguar"
          });
        }
      } catch (e) {
        console.dir(e)
        if (e.response.data.err.errors.email.kind == "unique") {
          this.$notify({
            type: "danger",
            icon: "tim-icons icon-alert-circle-exc",
            message: "El email ya existe!"
          });
          return;
        }
      }
    }
  }
};
</script>
<style>
.navbar-nav .nav-item p {
  line-height: inherit;
  margin-left: 5px;
}
</style>
