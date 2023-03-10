<template>
  <div>
    <base-input
      v-model="variableFullName"
      label="Var Name"
      type="text"
      @blur="validVarFullName"
    >
    </base-input>

    <div class="row">
      <div class="col-6">
        <base-input
          v-model="text"
          label="Button Text"
          type="text"
          @blur="validarBtnText"
        >
        </base-input>
      </div>
      <div class="col-6">
        <base-input
          v-model="message"
          label="Message to send"
          type="text"
          @blur="validarMessage"
        >
        </base-input>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <label for="retain">Mensaje Retenido:</label>
      </div>
    </div>

    <div class="row">
      <div class="col-6">
        
      </div>

      <div class="col-6">
        
      </div>
    </div>


  </div>
</template>

<script>
export default {
  data() {
    return {
      variableFullName: "Pump",
      text: "ON",
      message: "on"
    };
  },
  methods: {
    validarBtnText() {
      if (!this.text) {
        this.text = "my text";
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Text button can not be empty"
        });
      }
    },
    validarMessage() {
      if (!this.message) {
        this.message = "send123";
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Message can not be empty"
        });
      }
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
    message(value) {
      this.$emit("message", value);
    },
    text(value) {
      this.$emit("text", value);
    }
  }
};
</script>
