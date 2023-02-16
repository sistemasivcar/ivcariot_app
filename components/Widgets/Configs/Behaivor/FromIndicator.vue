<template>
  <base-input
    v-model="variableFullName"
    label="Var Name"
    type="text"
    @blur="validVarFullName"
  >
  </base-input>
</template>

<script>
export default {
  data() {
    return {
      variableFullName: "Alarm status"
    };
  },
  methods: {
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
    }
  }
};
</script>
