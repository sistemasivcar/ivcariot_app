<template>
  <div>
    <NewAlarm v-if="showViewCreate" :first="firstAlarm"
   ></NewAlarm>
    <ListAlarms v-if="showViewList"></ListAlarms>

    <Modal
      :animationDuration="2000"
      type="notice"
      :show="!hasDevices"
      :scrollToBottom="true"
      :appendToBody="true"
      gradient=""
    >
      <template name="header">
        <h4 class="text-info">NO TENÉS DISPOSITIVOS!</h4>
      </template>

      <template name="default">
        <div class="row">
          <div class="col-12">
            <p class="text-dark">
              Las alarmas se crean para un dispositivo en particular.
            </p>
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <p class="text-dark">
              Creá alarmas para recibir notificaciones en tiempo real cuando tu
              dispositivo dispare algún evento importante. Por ejemplo cuando la
              temperatura alcanza un valor crítico predefinido.
            </p>
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <p class="text-dark">
              Primero
              <a
                class="text-danger"
                style="cursor: pointer;"
                @click.prevent="goDevices"
                >creá el dispositivo</a
              >
              y luego volvé a esta página
            </p>
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <BaseButton
              size="md"
              type="info"
              @click="goDevices"
              class="pull-right"
              >Entendido</BaseButton
            >
          </div>
        </div>
      </template>
    </Modal>

    <Modal
      :animationDuration="2000"
      type="notice"
      @close="close"
      :show="modal"
      :top="true"
      :appendToBody="true"
      gradient=""
    >
      <template name="header">
        <h4 class="text-info">COMENZÁ A CREAR ALARMAS!</h4>
      </template>

      <template name="default">
        <div class="row">
          <div class="col-12">
            <p class="text-dark">
              El dispositivo seleccionado no tiene alarmas!
            </p>
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <p class="text-dark">
              Las alarmas sólo se crean para las variables de entrada, es decir
              datos provenientes de sensores que envía tu dispositivo.
            </p>
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <p class="text-dark">
              Según la configuración que hayas hecho del widget la alarma es
              diferente.
            </p>
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <p class="text-dark">
              Hay dos tipos de alarmas: 1) las que se disparan cuando el valor
              de la variable cumple una condicion 2) las que se disparan por
              cada cambio de estado de la variable
            </p>
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <BaseButton
              size="md"
              type="info"
              @click="close(false)"
              class="pull-right"
              >Entendido</BaseButton
            >
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script>
import ListAlarms from "../../../components/Alarms/ListAlarms.vue";
import NewAlarm from "../../../components/Alarms/NewAlarm.vue";

export default {
  middleware: "authtenticated",
  components: { ListAlarms, NewAlarm },
  data() {
    return {
      showViewList: true,
      showViewCreate: true,
      welcome: false,
      modal: true
    };
  },
  methods: {
    goDevices() {
      this.$router.push("devices");
    },
    close(val) {
      this.modal = val;
    },
  
  },
  computed: {
    firstAlarm() {
      return this.hasSelectedDevice && this.alarmRules.length == 0;
    },
    hasDevices() {
      return this.$store.getters["devices/hasDevices"];
    },
    alarmRules() {
      return this.$store.getters["devices/getAlarmRulesSelectedDevice"];
    },
    hasSelectedDevice() {
      return this.$store.getters["devices/getSelectedDevice"];
    }
  },
  mounted(){
    this.modal=this.hasSelectedDevice && this.alarmRules.length == 0;
  },
};
</script>
