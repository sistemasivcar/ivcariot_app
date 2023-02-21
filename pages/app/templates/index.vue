<template>
  <div>
    <NewTemplate @new-template="updateTemplates"></NewTemplate>

    <ListTemplates :templates="templates"></ListTemplates>
  </div>
</template>

<script>
import ListTemplates from "../../../components/Templates/ListTemplates.vue";
import NewTemplate from "../../../components/Templates/NewTemplate.vue";

export default {
  components: {
    NewTemplate,
    ListTemplates
  },
  middleware: "authtenticated",

  data() {
    return {
      templates:[],
    };
  },
  methods: {
    updateTemplates() {

      this.getTemplates();
    },

    async getTemplates() {
      try {
        const token = this.$store.getters["auth/getToken"];
        const axiosHeaders = {
          headers: {
            "x-auth-token": token
          }
        };

        const res = await this.$axios.get("/template", axiosHeaders);
        if (res.data.status == "success") {
          this.templates = res.data.data;
        }
      } catch (e) {
        console.log(e);
        this.$notify({
          type: "danger",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Fail to load templates"
        });
      }
    }
  },
  created() {
    this.getTemplates();
  }
};
</script>
