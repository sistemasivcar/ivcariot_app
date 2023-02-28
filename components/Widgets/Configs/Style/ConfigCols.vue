<template>
    <el-select
                v-model="column"
                class="select-info"
                placeholder="Select Column Width"
                style="width: 100%;"
              >

               <el-option
                  class="text-dark"
                  value="col-md-4"
                  label="Small"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-md-6"
                  label="Medium"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-md-12"
                  label="Big"
                ></el-option>
    </el-select>
<!--                 <el-option
                  class="text-dark"
                  value="col-3"
                  label="col-3"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-4"
                  label="col-4"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-5"
                  label="col-5"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-6"
                  label="col-6"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-7"
                  label="col-7"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-8"
                  label="col-8"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-9"
                  label="col-9"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-10"
                  label="col-10"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-11"
                  label="col-11"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-12"
                  label="col-12"
                ></el-option>
              </el-select> -->
</template>

<script>
import { Select, Option } from "element-ui";
export default {
  props:['column'],
  components: {
    [Option.name]: Option,
    [Select.name]: Select
  },
  watch: {
    column(value) {
      this.$emit("cols", value);
    }
  }
};
</script>