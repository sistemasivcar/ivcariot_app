<template>
  <card title="Configuración General de la Plataforma">
    <div class="row">
      <div class="col-12">
        <li>
          <label for="usePublicTemplates">Usar Plantillas Públicas:</label>
        </li>
        <BaseSwitch
          @click="toggleUsePublicTemplates"
          onText="SÍ"
          offText="NO"
          class="ml-3 mt-2"
          :value="usePublicTemplatesConfig"
        >
        </BaseSwitch>
        <div v-if="usePublicTemplatesConfig">
          <p  class="text-danger">Importante: <p>Si tu dispositivo fue creado con una plantilla pública que no te pertence y el creador la eliminó,
             tu(s) dispositivo(s) sera(n) eliminados automáticamente.</p></p>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <li><label for="usePublicTemplates">Idioma:</label></li>
        <div class="col-12 col-md-6">
          <BaseRadio v-model="localeSelected" name="en" id="en" value="en"
            >English</BaseRadio
          >
        </div>
        <div class="col-12 col-md-6">
          <BaseRadio v-model="localeSelected" name="es" id="es" value="es"
            >Castellano</BaseRadio
          >
        </div>
      </div>
    </div>
  </card>
</template>

<script>
import { BaseSwitch } from "@/components";
export default {
  middleware: "authtenticated",
  components: {
    BaseSwitch
  },
  data() {
    return {
      localeSelected: this.$store.getters["locale/getRealLocale"],
      alert:false,
    };
  },
  methods: {
    toggleUsePublicTemplates() {
      if(this.usePublicTemplatesConfig){
        this.noUsePublicTemplates()
        return
      }
      this.usePublicTemplates()
    },
    async noUsePublicTemplates() {
      try {
        this.$store.commit("auth/usePublicTemplates", false);
        const userUpdated = this.$store.state.auth.auth.userData;
        await this.$store.dispatch("auth/updateProfile", userUpdated);
        this.$notify({
          type: "success",
          icon: "tim-icons icon-check-2",
          message: `Plantillas Públicas Desactivadas! Volvé a loguearte para aplicar los cambios`
        });

        this.$store.dispatch("auth/fetchUserData");
      } catch (e) {}
    },
    async usePublicTemplates() {
      try {
        this.$store.commit("auth/usePublicTemplates", true);
        const userUpdated = this.$store.state.auth.auth.userData;
        await this.$store.dispatch("auth/updateProfile", userUpdated);
        this.$notify({
          type: "success",
          icon: "tim-icons icon-check-2",
          message: `Plantillas Importadas! Volvé a loguearte para aplicar los cambios`
        });
        this.$store.dispatch("auth/fetchUserData");
      } catch (e) {}
    }
  },
  computed: {
    usePublicTemplatesConfig() {
      return this.$store.getters["auth/usePublicTemplates"];
    }
  },
  watch: {
    localeSelected(locale, oldLocal) {
      this.$store.commit("locale/setLocale", locale);
      const actualPathSplitted = this.$route.path.split("/");
      if (oldLocal == "es" && locale !== "es") {
        // estoy en castellano y me pase otro idioma distinto
        const page = actualPathSplitted[2];
        this.$router.push(`/${locale}/app/${page}`);
        return;
      }
      if (locale == "es" && oldLocal != "es") {
        // esto en castellano y me paso a otro idioma distitno
        const page = actualPathSplitted[3];
        this.$router.push(`/app/${page}`);
        return;
      }
    },
    
  }
};
</script>
