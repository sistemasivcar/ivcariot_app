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
          v-model.number="config.chartTimeAgo"
          label="Chart Back Time (minutes)"
          type="number"
        ></base-input>
      </div>
    </div>

    <div class="row">
      <div class="col-6">
        <base-input v-model="config.unit" label="Unit" type="text">
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
          label="Send Frequency (minutes)"
          type="number"
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
      <div class="col-12">
        <base-button type="info" @click="addWidget" class="mt-3" size="lg"
          >Add</base-button
        >
      </div>
    </div>
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
      isValidForm: true,
      config: {
        selectedDevice: {
          name: "Home",
          dId: "dummy-device-id"
        },
        variableFullName: "temperature",
        variableType: "input",
        variableSendFreq: "5",
        unit: "ºC",
        class: "success",
        column: "col-6",
        decimalPlaces: 2,
        widgetName: "numberchart",
        icon: "fa-thermometer",
        defaultSeriesType: "line",
        chartTimeAgo: 120,
        demo: true
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
        this.$emit("numberchart-config", this.config);
      }
    }
  },
  created() {}
};
</script>
