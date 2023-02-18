<template>
  <card class="card-user">
    <p class="card-text"></p>
    <div class="author">
      <div class="block block-one"></div>
      <div class="block block-two"></div>
      <div class="block block-three"></div>
      <div class="block block-four"></div>
    </div>
    <h5 slot="header" class="title">Edit Profile</h5>

    <form @submit.prevent="updateProfile">
      <div class="row">
        <div class="col-md-6">
          <base-input type="email" label="*Email address" v-model="user.email">
          </base-input>
        </div>

        <div class="col-md-6">
          <base-input
            type="text"
            label="*Full Name"
            placeholder="Full Name"
            v-model="user.name"
          >
          </base-input>
        </div>
      </div>

      <div class="row">
        <div class="col-md-4">
          <base-input
            type="text"
            label="*Phone 01"
            placeholder="Phone"
            v-model="user.phone01"
          >
          </base-input>
        </div>
        <div class="col-md-4">
          <base-input
            type="text"
            label="Phone 02"
            placeholder="Enter your second phone number"
            v-model="user.phone02"
          >
          </base-input>
        </div>
        <div class="col-md-4">
          <base-input
            type="text"
            label="Phone 03"
            placeholder="Enter your third phone number"
            v-model="user.phone03"
          >
          </base-input>
        </div>
      </div>

      <div class="row"></div>

      <div class="row">
        <div class="col-md-4">
          <base-input
            label="Postal Code"
            placeholder="ZIP Code"
            v-model="user.postalCode"
          >
          </base-input>
        </div>
        <div class="col-md-4">
          <base-input
            type="text"
            label="City"
            placeholder="Cordoba"
            v-model="user.city"
          >
          </base-input>
        </div>
        <div class="col-md-4">
          <base-input
            type="text"
            label="Country"
            placeholder="Argentina"
            v-model="user.country"
          >
          </base-input>
        </div>
      </div>

      <div class="row">
        <div class="col-md-12"></div>
      </div>

      <base-button native-type="submit" type="info" class="btn-fill mt-3">
        Save
      </base-button>
    </form>
  </card>
</template>
<script>
export default {
  middleware: "authtenticated",
  data() {
    return {
      user: {
        email: "",
        name: "",
        address: "",
        city: "",
        country: "",
        postalCode: "",
        phone01: "",
        phone02: "",
        phone03: ""
      }
    };
  },
  async created() {
    await this.getUser();
  },
  methods: {
    capitalizarPrimeraLetra(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    capitalizeWords(str) {
      if(!str) return '';
      let res = "";
      const words = str.split(" ");
      words.forEach(w => {
        res += this.capitalizarPrimeraLetra(w) + " ";
      });
      return res;
    },
    async updateProfile() {
      try {
        if (!this.user.phone01) {
          this.$notify({
            type: "warning",
            icon: "tim-icons icon-alert-circle-exc",
            message: "You must have a valid Phone01"
          });
          return;
        }

        if (!this.user.email) {
          this.$notify({
            type: "warning",
            icon: "tim-icons icon-alert-circle-exc",
            message: "You must have an email"
          });
          return;
        }

        if (!this.user.name) {
          this.$notify({
            type: "warning",
            icon: "tim-icons icon-alert-circle-exc",
            message: "You must have a name"
          });
          return;
        }
        var phonesValidos = /^[0-9]+$/;

        if (
          (this.user.phone01 != "" &&
            !this.user.phone01.match(phonesValidos)) ||
          (this.user.phone02 != "" &&
            !this.user.phone02.match(phonesValidos)) ||
          (this.user.phone03 != "" && !this.user.phone03.match(phonesValidos))
        ) {
          this.$notify({
            type: "warning",
            icon: "tim-icons icon-alert-circle-exc",
            message: "Number phone invalid"
          });
          return;
        }

        if (
          this.user.postalCode != "" &&
          !this.user.postalCode.match(phonesValidos)
        ) {
          this.$notify({
            type: "warning",
            icon: "tim-icons icon-alert-circle-exc",
            message: "Invalid Postal Code "
          });
          return;
        }

        const phones = [
          this.user.phone01,
          this.user.phone02 || "",
          this.user.phone03 || ""
        ];

        const userUpdated = {
          name: this.user.name,
          email: this.user.email,
          city: this.user.city,
          country: this.user.country,
          codezip: this.user.postalCode,
          phones
        };
        await this.$store.dispatch("auth/updateProfile", userUpdated);
        await this.getUser();
        this.$notify({
          type: "success",
          icon: "tim-icons icon-check-2",
          message: `Your profile is up to date`
        });
      } catch (e) {
        await this.getUser();

        this.$notify({
          type: "danger",
          icon: "tim-icons icon-alert-circle-exc",
          message: e
        });
      }
    },
    async getUser() {
      try {
        await this.$store.dispatch("auth/fetchUserData");

        this.user.email = this.$store.state.auth.auth.userData.email;
        this.user.name = this.capitalizeWords(this.$store.state.auth.auth.userData.name);
        this.user.phone01 = this.$store.state.auth.auth.userData.phones[0];
        this.user.phone02 =
          this.$store.state.auth.auth.userData.phones[1] || "";
        this.user.phone03 =
          this.$store.state.auth.auth.userData.phones[2] || "";
        this.user.city = this.capitalizeWords(this.$store.state.auth.auth.userData.city) || "";
        this.user.country = this.capitalizeWords(this.$store.state.auth.auth.userData.country) || "";
        this.user.postalCode =
          this.capitalizeWords(this.$store.state.auth.auth.userData.codezip) || "";
      } catch (e) {
        console.log(e);
      }
    }
  }
};
</script>
<style></style>
