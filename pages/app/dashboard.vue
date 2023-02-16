
<template>
<div>
    <card v-if="!hasDevices">
      You need first create a device to create an Alarm <base-button :link="true"  @click="godevices" type="info">Create new Device</base-button>
    </card>

    <card v-else-if="!hasSelectedDevice">
      You need to select a device to create an Alarm
    </card>
    <div class="row" v-if="hasDevices"> <!-- el v-if es para que no de error al refrescar -->
      <div
        v-for="widget in widgets"
        :key="widget.variable"
        :class="[widget.column]"
      >
      <!--  <json :value="fixWidget(widget)"></json> -->
        <grafico-realtime
          v-if="widget.widgetName == 'numberchart'"
          :config="fixWidget(widget)"
        ></grafico-realtime>

        <iot-switch
          v-if="widget.widgetName == 'switch'"
          :config="fixWidget(widget)"
        ></iot-switch>

        <iot-button
          v-if="widget.widgetName == 'button'"
          :config="fixWidget(widget)"
        ></iot-button>

        <iot-indicator
          v-if="widget.widgetName == 'indicator'"
          :config="fixWidget(widget)"
        ></iot-indicator>
      </div>
   
    </div>
</div>
</template>

<script>
import Json from '../../components/Json.vue'
export default {
  components: { Json },
    middleware:'authtenticated',
    data(){
        return {

        }
    },
    methods:{
      fixWidget(widget){
        const widgetCopy = JSON.parse(JSON.stringify(widget));
        widgetCopy.selectedDevice.name = this.$store.state.devices.selectedDevice.name;
        widgetCopy.selectedDevice.dId = this.$store.state.devices.selectedDevice.dId;
        widgetCopy.demo = false;
        
        return widgetCopy;
      },
      godevices(){
        this.$router.push('/app/devices')
      }

    },
    computed:{
        widgets(){
            return this.$store.getters['devices/getWidgetsSelectedDevice']
        },
        hasDevices(){
            return this.$store.getters['devices/hasDevices']
        },
        hasSelectedDevice() {
      //retorna el objeto device seleccionado
      return this.$store.getters["devices/getSelDevice"];
    },
    },
    mounted(){
     
    }
}
</script>
