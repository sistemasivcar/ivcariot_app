<template>
  <div>
    <card v-if="!hasDevices">
      You need first create a device to create an Alarm
    </card>

    <card v-else-if="!hasSelectedDevice">
      You need to select a device to create an Alarm
    </card>

    <div class="row" v-else>
      <div class="col-sm-12">
        <card>
          <div slot="header">
            <h4 class="card-title">
              Create new Alarm Rule:
              <strong>{{ hasSelectedDevice.name.toUpperCase() }}</strong>
            </h4>
          </div>

          <div class="row">
            <div class="col-3">
              <el-select
                required
                class="select-success"
                placeholder="Variable"
                v-model="selectedWidgetIndex"
                style="margin-top: 25px;"
              >
                <el-option
                  v-for="(widget, index) in widgets"
                  :key="index"
                  class="text-dark"
                  :value="index"
                  :label="widget.variableFullName"
                ></el-option>
              </el-select>
            </div>

            <div class="col-3">
              <el-select
                required
                class="select-warning"
                placeholder="Condition"
                v-model="newRule.condition"
                style="margin-top: 25px;"
              >
                <el-option class="text-dark" value="=" label="="></el-option>
                <el-option class="text-dark" value=">" label=">"></el-option>
                <el-option class="text-dark" value=">=" label=">="></el-option>
                <el-option class="text-dark" value="<" label="<"></el-option>
                <el-option class="text-dark" value="<=" label="<="></el-option>
                <el-option class="text-dark" value="!=" label="!="></el-option>
              </el-select>
            </div>

            <div class="col-3">
              <base-input
                label="Value"
                v-model="newRule.value"
                type="number"
              ></base-input>
            </div>

            <div class="col-3">
              <base-input
                label="Trigger Time"
                v-model="newRule.triggerTime"
                type="number"
              ></base-input>
            </div>
          </div>
          <br /><br />
          <div class="row pull-right">
            <div class="col-12">
              <base-button
                @click="createNewRule()"
                native-type="submit"
                type="info"
                class="mb-3"
                size="lg"
              >
                Add Alarm Rule
              </base-button>
            </div>
          </div>
        </card>
      </div>
    </div>

    <div class="row">
      <div class="col-sm-12">
        <card>
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

            <el-table-column prop="variable" label="Variable"></el-table-column>

            <el-table-column
              prop="condition"
              label="Condition"
            ></el-table-column>

            <el-table-column prop="value" label="Value"></el-table-column>

            <el-table-column
              prop="triggerTime"
              label="Trigger Time"
            ></el-table-column>

            <el-table-column prop="counter" label="Matches"></el-table-column>

            <el-table-column header-align="right" align="right" label="Actions">
              <div
                slot-scope="{ row, $index }"
                class="text-right table-actions"
              >
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

          <h4 v-else class="card-title">No Alarm Rules</h4>
        </card>
      </div>
    </div>
  </div>
</template>

<script>
import { Table, TableColumn } from "element-ui";
import { Select, Option } from "element-ui";
import Card from "../../components/Cards/Card.vue";
import { BaseSwitch } from "@/components";

export default {
  middleware: "authtenticated",
  components: {
    Card,
    BaseSwitch,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Option.name]: Option,
    [Select.name]: Select
  },
  data() {
    return {
      newRule: {
        dId: null,
        status: null,
        variableFullName: null,
        variable: null,
        value: null,
        condition: null,
        triggerTime: null
      },
      selectedWidgetIndex: null
    };
  },
  async mounted() {
    await this.getDevices();
  },
  computed: {
    hasAlarmRules() {
      return this.$store.getters["devices/hasAlarmRules"];
    },
    alarmRules() {
      return this.$store.getters["devices/getAlarmRulesSelectedDevice"];
    },

    widgets() {
      return this.$store.getters["devices/getWidgetsSelectedDevice"];
    },
    hasSelectedDevice() {
      //retorna el objeto device seleccionado
      return this.$store.getters["devices/getSelDevice"];
    },
    hasDevices() {
      return this.$store.getters["devices/hasDevices"];
    }
  },
  methods: {
    async getDevices() {
      try {
        await this.$store.dispatch("devices/fetchDevices");
      } catch (e) {
        this.$notify({
          type: "danger",
          icon: "tim-icons icon-alert-circle-exc",
          message: e
        });
      }
    },
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
          message: 'Fail deleting rule'
        });
      }
    },

    async createNewRule() {
      if (this.selectedWidgetIndex == null) {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: " Variable must be selected"
        });
        return;
      }
      if (this.newRule.condition == null) {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: " Condition must be selected"
        });
        return;
      }
      if (this.newRule.value == null) {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: " Value is empty"
        });
        return;
      }
      if (this.newRule.triggerTime == null) {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: " Trigger Time is empty"
        });
        return;
      }

      const variableFullName = this.widgets[this.selectedWidgetIndex]
        .variableFullName;
      const dId = this.hasSelectedDevice.dId;
      const variable = this.widgets[this.selectedWidgetIndex].variable;
      const newRule = {
        ...this.newRule,
        variableFullName,
        variable,
        dId
      };

      try {
        await this.$store.dispatch("devices/crateAlarmRule", newRule);
        await this.$store.dispatch("devices/fetchDevices");
        this.$notify({
          type: "success",
          icon: "tim-icons icon-check-2",
          message: `Alarm rule created!`
        });
      } catch (e) {
        this.$notify({
          type: "danger",
          icon: "tim-icons icon-alert-circle-exc",
          message: e
        });
      }
    }
  }
};
</script>
