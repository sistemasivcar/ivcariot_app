<template>
  <card >
    <!-- header-card -->
    <template slot="header">
      <h4 class="card-title">
        {{ config.selectedDevice.name }} - {{ config.variableFullName }}
      </h4>
    </template>

    <!-- body-card -->
    <template #default>
      <i class="fa " :class="[config.icon, getColorIcon]" style="font-size:35px"></i>
    </template>

    <!-- footer-card -->
    <template slot="raw-content"> </template>
  </card>
</template>

<script>
export default {
  props:['config'],
  data() {
    return {
      value: false,
    };
  },
  methods:{
    porcessRecivedData(data){
        
        this.value=data.value;
    }
  },

  computed:{
    getColorIcon(){
        return this.value ? 'text-'+this.config.color : 'text-dark'
    },
  },
  
  mounted(){
    
    // topic format for reading data ->>  userId / dId / uniquevariablename / sdata
    const topic = `${this.config.userId}/${this.config.selectedDevice.dId}/${this.config.variable}/sdata`
    console.log(topic)
    this.$nuxt.$on(topic, this.porcessRecivedData);
  
  },
  beforeDestroy(){
    const topic = `${this.config.userId}/${this.config.selectedDevice.dId}/${this.config.variable}/sdata`
    this.$nuxt.$off(topic)
  },
  
};
</script>
