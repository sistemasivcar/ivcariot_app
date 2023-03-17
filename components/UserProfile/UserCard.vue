<template>
  <card class="card-user">
    <p class="card-text"></p>
    <div class="author">
      <div class="block block-one"></div>
      <div class="block block-two"></div>
      <div class="block block-three"></div>
      <div class="block block-four"></div>
    </div>
    <h5 slot="header" class="title">{{$t('editProfile')}}</h5>

    <form @submit.prevent="updateProfile">
      <div class="row">
        <div class="col-md-6">
          <base-input type="email" :label="$t('inpEmail')" v-model="user.email">
          </base-input>
        </div>

        <div class="col-md-6">
          <base-input
            type="text"
            :label="$t('inpFullName')"
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
            :label="$t('phone01')"
            placeholder="Phone"
            v-model="user.phone01"
          >
          </base-input>
        </div>
        <div class="col-md-4">
          <base-input
            type="text"
            :label="$t('phone02')"
            placeholder="Enter your second phone number"
            v-model="user.phone02"
          >
          </base-input>
        </div>
        <div class="col-md-4">
          <base-input
            type="text"
            :label="$t('phone03')"
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
            :label="$t('inpPostalCode')"
            placeholder="ZIP Code"
            v-model="user.postalCode"
          >
          </base-input>
        </div>
        <div class="col-md-4">
          <base-input
            type="text"
            :label="$t('city')"
            placeholder="Cordoba"
            v-model="user.city"
          >
          </base-input>
        </div>
        <div class="col-md-4">
          <base-input
            type="text"
            :label="$t('country')"
            placeholder="Argentina"
            v-model="user.country"
          >
          </base-input>
        </div>
      </div>

      <div class="row">
        <div class="col-md-12 mt-2">
          <p class="text-danger underline" style="text-decoration: underline red;">PLAN: PERÍODO DE PREUBA <strong>GRATUITA</strong></p>
        </div>
      </div>

      <base-button native-type="submit" type="info" class="btn-fill mt-3" :loading="isLoading">
        {{$t('btnSave')}}
        <i class="tim-icons icon-check-2 ml-2"></i>
      </base-button>
    </form>
  </card>
</template>
<script>
export default {
  middleware: "authtenticated",
  data() {
    return {
      fetchingData:false,
      isLoading:false,
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
        this.isLoading=true;
        if (!this.user.phone01) {
          this.$notify({
            type: "warning",
            icon: "tim-icons icon-alert-circle-exc",
            message: `${this.$t('empPhone')}` 
          });
          return;
        }

        if (!this.user.email) {
          this.$notify({
            type: "warning",
            icon: "tim-icons icon-alert-circle-exc",
            message: `${this.$t('empEmail')}` 
          });
          return;
        }

        if (!this.user.name) {
          this.$notify({
            type: "warning",
            icon: "tim-icons icon-alert-circle-exc",
            message: `${this.$t('empName')}` 
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
            message: `${this.$t('invPhone')}` 
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
            message: `${this.$t('invPC')}` 
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
          phones,
          config:this.$store.state.auth.auth.userData.config,
        };
        await this.$store.dispatch("auth/updateProfile", userUpdated);
        await this.getUser();
        this.$notify({
          type: "success",
          icon: "tim-icons icon-check-2",
          message: `${this.$t('notif')}` 
        });
      } catch (e) {
        await this.getUser();

        this.$notify({
          type: "danger",
          icon: "tim-icons icon-alert-circle-exc",
          message: e
        });
      }
      finally{
        this.isLoading=false;
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
        console.log('ERROR FETCHING DATA USER');
      }
    }
  }
};
</script>
<style></style>
