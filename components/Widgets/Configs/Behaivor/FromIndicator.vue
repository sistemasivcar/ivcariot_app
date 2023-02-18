<template>
  <div>
    <div class="row">
      <div class="col-6">
        <base-input
          v-model="variableFullName"
          label="Variable Name"
          type="text"
          @blur="validVarFullName"
        >
        </base-input>
      </div>

      <div class="col-6">
        <base-input
          v-model="variableSendFreq"
          label="Update interval (mins)"
          type="number"
        >
        </base-input>
      </div>
    </div>

    <div class="row" v-if="!isBoolean">
      <div class="col-12">
        <label class="text-success mt-3 "
          >Turn ON the icon if {{ variableFullName }} is:</label
        >
      </div>

      <div class="col-6">
        <el-select
          required
          class="select-info pull-left"
          placeholder="Condition"
          v-model="condition"
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
        <base-input v-model="value" label="Value:" type="number"> </base-input>
      </div>
    </div>

    <div class="row" v-if="isBoolean">
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
        <base-input v-model="messageOn" label="ON status message" type="text">
        </base-input>
      </div>

      <div class="col-6 ">
        <base-input v-model="messageOff" label="OFF status message" type="text">
        </base-input>
      </div>
    </div>

    <div class="row">
      <div class="col-6">
        <base-checkbox
          class=""
          :checked="true"
          v-model="isBoolean"
          :value="true"
          >Is Boolean Variable?</base-checkbox
        >
      </div>
    </div>
  </div>
</template>

<script>
import { Checkbox, CheckboxButton } from "element-ui";
import { Select, Option } from "element-ui";
import BaseInput from "../../../Inputs/BaseInput.vue";
export default {
  components: {
    BaseInput,
    [Checkbox.name]: Checkbox,
    [CheckboxButton.name]: CheckboxButton,
    [Option.name]: Option,
    [Select.name]: Select
  },
  data() {
    return {
      variableFullName: "Alarm status",
      variableSendFreq: 5,
      messageOn: "The alarm is ON",
      messageOff: "The alarm is OFF",
      isBoolean: true,
      value: 0,
      condition: '>'
    };
  },
  methods: {
    validVarFullName() {
      if (!this.variableFullName) {
        this.variableFullName = "my var name";
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Variable name can not be empty"
        });
      }
    }
  },
  watch: {
    variableFullName(value) {
      this.$emit("var-full-name", value);
    },
    variableSendFreq(value) {
      if (value <= 0) {
        this.variableSendFreq = 1;
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Update interval must be > 0"
        });
      } else {
        this.$emit("send-freq", parseInt(value));
      }
    },
    isBoolean(value) {
      if (!value) this.variableFullName = "temperature";
      else{this.variableFullName = "Alarm status";}
      this.$emit("is-bool", value);
    },
    condition(value) {
      if (!value && !this.isBoolean) {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Select the condition"
        });
      } else {
        this.$emit("condition", value);
      }
    },
    value(value) {
      if (!value && !this.isBoolean) {
        this.value = 0;
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Select the value"
        });
      } else {
        this.$emit("value", parseInt(value));
      }
    },
    messageOn(value) {
      this.$emit("message-on", value);
    },
    messageOff(value) {
      this.$emit("message-off", value);
    }
  }
};
</script>
