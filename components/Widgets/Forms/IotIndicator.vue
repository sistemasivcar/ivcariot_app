<template>
  <div>
    <div class="row">
      <div class="col-6">
        <base-input
          v-model="config.variableFullName"
          label="Variable Name"
          type="text"
          :class="[{'has-danger':!inputs.varFullNameValid}]"
        >
        </base-input>
      </div>

      <div class="col-6">
        <base-input
          v-model="config.variableSendFreq"
          label="Update interval (mins)"
          type="number"
          :class="[{'has-danger':!inputs.sendFreqValid}]"
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
        <base-input v-model.number="config.value" label="Value:" type="number">
        </base-input>
      </div>
    </div>

    <div class="row" v-if="config.isBoolean">
      <div class="col-12">
        <label class="text-success mt-3"
          >For status change notifications:
        </label>
        <el-tooltip
          content="This is optional and apart from the alarm rules that you can create later.
           If you dont want to recive this notifications, empty these filed"
          :open-delay="300"
          placement="top"
          ><label class="" for="">⚠️</label></el-tooltip
        >
      </div>

      <div class="col-6 ">
        <base-input
          v-model.trim="config.messageOn"
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
        <base-button :type="getTypeButton" @click="addWidget" class="mt-3" size="lg"
          >{{textButton}}</base-button>
      </div>

      <div class="col-6" v-if="isEdition">
        <base-button type="danger" @click="cancel" class="mt-3 pull-right" size="lg"
          >Cancel</base-button>
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

  props:['isEdition','config'],
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
      oldConfig: {},
      isCanceled: false,
      inputs:{
        varFullNameValid:true,
        sendFreqValid:true
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

    watchInputs(){
      !this.config.variableFullName ? this.inputs.varFullNameValid=false : this.inputs.varFullNameValid=true;
      !this.config.variableSendFreq  || this.config.variableSendFreq <= 0 ? this.inputs.sendFreqValid=false : this.inputs.sendFreqValid=true;

    },

    validateFrom() {
      if(!this.config.variableFullName||!this.config.variableSendFreq  || this.config.variableSendFreq <= 0){
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

      if (!this.isValidForm) {
        //
        return;
      }
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
        if(!this.isCanceled) this.oldConfig = this.config;
        
        // piso los ultimos cambios por lo que habia antes (para FORM && WIDGET PREVIEW)
        if(this.isCanceled) this.$emit("indicator-config", this.oldConfig); 
      
      } else {
        this.$emit("add-widget", false);
      }
      this.isCanceled = false;
    }
  },
  computed:{
    textButton() {
      return this.isEdition ? "Accept" : "Add";
    },
    getTypeButton(){
      return this.isEdition ? 'success' : 'info'
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
        this.$emit("indicator-config", this.config);
      }
    }
  }
};
</script>
