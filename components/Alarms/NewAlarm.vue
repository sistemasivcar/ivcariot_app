<template>
  <div>
    <div class="row" v-if="hasDevices && hasSelectedDevice !== null">
      <div class="col-12 col-md-12">
        <card>
          <div slot="header">
            <h4 class="card-title">
              {{ $t("newalarm") }}
            </h4>
            <p class="card-category">
              {{
                $t("newalarmsub {selectedDevice}", {
                  selectedDevice: hasSelectedDevice.name
                })
              }}
            </p>
          </div>

          <div class="row">
            <!-- VARIABLE -->
            <div class="col-12 col-md-4">
              <label for="condition"
                >Variable de: {{ hasSelectedDevice.name }}</label
              >
              <el-select
                class="select-info mb-2"
                :placeholder="$t('selvar')"
                v-model="selectedWidgetIndex"
                @change="getSelectedWidgetIndex()"
                style="width:100%"
              >
                <el-option
                  v-for="(widget, index) in widgets"
                  :key="index"
                  class="text-dark"
                  :value="index"
                  :label="widget.variableFullName.toUpperCase()"
                ></el-option>
              </el-select>
            </div>
            <!-- CONDITION -->
            <div class="col-12 col-md-4" v-if="typeAlarm == 'regular'">
              <label for="condition">Condición</label>
              <el-select
                required
                class="select-warning mb-2"
                :placeholder="$t('selcondition')"
                v-model="newRule.condition"
                style="width:100%"
              >
                <el-option class="text-dark" value="=" label="="></el-option>
                <el-option class="text-dark" value=">" label=">"></el-option>
                <el-option class="text-dark" value=">=" label=">="></el-option>
                <el-option class="text-dark" value="<" label="<"></el-option>
                <el-option class="text-dark" value="<=" label="<="></el-option>
                <el-option class="text-dark" value="!=" label="!="></el-option>
              </el-select>
            </div>
            <!-- VALUE -->
            <div class="col-12 col-md-4" v-if="typeAlarm == 'regular'">
              <base-input
                :label="$t('inpvalue')"
                :class="{ 'has-danger': !inputs.value }"
                v-model="newRule.value"
                type="number"
              ></base-input>
            </div>

            <div
              class="col-12 col-12-md mt-1 mb-1"
              v-if="typeAlarm == 'change'"
            >
              <p>
                Configuraste esta variable como booleana y el dispositivo la
                envía por cada cambio de estado. Ahora podés ingresar qué
                mensajes querés recibir según cada estado de la variable.
              </p>
            </div>
          </div>

          <div class="row">
            <!-- MESSAGE ON -->
            <div class="col-12 col-md-4" v-if="typeAlarm == 'change'">
              <base-input
                v-model.trim="newRule.messageOn"
                :class="{ 'has-danger': !inputs.messageOn }"
                :label="$t('lblmesgon')"
                type="text"
              >
              </base-input>
            </div>

            <!-- MESSAGE OFF -->
            <div class="col-12 col-md-4" v-if="typeAlarm == 'change'">
              <base-input
                v-model="newRule.messageOff"
                :class="{ 'has-danger': !inputs.messageOff }"
                :label="$t('lblmesgoff')"
                type="text"
              >
              </base-input>
            </div>
          </div>

          <div class="row">
            <!-- TRIGGER TIME -->
            <div class="col-12 col-md-6" v-if="typeAlarm == 'regular'">
              <base-input
                :label="$t('inptriggertime')"
                :class="{ 'has-danger': !inputs.triggerTime }"
                v-model="newRule.triggerTime"
                type="number"
                :placeholder="$t('palcetriggertime')"
              ></base-input>
            </div>

            <!-- MESSAGE -->
            <div class="col-12 col-md-6" v-if="typeAlarm == 'regular'">
              <base-input
                :label="$t('lblmesgsend')"
                v-model="newRule.message"
                :class="{ 'has-danger': !inputs.message }"
                :placeholder="$t('inpmesg')"
                type="text"
              ></base-input>
            </div>
          </div>

          <div class="row">
            <div class="col-12" v-if="typeAlarm == 'regular'">
              <p class="text-danger">¿QUÉ ES EL TRIGGER TIME?</p>
              <p>
                Es la cantidad de minutos que deben pasar antes de que el sistma
                vuelva a notificar por más que la condición se siga cumpliendo.
                Es requerido para evitar ráfagas de notificaciones indeseadas.
              </p>
            </div>
          </div>
          <div class="row pull-right">
            <div class="col-12">
              <base-button
                @click="showModalNotifsMethodsSelection()"
                native-type="submit"
                type="info"
                class="pull-right"
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
    <div v-else>SELECCIONÁ UN DISPOSITIVO</div>

    <Modal
      :animationDuration="2000"
      type="notice"
      :show="modalNotifsMethodsVisibility"
      :scrollToBottom="true"
      :appendToBody="true"
      gradient=""
      @close="modalNotifsMethodsVisibility=false"
    >

    <template slot="header">
        <h5 class="modal-title" id="exampleModalLabel">Por último, ¿Por donde quéres que te notifiquemos?</h5>
    </template>

    <template name="dafult">
      <input class="mycheck" type="checkbox" value="wpp" v-model="newRule.notifMethods">
      <label for="notifMethods">WhatsApp</label><br>

      <input disabled class="mycheck" type="checkbox" value="email" v-model="newRule.notifMethods">
      <label for="notifMethods">Email <span class="text-danger"> (Próximamente)</span></label><br>

      <input disabled class="mycheck" type="checkbox" value="sms" v-model="newRule.notifMethods">
      <label for="notifMethods">SMS<span class="text-danger"> (Próximamente)</span></label><br>

      <p v-if="!inputs.notifMethods" class="text-danger">Seleccioná al menos un método de notificación!</p>
      <BaseButton
              size="md"
              type="info"
              @click="createNewRule()"
              class="pull-right"
              >Listo, crear!</BaseButton
            >
    </template>

  
  </Modal>
  </div>
