<template>
    <el-select
                v-model="icon"
                class="select-info"
                placeholder="Select Icon"
                style="width: 100%;"
              >
                <el-option value="fa-sun" class="text-info" label="Sun">
                </el-option>

                <el-option value="fa-bath" class="text-info" label="Bath">
                </el-option>
                <el-option value="fa-male" class="text-info" label="Male">
                </el-option>

                <el-option value="fa-home" class="text-info" label="Home">
                </el-option>
                <el-option
                  value="fa-lightbulb"
                  class="text-info"
                  label="Lightbulb"
                >
                </el-option>
                <el-option value="fa-key" class="text-info" label="Key">
                </el-option>
                <el-option value="fa-tint" class="text-info" label="Tint">
                </el-option>
                <el-option
                  value="fa-bullhorn"
                  class="text-info"
                  label="Bullhorn"
                >
                </el-option>
                <el-option value="fa-bell" class="text-info" label="Bell">
                </el-option>
                <el-option value="fa-unlock" class="text-info" label="Unlock">
                </el-option>
                <el-option value="fa-lock" class="text-info" label="Lock">
                </el-option>
                <el-option value="fa-bolt" class="text-info" label="Bolt">
                </el-option>
              </el-select>
</template>


<script>
import { Select, Option } from "element-ui";
export default {
  components: {
    [Option.name]: Option,
    [Select.name]: Select
  },
  data() {
    return {
      icon: null
    };
  },
  watch: {
    icon(value) {
      this.$emit("icon", value);
    }
  }
};
</script>