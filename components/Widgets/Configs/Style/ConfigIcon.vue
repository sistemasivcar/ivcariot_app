<template>
  <el-select
    v-model="icon"
    class="select-info"
    placeholder="Select Icon"
    style="width: 100%;"
  >
    <el-option value="fa-sun" class="text-info" :label="$t('icons.sun')"> </el-option>
    <el-option value="fa-bath" class="text-info" :label="$t('icons.bath')"> </el-option>
    <el-option value="fa-person" class="text-info" :label="$t('icons.person')"> </el-option>
    <el-option value="fa-home" class="text-info" :label="$t('icons.home')"></el-option>
    <el-option value="fa-lightbulb" class="text-info" :label="$t('icons.light')"> </el-option>
    <el-option value="fa-tint" class="text-info" :label="$t('icons.tint')"> </el-option>
    <el-option value="fa-thermometer" class="text-info" :label="$t('icons.thermometer')"> </el-option>
    <el-option value="fa-cloud" class="text-info" :label="$t('icons.cloud')"> </el-option>
    <el-option value="fa-bullhorn" class="text-info" :label="$t('icons.sirena')"></el-option>
    <el-option value="fa-bell" class="text-info" :label="$t('icons.bell')"> </el-option>
    <el-option value="fa-unlock" class="text-info" :label="$t('icons.unlock')"> </el-option>
    <el-option value="fa-lock" class="text-info" :label="$t('icons.lock')"> </el-option>
    <el-option value="fa-bolt" class="text-info" :label="$t('icons.bolt')"> </el-option>
   
  </el-select>
</template>

<script>
import { Select, Option } from "element-ui";
export default {
  props:['icon'],
  components: {
    [Option.name]: Option,
    [Select.name]: Select
  },

  watch: {
    icon(value) {
      this.$emit("icon", value);
    }
  },

};
</script>
