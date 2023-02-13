
<template>
    <div class="row" v-if="hasDevices"> <!-- el v-if es para que no de error al refrescar -->
      <div
        v-for="widget in widgets"
        :key="widget.variable"
        :class="[widget.column]"
      >
       <json :value="fixWidget(widget)"></json>
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
        
        return widgetCopy;
      }

    },
    computed:{
        widgets(){
            return this.$store.getters['devices/getWidgetsSelectedDevice']
        },
        hasDevices(){
            return this.$store.getters['devices/hasDevices']
        }
    },
    mounted(){
     
    }
}
</script>
