<template>

    <el-select
      @change="handleChange"
      class="select-info mb-3"
      v-model="widgetSelected"
      placeholder="Select Widget to Add"
      style="width: 100%;"
    >
      <el-option
        class="text-dark"
        value="numberchart"
        label="Realtime number chart"
      >
      </el-option>
      <el-option class="text-dark" value="indicator" label="Indicator">
      </el-option>
      <el-option class="text-dark" value="switch" label="Switch "></el-option>
      <el-option class="text-dark" value="button" label="Button "></el-option>
    </el-select>
  
</template>

<script>
import Card from "../Cards/Card.vue";
import { Select, Option } from "element-ui";
export default {
  props:['widgetSelected'],
  components: {
    Card,
    [Option.name]: Option,
    [Select.name]: Select
  },
  data() {
    return {
    };
  },
  methods: {
    handleChange(value) {
      this.$emit("selected-widget", value);
    }
  }
};
</script>