</template>

<script>
import { Select, Option } from "element-ui";
import BaseCheckbox from '../Inputs/BaseCheckbox.vue'
import IconCheckbox from '../Inputs/IconCheckbox.vue'

export default {
  props: ["first"],
  components: {
    [Option.name]: Option,
    [Select.name]: Select,
    BaseCheckbox,
    IconCheckbox
},
  data() {
    return {
      modalNotifsMethodsVisibility:false,
      isValidForm: true,
      addLoading: false,
      inputs: {
        messageOn: true,
        messageOff: true,
        value: true,
        notifMethods:true,
        message: true,
        condition: true,
        triggerTime: true
      },
      newRule: {
        dId: null,
        status: null,
        variableFullName: null,
        variable: null,
        messageOn: null,
        notifMethods:[],
        messageOff: null,
        value: null,
        message: null,
        condition: null,
        triggerTime: null
      },
      selectedWidgetIndex: null,
      typeAlarm: null
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
    getSelectedWidgetIndex() {},
    validNewRule() {
      if(this.selectedWidgetIndex == null){
        this.isValidForm=false;
        this.$notify({
            message: `Seleccioná una variable`,
            type: "warning",
            icon: "tim-icons icon-alert-circle-exc"
        })
        return;
      }
      if(this.newRule.notifMethods.length==0){
        this.inputs.notifMethods=false;
        this.isValidForm=false;
        return;
      }else{
        this.inputs.notifMethods=true;
        this.isValidForm=true;
      }
      if (this.typeAlarm == "regular") {
        if (
          this.selectedWidgetIndex == null ||
          this.newRule.condition == null ||
          this.newRule.value == null ||
          this.newRule.triggerTime == null ||
          this.newRule.message == null ||
          this.newRule.triggerTime <= 0
        ) {
          this.isValidForm = false;
          this.$notify({
            message: `${this.$t("inpinv")}`,
            type: "warning",
            icon: "tim-icons icon-alert-circle-exc"
          });
          return;
        } else {
          this.isValidForm = true;
          return;
        }
      }
      if (this.typeAlarm == "change") {
        // change alarm form

        if (!this.newRule.messageOn || !this.newRule.messageOff) {
          this.isValidForm = false;
          this.$notify({
            message: `${this.$t("inpinv")}`,
            type: "warning",
            icon: "tim-icons icon-alert-circle-exc"
          });
          return;
        } else {
          this.isValidForm = true;
          return;
        }
      }
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

    showModalNotifsMethodsSelection(){
      this.modalNotifsMethodsVisibility=true;
    },

    async createNewRule() {
      this.validNewRule();
      if (!this.isValidForm) return;

      const variableFullName = this.widgets[this.selectedWidgetIndex]
        .variableFullName;
      const dId = this.hasSelectedDevice.dId;
      const variable = this.widgets[this.selectedWidgetIndex].variable;
      if (this.typeAlarm == "change") {
        this.newRule.message = null;
        this.newRule.triggerTime = null;
        this.newRule.condition = null;
        this.newRule.value = null;
      } else if (this.typeAlarm == "regular") {
        this.newRule.messageOn = null;
        this.newRule.messageOff = null;
      }
      const newRule = {
        ...this.newRule,
        variableFullName,
        variable,
        notifMethods:this.newRule.notifMethods,
        dId,
        typeAlarm: this.typeAlarm
      };

      try {
        this.addLoading = true;
        this.modalNotifsMethodsVisibility=false;
        await this.$store.dispatch("devices/crateAlarmRule", newRule);
        await this.$store.dispatch("devices/fetchDevices");
        this.$notify({
          type: "success",
          icon: "tim-icons icon-check-2",
          message: `${this.$t("notifalarm")}`
        });
        this.$emit('new-alarm')

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
    },
    setVariable() {
      this.selectedWidgetIndex = null;
    }
  },
  watch: {
    selectedWidgetIndex(index) {
      const widget = this.widgets[index];
      if (widget != null) {
        if (
          widget.widgetName === "indicator" &&
          widget.isBoolean &&
          widget.sendMethod == "change_status"
        ) {
          this.typeAlarm = "change";
        } else {
          this.typeAlarm = "regular";
        }
      } else {
        this.typeAlarm = null;
      }
    },
    "newRule.value"(value) {
      value == "" ? (this.inputs.value = false) : (this.inputs.value = true);
    },
    "newRule.triggerTime"(triggerTime) {
      triggerTime <= 0 || triggerTime === null
        ? (this.inputs.triggerTime = false)
        : (this.inputs.triggerTime = true);
    },
    "newRule.message"(message) {
      !message ? (this.inputs.message = false) : (this.inputs.message = true);
    },
    "newRule.messageOn"(messageOn) {
      !messageOn
        ? (this.inputs.messageOn = false)
        : (this.inputs.messageOn = true);
    },
    "newRule.messageOff"(messageOff) {
      !messageOff
        ? (this.inputs.messageOff = false)
        : (this.inputs.messageOff = true);
    }
  },
  mounted() {
    this.$nuxt.$on("selectedDeviceIndex", this.setVariable);
  },
  beforeDestroy() {
    this.$nuxt.$off("selectedDeviceIndex");
  }
};
</script>

<style scoped>
.mycheck {
    cursor: pointer;
    background-color: #fff;
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
    width: 20px;
    height: 20px;
    appearance: none;
    border: 2px solid #888;
    transition: background-color 0.3s ease-in-out;
}
.mycheck:checked {
  background-color: rgb(75, 156, 13);
  color: rgb(75, 156, 13);
  background-position: 0 0;
} 
</style>