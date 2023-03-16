<template>
  <el-select
    v-model="icon"
    class="select-info"
    placeholder="Select Icon"
    style="width: 100%;"
  >

  <el-option value="fa fa-person-rays" class="text-info" label="persona"> </el-option>
  <el-option value="fa fa-bug" class="text-info" label="Bug"> </el-option>
  <el-option value="fa fa-tree" class="text-info" label="Árbol"> </el-option>
  <el-option value="fa fa-child" class="text-info" label="Saludo"> </el-option>
    <el-option value="fa fa-door-open" class="text-info" label="Puerta Abierta"></el-option>
    <el-option value="fa fa-sun" class="text-info" :label="$t('icons.sun')"> </el-option>
    <el-option value="fa fa-fire" class="text-info" label="Llamas"> </el-option>
    <el-option value="fa fa-shower" class="text-info" label="Riego"> </el-option>
    <el-option value="fa fa-male" class="text-info" :label="$t('icons.person')"> </el-option>
    <el-option value="fa fa-home" class="text-info" :label="$t('icons.home')"></el-option>
    <el-option value="fa fa-lightbulb" class="text-info" :label="$t('icons.light')"> </el-option>
    <el-option value="fa fa-tint" class="text-info" :label="$t('icons.tint')"> </el-option>
    <el-option value="fa fa-thermometer-half" class="text-info" :label="$t('icons.thermometer')"> </el-option>
    <el-option value="fa fa-cloud" class="text-info" :label="$t('icons.cloud')"> </el-option>
    <el-option value="fa fa-bullhorn" class="text-info" :label="$t('icons.sirena')"></el-option>
    <el-option value="fa fa-bell" class="text-info" :label="$t('icons.bell')"> </el-option>
    <el-option value="fa fa-lock-open" class="text-info" :label="$t('icons.unlock')"> </el-option>
    <el-option value="fa fa-lock" class="text-info" :label="$t('icons.lock')"> </el-option>
    <el-option value="fa fa-bolt" class="text-info" :label="$t('icons.bolt')"> </el-option>
 
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
