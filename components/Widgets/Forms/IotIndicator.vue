<template>
  <div>
    <div class="row">
      <div class="col-6">
        <base-input
          v-model="config.variableFullName"
          label="Variable Name"
          type="text"
        >
        </base-input>
      </div>

      <div class="col-6">
        <base-input
          v-model="config.variableSendFreq"
          label="Update interval (mins)"
          type="number"
        >
        </base-input>
      </div>
    </div>

    <div class="row" v-if="!config.isBoolean">
      <div class="col-12">
        <label class="text-success mt-3 "
          >Turn ON the icon if {{ config.variableFullName }} is:</label
        >
      </div>

      <div class="col-6">
        <el-select
          required
          class="select-info pull-left"
          placeholder="Condition"
          v-model="config.condition"
          style="margin-top: 30px; width:100%"
        >
          <el-option class="text-dark" value="=" label="="></el-option>
          <el-option class="text-dark" value=">" label=">"></el-option>
          <el-option class="text-dark" value=">=" label=">="></el-option>
          <el-option class="text-dark" value="<" label="<"></el-option>
          <el-option class="text-dark" value="<=" label="<="></el-option>
          <el-option class="text-dark" value="!=" label="!="></el-option>
        </el-select>
      </div>

      <div class="col-6">
        <base-input v-model="config.value" label="Value:" type="number">
        </base-input>
      </div>
    </div>

    <div class="row" v-if="config.isBoolean">
      <div class="col-12">
        <label class="text-success mt-3"
          >For status change notifications:
        </label>
        <el-tooltip
          content="This is optional and apart from the alarm rules that you can create later!"
          :open-delay="300"
          placement="top"
          ><label class="" for="">⚠️</label></el-tooltip
        >
      </div>

      <div class="col-6 ">
        <base-input
          v-model="config.messageOn"
          label="ON status message"
          type="text"
        >
        </base-input>
      </div>

      <div class="col-6 ">
        <base-input
          v-model="config.messageOff"
          label="OFF status message"
          type="text"
        >
        </base-input>
      </div>
    </div>

    <div class="row">
      <div class="col-6">
        <base-checkbox
          class=""
          :checked="true"
          v-model="config.isBoolean"
          :value="true"
          >Is Boolean Variable?</base-checkbox
        >
      </div>
    </div>

    <div class="row">
      <div class="col-6">
        <label for="color">Color</label>
        <color-config @color="getColor"></color-config>
      </div>
      <div class="col-6">
        <label for="color">Icon</label>
        <config-icon @icon="getIcon"></config-icon>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <label for="color">Ancho</label>
        <config-cols @cols="getCols"></config-cols>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <base-button type="info" @click="addWidget" class="mt-3" size="lg"
          >Add</base-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Checkbox, CheckboxButton } from "element-ui";
import { Select, Option } from "element-ui";
import BaseInput from "../../../components/Inputs/BaseInput.vue";
import IotIndicator from "../IotIndicator.vue";
export default {
  components: {
    BaseInput,
    IotIndicator,
    [Checkbox.name]: Checkbox,
    [CheckboxButton.name]: CheckboxButton,
    [Option.name]: Option,
    [Select.name]: Select
  },
  data() {
    return {
      isValidForm: true,
      config: {
        selectedDevice: {
          name: "Home",
          dId: "dummy-device-id"
        },
        isBoolean: true,
        messageOn: "The alarm is ON",
        messageOff: "The alarm is OFF",
        condition: ">",
        value: 0,
        variableFullName: "Alarm Status",
        color: "success",
        variableType: "input",
        variableSendFreq: "5",
        widgetName: "indicator",
        icon: "fa-home",
        column: "col-6"
      }
    };
  },
  methods: {
    getColor(value) {
      this.config.color = value;
    },
    getIcon(value) {
      this.config.icon = value;
    },
    getCols(value) {
      this.config.column = value;
    },

    validateFrom() {
      if (!this.config.variableFullName) {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Variable name can not be empty"
        });
        return;
      }
    },
    addWidget() {
      console.log('sdfklsd')
      this.validateFrom();

      this.isValidForm
        ? this.$emit("add-widget", this.config)
        : this.$emit("add-widget", false);
    }
  },
  watch: {
    config: {
      immediate: true,
      deep: true,
      handler() {
        this.$emit("indicator-config", this.config);
      }
    }
  }
};
</script>
