<template>
  <div>
    <Card v-if="!hasDevices">
      {{ $t("dashboard.nodevices") }}
      <base-button :link="true" @click="godevices" type="info">{{
        $t("dashboard.linkdevices")
      }}</base-button>
    </Card>

    <Card v-else-if="!hasSelectedDevice">
      {{ $t("dashboard.noseldevice") }}
    </Card>

    <div v-else-if="showAlertOfflineDevice" class="alert alert-danger">
      <strong>¡Cuidado!</strong> Este dispositivo está OFFLINE!. Puede ser por
      varios motivos como falta de energía, conectividad WiFi, etc. No te fíes
      de los datos que ves en pantalla porque pueden no estar actualizados. Si
      usás mensajes retenidos, los comandos que envíes desde el panel serán
      procesados por el dispositivo cuando se recupere.
    </div>

    <LoadingPanel v-if="!$store.state.auth.subscribed"></LoadingPanel>
    <div class="row" v-else-if="hasDevices">
      <!-- el v-if es para que no de error al refrescar -->
      <div
        v-for="widget in widgets"
        :key="widget.variable"
        class="col-12"
        :class="[widget.column]"
      >
        <!-- <Json :value="fixWidget(widget)"/> -->

        <IotNumberchart
          v-if="widget.widgetName === 'numberchart'"
          :config="fixWidget(widget)"
        />

        <IotIndicator
          v-if="widget.widgetName === 'indicator'"
          :config="fixWidget(widget)"
        />
        <IotButton
          v-if="widget.widgetName === 'button'"
          :config="fixWidget(widget)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Json from "../../components/Json.vue";
import IotIndicator from "../../components/Widgets/IotIndicator.vue";
import IotNumberchart from "../../components/Widgets/GraficoRealtime.vue";
import IotButton from "../../components/Widgets/IotButton.vue";
import IotSwitch from "../../components/Widgets/IotSwitch.vue";
import { Loading } from "element-ui";
import LoadingPanel from "../../components/LoadingPanel.vue";
import { computed } from "vue";
export default {
  head: {
    title: 'IvcarIoT - Dashboard',
  },

  components: {
    Json,
    IotIndicator,
    IotNumberchart,
    IotButton,
    IotSwitch,
    LoadingPanel
  },
  middleware: "authtenticated",
  data() {
    return {
      isLoading: false
    };
  },
  methods: {
    fixWidget(widget) {
      const widgetCopy = JSON.parse(JSON.stringify(widget));
      // le vuevlo a poner el userId por el tema de plantillas compartidas
      // (sino queda siempre la del usuairo creador) 
      widgetCopy.userId = this.$store.getters["auth/getUserId"]; 
      widgetCopy.userId = this.$store.state.auth.auth.userData.userId;
      widgetCopy.selectedDevice.name = this.$store.state.devices.selectedDevice.name;
      widgetCopy.selectedDevice.dId = this.$store.state.devices.selectedDevice.dId;
      widgetCopy.demo = false;

      return widgetCopy;
    },
    godevices() {
      this.$router.push("/app/devices");
    }
  },
  computed: {
    widgets() {
      return this.$store.getters["devices/getWidgetsSelectedDevice"];
    },
    hasDevices() {
      return this.$store.getters["devices/hasDevices"];
    },
    hasSelectedDevice() {
      //retorna el objeto device seleccionado
      return this.$store.getters["devices/getSelectedDevice"];
    },
    showAlertOfflineDevice() {
      return this.hasSelectedDevice.status == "offline";
    }
  },

  mounted() {
    // solo seria necesario si el dispositivo envia mensajes RETENIDOS

    this.$nuxt.$emit("mqtt-reesubscribe");

  }
};
</script>
