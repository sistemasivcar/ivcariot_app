<template>
  <div>
    <div class="row">
      <div class="col-12">
        <base-input
          v-model="config.variableFullName"
          label="Var Name"
          type="text"
        >
        </base-input>
      </div>
    </div>

    <div class="row">
      <div class="col-6">
        <base-input v-model="config.text" label="Button Text" type="text">
        </base-input>
      </div>
      <div class="col-6">
        <base-input
          v-model="config.message"
          label="Message to send"
          type="text"
        >
        </base-input>
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
export default {
  data() {
    return {
      isValidFrom: true,
      config: {
        selectedDevice: {
          name: "Home",
          dId: "dummy-device-id"
        },
        variableFullName: "Pump",
        variableType: "output",
        text: "ON",
        message: "on",
        widgetName: "button",
        colorButton: "success",
        icon: "fa-home",
        column: "col-6"
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
    validateFrom(){

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
        this.$emit("button-config", this.config);
      }
    }
  }
};
</script>
