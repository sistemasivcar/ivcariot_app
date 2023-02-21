<template>
  <div>
    <div class="row">
      <div class="col-6">
        <base-input
          v-model="config.variableFullName"
          label="Variable Name"
          type="text"
          :class="[
            { 'has-danger': !inputs.varFullNameValid },
  
          ]"
        >
        </base-input>
      </div>
      <div class="col-6">
        <base-input
          v-model.number="config.chartTimeAgo"
          label="Chart Back Time (minutes)"
          type="number"
          :class="{ 'has-danger': !inputs.chartTimeAgoValid }"
        ></base-input>
      </div>
    </div>

    <div class="row">
      <div class="col-6">
        <base-input
          v-model="config.unit"
          label="Unit"
          :class="{ 'has-danger': !inputs.unitValid }"
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
          :class="{ 'has-danger': !inputs.sendFreqValid }"
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
        <color-config @color="getColor" :color="config.class"></color-config>
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
  props: ["isEdition","config"],
  components: {
    [Option.name]: Option,
    [Select.name]: Select
  },
  data() {
    return {
      isValidForm: true,
      
      isCanceled: false,
      inputs: {
        unitValid: true,
        varFullNameValid: true,
        chartTimeAgoValid: true,
        sendFreqValid: true
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

      !this.config.variableFullName ? this.inputs.varFullNameValid=false : this.inputs.varFullNameValid=true;
      !this.config.unit ? this.inputs.unitValid=false : this.inputs.unitValid=true;
      !this.config.chartTimeAgo || this.config.chartTimeAgo < 0 ? this.inputs.chartTimeAgoValid=false : this.inputs.chartTimeAgoValid=true;
      !this.config.variableSendFreq  || this.config.variableSendFreq <= 0 ? this.inputs.sendFreqValid=false : this.inputs.sendFreqValid=true;

      if(this.config.decimalPlaces < 0) this.config.decimalPlaces=0;
      if(this.config.decimalPlaces > 100) this.config.decimalPlaces=100;

      
    },
    validateFrom() {

      if( !this.config.variableFullName || !this.config.unit ||  !this.config.chartTimeAgo || 
      this.config.chartTimeAgo < 0 || !this.config.variableSendFreq  || this.config.variableSendFreq <= 0){
        this.isValidForm=false;
        return;
      }
      
      this.isValidForm=true;
      

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
        this.$emit("add-widget", {isValidForm:false});
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
