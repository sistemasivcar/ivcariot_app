<template>
  <div>
    <div class="row">
      <div class="col-sm-12">
        <card v-if="hasSelectedDevice!==null"
        :title="$t('listalarms')"
        :subTitle="$t('sublistalarms {selectedDevice}',{selectedDevice:hasSelectedDevice.name.toUpperCase()})">
    
          <el-table v-if="hasAlarmRules" :data="alarmRules" >
            <el-table-column min-width="50" label="#" align="center">
              <div class="photo" slot-scope="{ row, $index }">
                {{ $index + 1 }}
              </div>
            </el-table-column>
            <el-table-column
              prop="variableFullName"
              label="Var Name"
            ></el-table-column>
            <el-table-column prop="condition" label="Condition">
              <div slot-scope="{ row, $index }">
                {{ row.condition || '=' }}
              </div>
            </el-table-column>
            <el-table-column prop="value" label="Value">
              <div slot-scope="{ row, $index }">
                {{ (row.value || row.value==0) ? row.value : '0/1'}}
              </div>
            </el-table-column>
            <el-table-column prop="message" label="Message/s">

              <div slot-scope="{ row, $index }">
                {{ row.message }}
                {{ row.messageOn }} -
                {{ row.messageOff }}
              </div>
            
            </el-table-column>
            <el-table-column prop="triggerTime" label="Trigger Time">
              <div slot-scope="{ row, $index }">
                {{ row.triggerTime || 'cada cambio'}}
              </div>
            </el-table-column>
            <el-table-column prop="counter" label="Matches"></el-table-column>

            <el-table-column header-align="right" label="Actions">
              <div slot-scope="{ row, $index }" class="text-right table-actions">
                <!-- <el-tooltip content="Ver/Editar" effect="light" placement="top">
                  <base-button
                    @click="openModalAlarmRule(row)"
                    type="warning"
                    icon
                    size="sm"
                    class="btn-link"
                  >
                    <i class="tim-icons icon-settings"></i>
                  </base-button>
                </el-tooltip> -->
                <el-tooltip :content="$t('tooldelete')" effect="light" placement="top">
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
                <el-tooltip :content="$t('toolstatus')" style="margin-left: 20px;">
                  <i
                    class="fas fa-exclamation-triangle"
                    :class="{ 'text-warning': row.status }"
                  ></i>
                </el-tooltip>
                <!-- no ato row.status al v model porque al cambiar de status cambiaria directo sobre store lo que daría error en
                        cambio uso el value, al accionar el switch no cambiará el objeto, pero podré cambiar el valor en la función -->
                <el-tooltip
                :content="$t('toolswitch')"
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
    
          </h4>
        </card>
      </div>
    </div>
    <Modal @close="closeModalAlarm" :animationDuration="1000" :show="isModalOpen" :centered="true" :appendToBody="true" gradient="">
      <template name="header">
        Alarma de variable: <strong> {{ alarmRule.variableFullName }} </strong>
      </template>

      <div class="row" v-if="alarmRule.type=='regular'">
        <div class="col-12">
          <p style="color: black;">Condición</p>
        </div>
      </div>
      
      <div class="row">
            
            <div class="col-12 col-md-12">
              <el-select
                v-if="alarmRule.type=='regular'"
                :textdark="true"
                class="select-dark mb-2"
                :placeholder="$t('selcondition')"
                v-model="alarmRule.condition"
                style="width:100%; color: black;"
              >
                <el-option class="text-dark" value="=" label="="></el-option>
                <el-option class="text-dark" value=">" label=">"></el-option>
                <el-option class="text-dark" value=">=" label=">="></el-option>
                <el-option class="text-dark" value="<" label="<"></el-option>
                <el-option class="text-dark" value="<=" label="<="></el-option>
                <el-option class="text-dark" value="!=" label="!="></el-option>
              </el-select>
            </div>

            <div class="col-12 col-md-12">
              <base-input
                v-if="alarmRule.type=='regular'"
                :label="$t('inpvalue')"
                :textdark="true"
                style="color: black;"
                v-model="alarmRule.value"
                type="number"
              ></base-input>
            </div>

            <div class="col-12 col-12-md mt-1 mb-1" v-if="alarmRule.type=='change'">
              <p>Configuraste esta variable como booleana y el dispositivo la envía por cada cambio de estado. Ahora podés ingresar qué mensajes querés recibir según cada estado de la variable.</p>
            </div>
          </div>

          <div class="row">
            <div class="col-12 col-md-12">
              <base-input
              v-if="alarmRule.type=='change'"
                v-model.trim="alarmRule.messageOn"
                :label="$t('lblmesgon')"
                style="color: black;"
                :textdark="true"
                type="text"
              >
              </base-input>
            </div>
            <div class="col-12 col-md-12">
              <base-input
              v-if="alarmRule.type=='change'"
                v-model="alarmRule.messageOff"
                :textdark="true"
                style="color: black;"
                :label="$t('lblmesgoff')"
                type="text"
              >
              </base-input>
            </div>
          </div>

          <div class="row">
            <div class="col-12 col-md-12">
              <base-input
                v-if="alarmRule.type=='regular'"
                :label="$t('inptriggertime')"
                style="color: black;"
                :textdark="true"
                v-model="alarmRule.triggerTime"
                type="number"
                :placeholder="$t('palcetriggertime')"
              ></base-input>
            </div>

            <div class="col-12 col-md-12">
              <base-input
                v-if="alarmRule.type=='regular'"
                :label="$t('lblmesgsend')"
                v-model="alarmRule.message"
                style="color: black;"
                :textdark="true"           
                :placeholder="$t('inpmesg')"
                type="text"
              ></base-input>
            </div>
          </div>
          <br /><br />
          <div class="row pull-right">
            <div class="col-12">
              <base-button
                native-type="submit"
                type="info"
                class="mb-3"
                size="lg"
                :loading="addLoading"
                @click="editAlarm()"
              >
                Edit Alarm
                <i class="tim-icons icon-bell-55 ml-2"></i>
              </base-button>
            </div>
          </div>
    </Modal>
  </div>

