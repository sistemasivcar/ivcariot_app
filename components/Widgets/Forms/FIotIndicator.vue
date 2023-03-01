<template>
  <div>
    <!-- VAR NAME -->
    <div class="row">
      <div class="col-12">
        <base-input
          v-model="config.variableFullName"
          :label="$t('lblvarname')"
          type="text"
          :class="[{ 'has-danger': !inputs.varFullNameValid }]"
        >
        </base-input>
      </div>
    </div>
    <!-- SEND FREQ -->
    <div class="row">
      <div class="col-12">
          <BaseInput
          v-if="config.sendMethod=='periodically'"
            v-model="config.variableSendFreq"
            :label="$t('lblsendfreq')"
            type="number"
            :class="[{ 'has-danger': !inputs.sendFreqValid }]"
          ></BaseInput>
        </div>
    </div>
    <!-- IS BOOLEAN -->
    <div class="row">
      <div class="col-12">
        <label for="send_method">Es variable Booleana? Luz, Bomba, Estado Alarma, etc...</label>
      </div>
    </div>

    <div class="row">
      <div class="col-2">
        <BaseRadio v-model="config.isBoolean" :name="true" id="true" :value="true"
          >SI</BaseRadio
        >
      </div>
      <div class="col-2">
        <BaseRadio v-model="config.isBoolean" :name="false" id="false" :value="false"
          >NO</BaseRadio
        >
      </div>
    </div>
    <!-- SEND METHOD -->
    <div class="row">
      <div class="col-12 mt-3">
        <label for="send_method">Cómo enviará datos el dispositivo?</label>
      </div>
    </div>

    <div class="row">
      <div class="col-6">
        <BaseRadio
          :disabled="!config.isBoolean"
          v-model="config.sendMethod"
          name="change_status"
          id="change_status"
          value="change_status"
          >Por cambio de estado</BaseRadio
        >
      </div>
      <div class="col-6">
        <BaseRadio
          v-model="config.sendMethod"
          name="periodically"
          id="periodically"
          value="periodically"
          >Periódicamente</BaseRadio
        >
      </div>
    </div>


    <div class="row" v-if="!config.isBoolean">
      <div class="col-12">
        <label class="text-success mt-3 ">{{
          $t("lblturnon {variableFullName}", {
            variableFullName: config.variableFullName
          })
        }}</label>
      </div>

      <div class="col-6">
        <el-select
          required
          class="select-info pull-left"
          :placeholder="$t('selcond')"
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
        <base-input
          v-model.number="config.value"
          :label="$t('lblvalu')"
          type="number"
        >
        </base-input>
      </div>
    </div>

    <!-- <div class="row" v-if="config.isBoolean">
      <div class="col-12">
        <label class="text-success mt-3">{{ $t("lblnotif") }} </label>
        <el-tooltip :content="$t('toolwarn')" :open-delay="300" placement="top"
          ><label class="" for="">⚠️</label></el-tooltip
        >
      </div>

      <div class="col-6 ">
        <base-input
          v-model.trim="config.messageOn"
          :label="$t('lblmesgon')"
          type="text"
        >
        </base-input>
      </div>

      <div class="col-6 ">
        <base-input
          v-model="config.messageOff"
          :label="$t('lblmesgoff')"
          type="text"
        >
        </base-input>
      </div>
    </div> -->

    <div class="row mt-2">
      <div class="col-6">
        <label for="color">Color</label>
        <color-config @color="getColor" :color="config.color"></color-config>
      </div>
      <div class="col-6">
        <label for="color">Icon</label>
        <config-icon @icon="getIcon" :icon="config.icon"></config-icon>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <label for="color">Ancho</label>
        <config-cols @cols="getCols" :column="config.column"></config-cols>
      </div>
    </div>
    <div class="row">
      <div class="col-6">
        <base-button
          :type="getTypeButton"
          @click="addWidget"
          class="mt-3"
          size="lg"
          >{{ textButton }} <i class="fa fa-plus"></i
        ></base-button>
      </div>

      <div class="col-6" v-if="isEdition">
        <base-button
          type="danger"
          @click="cancel"
          class="mt-3 pull-right"
          size="lg"
          >{{ $t("btncan") }}</base-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { Checkbox } from "element-ui";
import { Select, Option, RadioButton } from "element-ui";
import BaseInput from "../../Inputs/BaseInput.vue";
import IotIndicator from "../IotIndicator.vue";
import BaseRadio from "../../Inputs/BaseRadio.vue";
export default {
  props: ["isEdition", "config"],
  components: {
    BaseInput,
    IotIndicator,
    [Checkbox.name]: Checkbox,
    [Checkbox.name]: Checkbox,
    [RadioButton.name]: RadioButton,
    [Option.name]: Option,
    [Select.name]: Select,
    BaseRadio
  },
  data() {
    return {
      isValidForm: true,
      oldConfig: {},
      isCanceled: false,
      inputs: {
        varFullNameValid: true,
        sendFreqValid: true
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

    watchInputs() {
      !this.config.variableFullName
        ? (this.inputs.varFullNameValid = false)
        : (this.inputs.varFullNameValid = true);
      !this.config.variableSendFreq || this.config.variableSendFreq <= 0
        ? (this.inputs.sendFreqValid = false)
        : (this.inputs.sendFreqValid = true);

        if(!this.config.isBoolean && this.config.sendMethod=='change_status'){
          this.config.sendMethod='periodically'
        }
    },

    validateFrom() {
      if (
        !this.config.variableFullName ||
        !this.config.variableSendFreq ||
        this.config.variableSendFreq <= 0
      ) {
        this.isValidForm = false;
        return;
      }

      this.isValidForm = true;
    },
    cancel() {
      this.isCanceled = true;
      this.addWidget();
    },
    addWidget() {
      this.validateFrom();

      if (this.isValidForm) {
        this.$emit("add-widget", {
          widgetConfig: this.config,
          isCanceled: this.isCanceled
        });
      } else {
        this.$emit("add-widget", { isValidForm: false });
      }
      this.isCanceled = false;
    }
  },
  computed: {
    textButton() {
      return this.isEdition ? `${this.$t("btnedit")}` : `${this.$t("btnadd")}`;
    },
    getTypeButton() {
      return this.isEdition ? "success" : "info";
    }
  },

  watch: {
    config: {
      immediate: true,
      deep: true,
      handler() {
        this.watchInputs();
        this.$emit("indicator-config", this.config);
      }
    }
  }
};
</script>
