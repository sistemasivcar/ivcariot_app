<template>
  <div>
    <div class="row">
      <div class="col-6">
        <base-input
          v-model="variableFullName"
          @blur="validVarFullName"
          label="Var Name"
          type="text"
        >
        </base-input>
      </div>
      <div class="col-6">
        <base-input
          v-model.number="chartTimeAgo"
          label="Chart Back Time (minutes)"
          type="number"
        ></base-input>
      </div>
    </div>

    <div class="row">
      <div class="col-6">
        <base-input v-model="unit" label="Unit" type="text"> </base-input>
      </div>
      <div class="col-6">
        <base-input
          v-model.number="decimalPlaces"
          label="Decimal Places"
          type="number"
        >
        </base-input>
      </div>
    </div>

    <div class="row">
      <div class="col-sm-6">
        <base-input
          v-model.trim="sendFrequency"
          label="Send Frequency (minutes)"
          type="number"
        ></base-input>
      </div>

      <div class="col-sm-6">
        <label for="defaultSerieStyle">Style Series</label>
        <el-select
          label="Serie Style"
          v-model="defaultSeriesType"
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
  </div>
</template>

<script>
import BaseCheckbox from "../../../Inputs/BaseCheckbox.vue";
import { Select, Option } from "element-ui";
export default {
  components: {
    BaseCheckbox,
    [Option.name]: Option,
    [Select.name]: Select
  },
  data() {
    return {
      variableFullName: "temparature",
      chartTimeAgo: 120,
      unit: "ºC",
      decimalPlaces: 2,
      sendFrequency: 5,
      defaultSeriesType: "line"
    };
  },
  methods: {
    getDefaultSeriesType() {
      this.$emit("default-series-type", this.defaultSeriesType);
    },
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
    decimalPlaces(value) {
      if (value < 0) {
        this.decimalPlaces = 0;
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Decimal Places must be >= 0"
        });
      } else if (value > 5) {
        this.decimalPlaces = 5;
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Decimal Places must be <= 5"
        });
      } else {
        this.$emit("decimal-places", value);
      }
    },
    chartTimeAgo(value) {
      if (value < 0) {
        this.chartTimeAgo = 0;
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Chart Time Ago must be >= 0"
        });
      } else {
        this.$emit("chart-time-ago", value);
      }
    },
    sendFrequency(value) {
      if (value <= 0) {
        this.sendFrequency = 1;
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Send Frequency must be > 0"
        });
      } else {
        this.$emit("send-freq", value);
      }
    },
    unit(value) {
      this.$emit("unit", value);
    }
  }
};
</script>
