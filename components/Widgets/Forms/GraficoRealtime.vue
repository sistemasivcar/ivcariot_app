<template>
  <div>
    <div class="row">
      <div class="col-6">
        <base-input
          v-model="config.variableFullName"
          label="Variable Name"
          type="text"
          :class="[
            { 'has-danger': !inputs.varFullName },
            { 'has-success': inputs.varFullName }
          ]"
        >
        </base-input>
      </div>
      <div class="col-6">
        <base-input
          v-model.number="config.chartTimeAgo"
          label="Chart Back Time (minutes)"
          type="number"
          :class="{ 'has-danger': !inputs.chartTimeAgo }"
        ></base-input>
      </div>
    </div>

    <div class="row">
      <div class="col-6">
        <base-input
          v-model="config.unit"
          label="Unit"
          :class="{ 'has-danger': !inputs.unitValidity }"
          type="text"
        >
        </base-input>
      </div>
      <div class="col-6">
        <base-input
          v-model.number="config.decimalPlaces"
          label="Decimal Places"
          type="number"
        >
        </base-input>
      </div>
    </div>

    <div class="row">
      <div class="col-sm-6">
        <base-input
          v-model="config.variableSendFreq"
          label="Update interval (mins)"
          type="number"
          :class="{ 'has-danger': !inputs.variableSendFreq }"
        ></base-input>
      </div>

      <div class="col-sm-6">
        <label for="defaultSerieStyle">Style Series</label>
        <el-select
          label="Serie Style"
          v-model="config.defaultSeriesType"
          @change="getDefaultSeriesType"
          class="select-info"
          placeholder="Select Style"
          style="width: 100%;"
        >
          <el-option class="text-dark" value="line" label="Line"></el-option>
          <el-option
            class="text-dark"
            value="spline"
            label="Spline"
          ></el-option>
          <el-option class="text-dark" value="area" label="Area"></el-option>
          <el-option
            class="text-dark"
            value="scatter"
            label="Scatter"
          ></el-option>
        </el-select>
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
      <div class="col-6">
        <base-button
          :type="getTypeButton"
          @click="addWidget"
          class="mt-3"
          size="lg"
          >{{ textButton }}</base-button
        >
      </div>

      <div class="col-6" v-if="isEdition">
        <base-button
          type="danger"
          @click="cancel"
          class="mt-3 pull-right"
          size="lg"
          >Cancel</base-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { Select, Option } from "element-ui";
export default {
  props: ["isEdition", "config"],
  components: {
    [Option.name]: Option,
    [Select.name]: Select
  },
  data() {
    return {
      isValidForm: true,
      oldConfig: {},
      isCanceled: false,
      inputs: {
        unitValidity: true,
        varFullName: true,
        chartTimeAgo: true,
        variableSendFreq: true
      }
    };
  },
  methods: {
    getColor(value) {
      this.config.class = value;
    },
    getIcon(value) {
      this.config.icon = value;
    },
    getCols(value) {
      this.config.column = value;
    },
    getDefaultSeriesType(value) {
      this.config.defaultSeriesType = value;
    },
    watchInputs() {
      this.config.decimalPlaces > 100 ||
      this.config.decimalPlaces < 0 ||
      this.config.decimalPlaces === ""
        ? (this.config.decimalPlaces = 0)
        : "";
      this.config.decimalPlaces < 0;
      this.config.unit != ""
        ? (this.inputs.unitValidity = true)
        : (this.inputs.unitValidity = false);
      this.config.variableFullName != ""
        ? (this.inputs.varFullName = true)
        : (this.inputs.varFullName = false);
      this.config.variableSendFreq > 0
        ? (this.inputs.variableSendFreq = true)
        : (this.inputs.variableSendFreq = false);
      this.config.chartTimeAgo >= 0
        ? (this.inputs.chartTimeAgo = true)
        : (this.inputs.chartTimeAgo = false);
    },
    validateFrom() {
      if (!this.config.variableFullName) {
        this.isValidForm = false;
        this.inputs.varFullName = false;
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Variable name can not be empty"
        });
        return;
      } else {
        this.isValidForm = true;
        this.inputs.varFullName = true;
      }
      if (!this.config.unit) {
        this.isValidForm = false;
        this.inputs.unitValidity = false;
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Unit can not be empty"
        });
        return;
      } else {
        this.isValidForm = true;
        this.inputs.unitValidity = true;
      }
      if (this.config.chartTimeAgo < 0) {
        this.isValidForm = false;
        this.inputs.chartTimeAgo = false;
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Chart Back Time can not be negative"
        });
        return;
      } else {
        this.isValidForm = true;
        this.inputs.chartTimeAgo = true;
      }
      if (this.config.variableSendFreq <= 0) {
        this.isValidForm = false;
        this.inputs.variableSendFreq = false;
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Update Interval must be grather than zero"
        });
        return;
      } else {
        this.isValidForm = true;
        this.inputs.variableSendFreq = true;
      }
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
          isEdition: this.isEdition,
          cancel: {
            isCanceled: this.isCanceled,
            oldConfig: this.oldConfig
          }
        });
        // actualizo el oldConfig al widget si no se canceló y lo devuelvo
        if (!this.isCanceled) this.oldConfig = this.config;

        // piso los ultimos cambios por lo que habia antes (para FORM && WIDGET PREVIEW)
        if (this.isCanceled) this.$emit("numberchart-config", this.oldConfig);
      } else {
        this.$emit("add-widget", false);
      }
      this.isCanceled = false;
    }
  },
  computed: {
    textButton() {
      return this.isEdition ? "Accept" : "Add";
    },
    getTypeButton() {
      return this.isEdition ? "success" : "info";
    }
  },
  mounted() {
    this.oldConfig = this.config;
  },
  watch: {
    config: {
      immediate: true,
      deep: true,
      handler() {
        this.watchInputs();

        this.$emit("numberchart-config", this.config);
      }
    }
  }
};
</script>
