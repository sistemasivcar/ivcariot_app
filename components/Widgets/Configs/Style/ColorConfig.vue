<template>
  <el-select
    v-model="color"
    class="select-info"
    placeholder="Select Color"
    style="width: 100%;"
  >
    <el-option class="text-success" value="success" label="Verde"></el-option>
    <el-option class="text-danger" value="danger" label="Rojo"></el-option>
    <el-option class="text-info" value="info" label="Azul"></el-option>
    <el-option class="text-primary" value="primary" label="Magenta"></el-option>
    <el-option class="text-warning" value="warning" label="Naranja"></el-option>
  </el-select>
</template>

<script>
import { Select, Option } from "element-ui";
export default {
  props:['color'],
  components: {
    [Option.name]: Option,
    [Select.name]: Select
  },

  watch: {
    color(value) {
      this.$emit("color", value);
    }
  },

};
</script>
