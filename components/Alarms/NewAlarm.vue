<template>
  <div>
    <card v-if="!hasDevices">
      {{ $t("nohasdev") }}
      <base-button :link="true" @click="godevices" type="info">{{
        $t("newdev")
      }}</base-button>
    </card>

    <card v-else-if="!hasSelectedDevice">
      You need to select a device to create an Alarm
    </card>

    <div class="row" v-else-if="hasDevices && hasSelectedDevice !== null">
      <div class="col-12 col-md-12">
        <card>
          <div slot="header">
            <h4 class="card-title">
              {{ $t("newalarm") }}
            </h4>
            <p class="card-category inline">
              {{
                $t("newalarmsub {selectedDevice}", {
                  selectedDevice: hasSelectedDevice.name
                })
              }}
            </p>
          </div>

          <div class="row">
            <div class="col-12 col-md-4">
              <el-select
                required
                class="select-info mb-2"
                :placeholder="$t('selvar')"
                v-model="selectedWidgetIndex"
                @change="getSelectedWidgetIndex()"
                style="margin-top: 25px; width:100%"
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

            <div class="col-12 col-md-4">
              <el-select
                v-if="!showMesaggesInputs"
                required
                class="select-warning mb-2"
                :placeholder="$t('selcondition')"
                v-model="newRule.condition"
                style="margin-top: 25px; width:100%"
              >
                <el-option class="text-dark" value="=" label="="></el-option>
                <el-option class="text-dark" value=">" label=">"></el-option>
                <el-option class="text-dark" value=">=" label=">="></el-option>
                <el-option class="text-dark" value="<" label="<"></el-option>
                <el-option class="text-dark" value="<=" label="<="></el-option>
                <el-option class="text-dark" value="!=" label="!="></el-option>
              </el-select>
            </div>

            <div class="col-12 col-md-4">
              <base-input
                v-if="!showMesaggesInputs"
                :label="$t('inpvalue')"
                v-model="newRule.value"
                type="number"
              ></base-input>
            </div>

            <div class="col-12 col-8-md mt-1 mb-1" v-if="showMesaggesInputs">
              <p>Configuraste esta variable como booleana y el dispositivo la envía por cada cambio de estado. Ahora podés ingresar qué mensajes querés recibir según cada estado de la variable.</p>
            </div>
          </div>

          <div class="row">
            <div class="col-12 col-md-4">
              <base-input
              v-if="showMesaggesInputs"
                v-model.trim="newRule.messageOn"
                :label="$t('lblmesgon')"
                type="text"
              >
              </base-input>
            </div>
            <div class="col-12 col-md-4">
              <base-input
              v-if="showMesaggesInputs"
                v-model="newRule.messageOff"
                :label="$t('lblmesgoff')"
                type="text"
              >
              </base-input>
            </div>
          </div>

          <div class="row">
            <div class="col-12 col-md-6">
              <base-input
                v-if="!showMesaggesInputs"
                :label="$t('inptriggertime')"
                v-model="newRule.triggerTime"
                type="number"
                :placeholder="$t('palcetriggertime')"
              ></base-input>
            </div>

            <div class="col-12 col-md-6">
              <base-input
                v-if="!showMesaggesInputs"
                :label="$t('lblmesgsend')"
                v-model="newRule.message"
                :placeholder="$t('inpmesg')"
                type="text"
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
                :loading="addLoading"
              >
                {{ $t("btnaddalarm") }}
                <i class="tim-icons icon-bell-55 ml-2"></i>
              </base-button>
            </div>
          </div>
        </card>
      </div>
    </div>
  </div>
</template>

<script>
import { throws } from "assert";
import { Select, Option } from "element-ui";
export default {
  components: {
    [Option.name]: Option,
    [Select.name]: Select
  },
  data() {
    return {
      addLoading: false,
      newRule: {
        dId: null,
        status: null,
        variableFullName: null,
        variable: null,
        messageOn:null,
        messageOff:null,
        value: null,
        message: null,
        condition: null,
        triggerTime: null
      },
      selectedWidgetIndex: null
    };
  },
  computed: {
    hasSelectedDevice() {
      //retorna el objeto device seleccionado
      return this.$store.getters["devices/getSelectedDevice"];
    },
    widgets() {
      const widgets = this.$store.getters["devices/getWidgetsSelectedDevice"];
      return widgets.filter(w => w.variableType == "input");
    },
    hasDevices() {
      return this.$store.getters["devices/hasDevices"];
    }
  },
  methods: {
    getSelectedWidgetIndex() {
      const widget = this.widgets[this.selectedWidgetIndex];
      if (
        widget.variableType == "input" &&
        widget.isBoolean &&
        widget.sendMethod == "change_status"
      ) {
        this.showMesaggesInputs = true;
      }
    },
    validNewRule() {
      if(!this.showMesaggesInputs){
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
        return false;
      }
      if (this.newRule.value == null) {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: " Value is empty"
        });
        return false;
      }
      if (this.newRule.triggerTime == null) {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: " Trigger Time is empty"
        });
        return false;
      }
      if (this.newRule.message == null) {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: " Message is empty"
        });
        return false;
      }
      if (this.newRule.triggerTime <= 0) {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: " Trigger Time must be >= than 5"
        });
        return false;
      }
    }else{
      if(this.showMesaggesInputs && (!this.newRule.messageOn || !this.newRule.messageOff)){
        return false;
      }
    }
      return true;
    },

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

    emptyInputs() {
      this.newRule.dId = null;
      this.newRule.status = null;
      this.newRule.variableFullName = null;
      this.newRule.variable = null;
      this.newRule.value = null;
      this.newRule.message = null;
      this.newRule.condition = null;
      this.newRule.triggerTime = null;
      this.selectedWidgetIndex = null;
    },

    async createNewRule() {
      const isValidForm = this.validNewRule();
      if (!isValidForm) return;

      const variableFullName = this.widgets[this.selectedWidgetIndex]
        .variableFullName;
      const dId = this.hasSelectedDevice.dId;
      const variable = this.widgets[this.selectedWidgetIndex].variable;
      if(this.showMesaggesInputs){
        this.newRule.message=null;
        
      }else{
        this.newRule.messageOn=null;
        this.newRule.messageOff=null;
      }
      const newRule = {
        ...this.newRule,
        variableFullName,
        variable,
        dId
      };

      try {
        this.addLoading = true;
        await this.$store.dispatch("devices/crateAlarmRule", newRule);
        await this.$store.dispatch("devices/fetchDevices");
        this.$notify({
          type: "success",
          icon: "tim-icons icon-check-2",
          message: `${this.$t("notifalarm")}`
        });
        this.emptyInputs();
      } catch (e) {
        this.$notify({
          type: "danger",
          icon: "tim-icons icon-alert-circle-exc",
          message: e
        });
      } finally {
        this.addLoading = false;
      }
    },
    godevices() {
      this.$router.push("/app/devices");
    }
  }
};
</script>
