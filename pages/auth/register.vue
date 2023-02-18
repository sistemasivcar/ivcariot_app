<template>
  <div class="container login-page">
    <div class="col-lg-4 col-md-6 ml-auto mr-auto">
      <card class="card-login card-white">
        <template slot="header">
          <img src="/img//card-info.png" alt="" />
          <h1 class="card-title">IvcarIoT</h1>
        </template>

        <div>


          <base-input
            name="name"
            v-model="user.name"
            placeholder="Full Name"
            addon-left-icon="tim-icons icon-badge"
          >
          </base-input>
          <p v-if="!nameValidity" class="text-danger">invalid Name</p>
            
 


          <base-input
            name="phone"
            v-model="user.phones"
            placeholder="Phone Number"
            addon-left-icon="tim-icons icon-mobile"
          >
          </base-input>
          <p v-if="!phonenumberValidity" class="text-danger">invalid Phone Number</p>


          <base-input
            name="email"
            v-model="user.email"
            placeholder="Email"
            addon-left-icon="tim-icons icon-email-85"
          >
          </base-input>
          <p v-if="!emailValidity" class="text-danger">invalid Email Address</p>

          <base-input
            name="password"
            v-model="user.password"
            type="password"
            placeholder="Password"
            addon-left-icon="tim-icons icon-lock-circle"
          >
          </base-input>
          <p v-if="!passwordValidity" class="text-danger">invalid password</p>
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
            Register
          </base-button>

          <div class="pull-left">
            <h6>
              <nuxt-link class="link footer-link text-info" to="/auth/login">
                login
              </nuxt-link>
            </h6>
          </div>

          <div class="pull-right">
            <h6><a href="#help!!!" class="link footer-link text-info">Need Help?</a></h6>
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
      phones:[],
      user: {
        name:'',
        email: "",
        password: "",
        phones:null
      },
      isValidForm: false,
      nameValidity: true,
      emailValidity: true,
      passwordValidity: true,
      phonenumberValidity:true
    };
  },
  methods: {
    clearInputs() {
      this.name = "";
      this.email = "";
      this.password = "";
    },

    validateForm() {
      if (!this.user.name || this.user.name.length < 3) {
        this.isValidForm = false;
        this.nameValidity = false;
      } else {
        this.nameValidity = true;
        this.isValidForm = true;
      }
      if (!this.user.email) {
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
    register() {
      this.validateForm();
  
      console.log(this.nameValidity, this.emailValidity, this.passwordValidity);
      if (!this.isValidForm) return;

      this.phones.push(this.user.phones);
      this.user.phones=this.phones;

      this.$axios
        .post("/user/register", this.user)
        .then(res => {
          if (res.data.status === "success") {
            this.$notify({
              type: "success",
              icon: "tim-icons icon-check-2",
              message: "Success!, now you can login"
            });

            this.$router.push("/auth/login");

            this.clearInputs();
          }
        })
        .catch(err => {
          if (err.response.data.err.errors.email.kind == "unique") {
            this.$notify({
              type: "danger",
              icon: "tim-icons icon-alert-circle-exc",
              message: "Ups, the email already exists"
            });
          } else {
            this.$notify({
              type: "danger",
              icon: "tim-icons icon-alert-circle-exc",
              message: "Ups, something was wrong. Try later"
            });
          }
        });
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
