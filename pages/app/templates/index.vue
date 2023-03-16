<template>
  <div>
    <div>
      <NewTemplate
        @new-template="updateTemplates"
        :templates="templates"
        @cancel-creation="(showViewList = true), (showViweCreate = false)"
        v-if="showViweCreate || templates.length == 0"
      ></NewTemplate>
      <ListTemplates
        v-if="showViewList"
        @get-templates="updateTemplates"
        :templates="templates"
        @create-template="(showViweCreate = true), (showViewList = false)"
      ></ListTemplates>
    </div>

    <Modal
      @close="welcome = false"
      :animationDuration="2000"
      type="notice"
      :show="welcome"
      :top="true"
      :appendToBody="true"
      gradient=""
    >
      <template name="header">
        <h4 class="text-info">COMENZÁ A CREAR PLANTILLAS!</h4>
      </template>

      <template name="default">
        <div class="row">
          <div class="col-12">
            <p class="text-dark">
              Las plantillas representan las variables que tu dispositivo envia
              y/o recibe.
            </p>
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <p class="text-dark">
              Creá plantillas para poder ver en tiempo real los datos que tu
              dispositivo sensa como así también para poder enviar comandos y
              actuar sobre el mismo.
            </p>
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <p class="text-dark">
              Cada variable está representada por un widget de la plantilla y
              son totalmente personalizables para que el proyecto se pueda
              adaptar a tus necesidades.
            </p>
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <BaseButton
              size="md"
              type="info"
              @click="welcome = false"
              class="pull-right"
              >Entendido</BaseButton
            >
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script>
import ListTemplates from "../../../components/Templates/ListTemplates.vue";
import NewTemplate from "../../../components/Templates/NewTemplate.vue";
import { Modal } from "@/components";
import BaseButton from "../../../components/BaseButton.vue";

export default {
  components: {
    NewTemplate,
    ListTemplates,
    BaseButton
  },
  middleware: ["authtenticated"],
  head: {
    title: 'IvcarIoT - Plantillas',
  },
  data() {
    return {
      templates: [],
      showViweCreate: false,
      showViewList: true,
      welcome: false
    };
  },
  methods: {
    updateTemplates() {
      this.getTemplates();
      this.showViweCreate = false;
      this.showViewList = true;
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
        if (!e.response) {
          this.$notify({
            type: "danger",
            icon: "tim-icons icon-alert-circle-exc",
            message: "Network Error"
          });
          return;
        }
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
  },
  watch: {
    templates: {
      handler() {
        if (this.templates.length == 0) {
          this.welcome = true;
        }
      }
    }
  }
};
</script>
