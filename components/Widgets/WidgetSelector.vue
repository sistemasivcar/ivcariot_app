<template>

    <el-select
      @change="handleChange"
      class="select-info mb-3"
      v-model="widgetSelected"
      :placeholder="$t('selectwidget')"
      style="width: 100%;"
    >
      <el-option
        class="text-dark"
        value="numberchart"
        :label="$t('widchart')"
      >
      </el-option>
      <el-option class="text-dark" value="indicator" :label="$t('widindicator')">
      </el-option>
      <el-option class="text-dark" value="map_" label="Switch (Prox)"></el-option>
      <el-option class="text-dark" value="switch_" label="Geo-posicionamiento (Prox)"></el-option>
      <el-option class="text-dark" value="button" :label="$t('widbutton')"></el-option>
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
