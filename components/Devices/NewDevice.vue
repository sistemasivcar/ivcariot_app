<template>
  <div class="row">
    <card>
      <div slot="header">
        <h4 class="card-title">Add new Device</h4>
      </div>

      <div class="row">
        <div class="col-4">
          <base-input
            v-model.trim="deviceName"
            label="Device Name"
            type="text"
            placeholder="Ex: Home, Office..."
          >
          </base-input>
        </div>

        <div class="col-4">
          <base-input
            v-model.trim="deviceId"
            label="Device Id"
            type="text"
            placeholder="Ex: 7777-8888"
          >
          </base-input>
        </div>

        <div class="col-4">
          <slot name="label">
            <label> Template </label>
          </slot>

          <el-select
            value="1"
            v-model="templateSelectedIndex"
            placeholder="Select Template"
            class="select-info"
            style="width:100%"
          >
            <el-option
              v-for="(template, index) in templates"
              :key="template._id"
              class="text-dark"
              :value="index"
              :label="template.name"
            ></el-option>
          </el-select>
        </div>
      </div>

      <div class="row pull-right">
        <div class="col-12">
          <base-button type="info" @click="newDevice()" class="mb-3" size="lg"
            >Add</base-button
          >
        </div>
      </div>
      <div v-if="!hasTemplates">
        You need first create a Template to create a Device
        <base-button
          :link="true"
          @click="$router.push('/app/templates')"
          type="info"
          >Create new Template</base-button
        >
      </div>
    </card>
  </div>
</template>

<script>
import { Select, Option } from "element-ui";
export default {
  components: {
    [Option.name]: Option,
    [Select.name]: Select
  },
  data() {
    return {
      deviceName: null,
      deviceId: null,
      templates: [],
      templateSelectedIndex: null
    };
  },
  methods: {
    clearInputs() {
      this.deviceName = "";
      this.deviceId = "";
      this.templateSelectedIndex = null;
    },
    async getDevices() {
      try {
        await this.$store.dispatch("devices/fetchDevices");
      } catch (e) {
        this.$notify({
          type: "danger",
          icon: "tim-icons icon-alert-circle-exc",
          message: e
        });
      }
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
        console.log(e);
        this.$notify({
          type: "danger",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Fail to load templates"
        });
      }
    },
    async newDevice() {
      if (!this.deviceName) {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: " Device Name is Empty"
        });
        return;
      }
      if (!this.deviceId) {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: " Device ID is Empty"
        });
        return;
      }
      if (this.templateSelectedIndex === null) {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: " Please, Select a Template"
        });
        return;
      }
      try {
        const templateSelected = this.templates[this.templateSelectedIndex];
        const newDevice = {
          name: this.deviceName,
          dId: this.deviceId,
          templateId: templateSelected._id,
          templateName: templateSelected.name
        };
        await this.$store.dispatch("devices/newDevice", newDevice);
        await this.$store.dispatch("devices/fetchDevices");
        this.clearInputs();
        this.$notify({
          type: "success",
          icon: "tim-icons icon-check-2",
          message: `Device "${newDevice.name.toUpperCase()}" created!`
        });
      } catch (e) {
        this.$notify({
          type: "danger",
          icon: "tim-icons icon-alert-circle-exc",
          message: e
        });
      }
    }
  },
    computed: {
    hasTemplates() {
      return this.templates.length > 0;
    }
  },
    created() {
        this.getTemplates();
  }
};
</script>
