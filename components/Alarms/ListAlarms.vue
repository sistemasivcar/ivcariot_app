<template>
  <div class="row">
    <div class="col-sm-12">
      <card v-if="hasSelectedDevice!==null"
      title="Alarm Rules"
      :subTitle="'The list of alarm rules belonging to ' + hasSelectedDevice.name.toUpperCase() +' device'">
        
        <el-table v-if="hasAlarmRules" :data="alarmRules">
          <el-table-column min-width="50" label="#" align="center">
            <div class="photo" slot-scope="{ row, $index }">
              {{ $index + 1 }}
            </div>
          </el-table-column>

          <el-table-column
            prop="variableFullName"
            label="Var Name"
          ></el-table-column>

          <el-table-column prop="message" label="Message"></el-table-column>

          <el-table-column prop="condition" label="Condition"></el-table-column>

          <el-table-column prop="value" label="Value"></el-table-column>

          <el-table-column
            prop="triggerTime"
            label="Trigger Time"
          ></el-table-column>

          <el-table-column prop="counter" label="Matches"></el-table-column>

          <el-table-column header-align="right" align="right" label="Actions">
            <div slot-scope="{ row, $index }" class="text-right table-actions">
              <el-tooltip content="Delete" effect="light" placement="top">
                <base-button
                  @click="deleteAlarmRule(row)"
                  type="danger"
                  icon
                  size="sm"
                  class="btn-link"
                >
                  <i class="tim-icons icon-simple-remove "></i>
                </base-button>
              </el-tooltip>

              <el-tooltip content="Rule Status" style="margin-left: 20px;">
                <i
                  class="fas fa-exclamation-triangle"
                  :class="{ 'text-warning': row.status }"
                ></i>
              </el-tooltip>

              <!-- no ato row.status al v model porque al cambiar de status cambiaria directo sobre store lo que daría error en 
                      cambio uso el value, al accionar el switch no cambiará el objeto, pero podré cambiar el valor en la función -->
              <el-tooltip
                content="Change Rule Status"
                style="margin-left: 5px;"
              >
                <base-switch
                  @click="updateAlarmRuleStatus(row)"
                  :value="row.status"
                  type="primary"
                  on-text="ON"
                  off-text="OFF"
                  style="margin-top: 10px;"
                ></base-switch>
              </el-tooltip>
            </div>
          </el-table-column>
        </el-table>

        <h4
          v-else-if="!hasAlarmRules && hasDevices && hasSelectedDevice"
          class="card-title"
        >
          No Alarm Rules
        </h4>
      </card>
    </div>
  </div>
</template>

<script>
import { Table, TableColumn } from "element-ui";
import BaseSwitch from "../../components/BaseSwitch.vue";
import { BaseSwitch2 } from "@/components";
import Modal from "../../components/Modal.vue";

export default {
  components: {
    BaseSwitch,
    BaseSwitch2,
    Modal,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn
  },
  data() {
    return {};
  },
  methods: {
    async updateAlarmRuleStatus(rule) {
      try {
        const token = this.$store.getters["auth/getToken"];
        const newStatus = !rule.status;

        const toSend = {
          emqxRuleId: rule.emqxRuleId,
          status: newStatus
        };
        const axiosHeader = {
          headers: {
            "x-auth-token": token
          }
        };

        const res = await this.$axios.put("/alarm", toSend, axiosHeader);
        if (res.data.status == "success") {
          await this.$store.dispatch("devices/fetchDevices");

          this.$notify({
            type: "success",
            icon: "tim-icons icon-check-2",
            message: `Rule ${newStatus == true ? "ON" : "OFF"}!`
          });
        }
      } catch (e) {
        console.log(e);
        this.$notify({
          type: "danger",
          icon: "tim-icons icon-alert-circle-exc",
          message: e
        });
      }
    },
    async deleteAlarmRule(rule) {
      const token = this.$store.getters["auth/getToken"];
      const axiosHeader = {
        headers: {
          "x-auth-token": token
        },
        params: {
          emqxRuleId: rule.emqxRuleId
        }
      };

      const res = await this.$axios.delete("/alarm", axiosHeader);
      try {
        if (res.data.status == "success") {
          await this.$store.dispatch("devices/fetchDevices");

          this.$notify({
            type: "success",
            icon: "tim-icons icon-check-2",
            message: `Rule deleted!`
          });
        }
      } catch (e) {
        console.log(e);
        this.$notify({
          type: "danger",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Fail deleting rule"
        });
      }
    }
  },
  computed: {
    alarmRules() {
      return this.$store.getters["devices/getAlarmRulesSelectedDevice"];
    },
    hasAlarmRules() {
      return this.$store.getters["devices/hasAlarmRules"];
    },

    hasSelectedDevice() {
      return this.$store.getters["devices/getSelectedDevice"];
    },
    hasDevices() {
      return this.$store.getters["devices/hasDevices"];
    }
  },
  created() {}
};
</script>
