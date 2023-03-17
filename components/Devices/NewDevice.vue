<template>
  <div class="row">
    <card>
      <div slot="header">
        <h4 class="card-title">{{ $t("devices.new.title") }}</h4>
      </div>

      <!-- FORM -->
      <div class="row mb-2">
        <div class="col-12 col-md-4">
          <base-input
            v-model.trim="deviceName"
            :label="$t('devices.new.name')"
            type="text"
            :class="{ 'has-danger': !inputs.deviceName }"
            placeholder="Ex: Home, Office..."
          >
          </base-input>
        </div>

        <div class="col-12 col-md-4">
          <base-input
            v-model.trim="deviceId"
            :class="{ 'has-danger': !inputs.deviceId }"
            :label="$t('devices.new.id')"
            type="text"
            placeholder="Ex: 7777-8888"
          >
          </base-input>
        </div>

        <div class="col-12 col-md-4">
          <slot name="label">
            <label> {{ $t("devices.new.templateinp") }} </label>
          </slot>

          <el-select
            v-model="templateSelectedIndex"
            :placeholder="$t('devices.new.template')"
            class="select-info"
            style="width:100%"
          >
            <el-option
              v-for="(template, index) in templates"
              :key="template._id"
              class="text-dark"
              :value="index"
              :label="`${template.name}`"
            ></el-option>
          </el-select>
        </div>
      </div>

      <!-- ADD - CANCEL -->
      <div class="row pull-right">
        <div class="col-12 col-md-6">
          <base-button
          v-if="$store.state.devices.devices.length>0"
            type="danger"
            @click="$emit('cancel-creation')"
            class="mb-3 pull-right"
            size="md"
            >{{ $t("btncan") }} <i class="tim-icons icon-simple-remove"></i
          ></base-button>
        </div>

        <div class="col-12 col-md-6">
          <base-button
            type="info"
            @click="newDevice()"
            :loading="addLoading"
            class="mb-3 pull-right"
            size="md"
            >{{ $t("devices.new.btn") }} <i class="fa fa-plus ml-2"></i
          ></base-button>
        </div>
      </div>
    </card>
  </div>
</template>

<script>
import { Select, Option } from "element-ui";
import BaseButton from "../BaseButton.vue";
export default {
  props:["templates"],
  components: {
    [Option.name]: Option,
    [Select.name]: Select,
    BaseButton
  },
  data() {
    return {
      deviceName: null,
      deviceId: null,
      addLoading: false,
      inputs: {
        deviceName: true,
        deviceId: true
      },
      templateSelectedIndex: null
    };
  },
  methods: {
        
    validateForm() {
      if (
        !this.deviceName ||
        !this.deviceId ||
        this.templateSelectedIndex == null
      ) {
        this.isValidForm = false;
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: `${this.$t("devices.new.invalidinp")}`
        });
        return;
      }
      this.isValidForm = true;
    },

    async newDevice() {
      this.validateForm();
      if (!this.isValidForm) return;

      try {
        this.addLoading = true;
        const templateSelected = this.templates[this.templateSelectedIndex];
        const newDevice = {
          name: this.deviceName,
          dId: this.deviceId,
          status: "offline",
          templateId: templateSelected._id,
          templateName: templateSelected.name
        };
        await this.$store.dispatch("devices/newDevice", newDevice);
        await this.$store.dispatch("devices/fetchDevices");
        this.$notify({
          type: "success",
          icon: "tim-icons icon-check-2",
          //message: `Device "${newDevice.name.toUpperCase()}" created!`
          message: `${this.$t("devices.new.ok {device}", {
            device: newDevice.name.toUpperCase()
          })}`
        });
        this.$emit("device-created");
      } catch (e) {
        this.$notify({
          type: "danger",
          icon: "tim-icons icon-alert-circle-exc",
          message: e
        });
      } finally {
        this.addLoading = false;
      }
    }
  },
  
  watch: {
    deviceName(val) {
      if (!val) {
        this.inputs.deviceName = false;
      } else {
        this.inputs.deviceName = true;
      }
    },
    deviceId(val) {
      if (!val) {
        this.inputs.deviceId = false;
      } else {
        this.inputs.deviceId = true;
      }
    }
  },
  
};
</script>