</template>

<script>
import { Table, TableColumn } from "element-ui";
import BaseSwitch from "../../components/BaseSwitch.vue";
import Modal from "../../components/Modal.vue";
// import { BaseSwitch2 } from "@/components";
import { Select, Option } from "element-ui";
export default {
  components: {
    [Option.name]: Option,
    [Select.name]: Select,
    BaseSwitch,
    Modal,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn
  },
  data() {
    return {
      isModalOpen:false,
      alarmRule:{
        createdAt:null,
        variableFullName:null,
        counter:null,
        message:null,
        messageOn:null,
        messageOff:null,
        triggerTime:null,
        condition:null,
        value:null,
      }
    };
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
            message: `${this.$t('notifupdaterule')} ${newStatus == true ? "ON" : "OFF"}!`
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
    closeModalAlarm(){
      this.isModalOpen=false;
      this.alarmRule.type = null

      this.alarmRule.variableFullName=null;
      this.alarmRule.counter=null;
      this.alarmRule.createdAt=null;
      this.alarmRule.messageOn=null;
      this.alarmRule.messageOff=null;
      this.alarmRule.condition=null;
      this.alarmRule.value=null;
      this.alarmRule.triggerTime=null;
    },
    openModalAlarmRule(alarm){
      this.alarmRule.type = 'regular'
      this.isModalOpen=true;

      this.alarmRule.variableFullName=alarm.variableFullName;
      this.alarmRule.counter=alarm.counter;
      this.alarmRule.createdAt=alarm.createdAt;

      if(!alarm.message){
        this.alarmRule.type='change';
        this.alarmRule.messageOn=alarm.messageOn;
        this.alarmRule.messageOff=alarm.messageOff;
        return
      }
      this.alarmRule.message=alarm.message;
      this.alarmRule.condition=alarm.condition;
      this.alarmRule.value=alarm.value;
      this.alarmRule.triggerTime=alarm.triggerTime;

    },

    editAlarm(){
      
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
            message: `${this.$t('notifupdaterule')}`
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
