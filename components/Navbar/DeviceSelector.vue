<template>
  
  <el-select
    class="select-info mr-3 mt-1"
    :placeholder="$t('dashboardnavbar.selectorDevice')"
    style=""
    @change="selectDevice()"
    v-model="selectedDeviceIndex"
  >
    <el-option
      v-for="(device, index) in devices"
      :value="index"
      :label="device.name.toUpperCase()"
      :key="device._id"
    >
    </el-option>
  </el-select>


</template>

<script>
import { Select, Option, Loading } from 'element-ui';
export default {
    components: {
    [Select.name]: Select,
    [Option.name]: Option,
  },
  data() {
    return {
      selectedDeviceIndex: null
    };
  },
  computed:{
    devices(){
      return this.$store.getters['devices/getDevices']
    }
  },
  methods:{
    async selectDevice() {
      try {
        this.$nuxt.$emit('selectedDeviceIndex', this.selectedDeviceIndex)
        const devices = this.$store.getters["devices/getDevices"];
        const deviceSelected = devices[this.selectedDeviceIndex];
        await this.$store.dispatch("devices/updateSelected", deviceSelected);
        await this.$store.dispatch("devices/fetchDevices");
        await this.$store.dispatch("notif/fetchNotificationsForDevice", 1);
        
        // solo seria necesario si el dispositivo envia mensajes RETENIDOS
        this.$nuxt.$emit('mqtt-reesubscribe');
      
      } catch (e) {
        console.log('ERROR SELECTING DEVICE');
      }
    },
    setSelectedDeviceIndex(device) {
      this.selectedDeviceIndex = device;
    },
    async getDevices() {
      try {
        await this.$store.dispatch("devices/fetchDevices");
        await this.$store.dispatch("notif/fetchNotificationsForDevice",1);
      } catch (e) {
        console.log('ERROR GETTING DEVICES')
      }
    },
    chechDisconnectedDevices(){
      this.devices.forEach(device => {
        if(device.status=='offline'){
          this.$notify({
            type: "danger",
            icon: "tim-icons icon-bell-55",
            message: `ATENCIÓN: ${device.name} Fuera de Línea` 
          });
        }
      });
    }
    
  },
  created() {
    this.getDevices()
  },
  mounted(){
    this.$nuxt.$on("selectedDeviceIndex", this.setSelectedDeviceIndex);
    setTimeout(()=>{
      this.chechDisconnectedDevices()
    },2000)
    
  },
  beforeDestroy() {
    this.$nuxt.$off("selectedDeviceIndex");
  },
 
};
</script>
