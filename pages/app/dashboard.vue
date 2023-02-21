
<template>
<div>
  
    <Card v-if="!hasDevices">
      You need first create a device to create an Alarm <base-button :link="true"  @click="godevices" type="info">Create new Device</base-button>
    </Card>

    <Card v-else-if="!hasSelectedDevice">
      You need to select a device to create an Alarm
    </Card>

    <div class="row" v-if="hasDevices"> <!-- el v-if es para que no de error al refrescar -->
      <div
        v-for="(widget) in widgets"
        :key="widget.variable"
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
        <IotButton v-if="widget.widgetName === 'button'" :config="fixWidget(widget)" />
      </div>
    </div>
</div>
</template>

<script>
import Json from '../../components/Json.vue';
import IotIndicator from "../../components/Widgets/IotIndicator.vue";
import IotNumberchart from "../../components/Widgets/GraficoRealtime.vue";
import IotButton from "../../components/Widgets/IotButton.vue";
import IotSwitch from "../../components/Widgets/IotSwitch.vue";

export default {
  components: { 
    Json,
    IotIndicator,
    IotNumberchart,
    IotButton,
    IotSwitch
    
    },
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
      return this.$store.getters["devices/getSelectedDevice"];
    },
    },
    mounted(){
     
    }
}
</script>
