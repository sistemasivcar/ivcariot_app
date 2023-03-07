<template>
  <div>
    
    <LazyNewDevice
      v-if="showViewCreate || devices.length == 0"
      @cancel-creation="cancelCreation()"
      @device-created="deviceCreated()"
      :templates="templates"
    ></LazyNewDevice>

    <ListDevices
      v-if="showViewList"
      @create-device="createDevice()"
    ></ListDevices>

    <Modal
      :top="true"
      :animationDuration="3000"
      type=""
      :show="welcome"
      :scrollToBottom="true"
      :appendToBody="true"
      gradient=""
    >
      <template name="header">
        <h4 class="text-info">NO TENÉS PLANTILLAS!</h4>
      </template>

      <template name="default">
        <div class="row">
          <div class="col-12">
            <p class="text-dark">
              Para poder agregar un dispositivo debés asociarle la plantilla
              correspondiente.
            </p>
          </div>
        </div>

        <div class="row">
          <div class="col-12 mt-2">
            <p class="text-dark">
              Primero
              <a
                class="text-danger"
                style="cursor: pointer;"
                @click.prevent="goTemplates"
                >creá la plantilla</a
              >
              que contendrá las variables que tu dispositivo recibe y/o envía
              como por ejemplo temperatura, presión, humedad, etc.
            </p>
          </div>
        </div>

        <div class="row">
          <div class="col-12 mt-2">
            <p class="text-dark">
              Luego volvé a esta página y creá el dispositivo.
            </p>
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <BaseButton
              size="md"
              type="info"
              @click="goTemplates()"
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
import ListDevices from "../../../components/Devices/ListDevices.vue";
import NewDevice from "../../../components/Devices/NewDevice.vue";

export default {
  middleware: "authtenticated",
  components: { NewDevice, ListDevices },
  data() {
    return {
      showViewCreate: false,
      showViewList: true,
      welcome: false,
      templates: []
    };
  },
  methods: {
    createDevice() {
      this.showViewCreate = true;
      this.showViewList = false;
    },
    cancelCreation() {
      this.showViewCreate = false;
      this.showViewList = true;
    },
    deviceCreated() {
      this.showViewCreate = false;
      this.showViewList = true;
    },
    async getTemplates() {
      try {
        const token = this.$store.state.auth.auth.token;
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
    },
    goTemplates() {
      this.$router.push("templates");
    }
  },
  computed: {
    devices() {
      return this.$store.getters["devices/getDevices"];
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
