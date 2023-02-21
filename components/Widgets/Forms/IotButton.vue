<template>
  <div>
    <div class="row">
      <div class="col-12">
        <base-input
          v-model="config.variableFullName"
          label="Var Name"
          type="text"
          :class="{'has-danger': !inputs.varFullNameValid}"
        >
        </base-input>
      </div>
    </div>

    <div class="row">
      <div class="col-6">
        <base-input v-model="config.text" label="Button Text" type="text" :class="{'has-danger': !inputs.textValid}">
        </base-input>
      </div>
      <div class="col-6">
        <base-input
          v-model="config.message"
          label="Message to send"
          type="text"
          :class="{'has-danger': !inputs.messageValid}"
        >
        </base-input>
      </div>
    </div>

    <div class="row">
      <div class="col-6">
        <label for="color">Color</label>
        <color-config @color="getColor" :color="config.colorButton"></color-config>
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
        <base-button type="danger" @click="cancel" class="mt-3 pull-right" size="lg"
          >Cancel</base-button
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["isEdition", "config"],
  data() {
    return {
      isValidForm: true,
      oldConfig: {},
      isCanceled: false,
      inputs:{
        varFullNameValid:true,
        textValid:true,
        messageValid:true,
      }
    };
  },
  methods: {
    getColor(value) {
      this.config.colorButton = value;
    },
    getIcon(value) {
      this.config.icon = value;
    },
    getCols(value) {
      this.config.column = value;
    },
    watchInputs(){
      !this.config.text ? this.inputs.textValid=false : this.inputs.textValid=true; 

      !this.config.message ? this.inputs.messageValid=false : this.inputs.messageValid=true;

      !this.config.variableFullName ? this.inputs.varFullNameValid=false : this.inputs.varFullNameValid=true;

    },
    validateFrom() {
      if(!this.config.text || !this.config.message || !this.config.variableFullName) {
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
          isCanceled: this.isCanceled,
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
        this.watchInputs()
        this.$emit("button-config", this.config);
      }
    }
  }
};
</script>
