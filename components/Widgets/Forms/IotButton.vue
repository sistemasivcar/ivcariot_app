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
      isCanceled: false
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
    validateFrom() {},
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
        if(!this.isCanceled) this.oldConfig = this.config;
        
        // piso los ultimos cambios por lo que habia antes (para FORM && WIDGET PREVIEW)
        if(this.isCanceled) this.$emit("button-config", this.oldConfig); 
      
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
        this.$emit("button-config", this.config);
      }
    }
  }
};
</script>
