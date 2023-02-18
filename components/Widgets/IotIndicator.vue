<template>
  <card >
    <!-- header-card -->
    <template slot="header">
      <h4 class="card-title">
        {{ deviceName }} - {{ variableFullName }}
      </h4>
    </template>

    <!-- body-card -->
    <template #default >
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
      value: null,
    };
  },
  methods:{
    capitalizarPrimeraLetra(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    capitalizarPrimeraLetraDeCadaPalabra(str){
      let res = '';
      const words = str.split(' ');
      words.forEach(w => {
        res += this.capitalizarPrimeraLetra(w) + ' '
      });
      return res;

    },
    porcessRecivedData(data){
        
        this.value=data.value;
    }
  },

  computed:{
    deviceName(){
      return this.capitalizarPrimeraLetraDeCadaPalabra(this.config.selectedDevice.name);

    },
    variableFullName(){
      return this.capitalizarPrimeraLetraDeCadaPalabra(this.config.variableFullName);
    },
    getColorIcon(){
      if(this.config.isBoolean){
        return this.value ? 'text-'+this.config.color : 'text-dark'
      }

      if(!this.config.isBoolean){
        if(this.config.condition === '=') return this.value == +this.config.value ?  'text-'+this.config.color : 'text-dark';
        if(this.config.condition === '=>') return this.value >= +this.config.value ?  'text-'+this.config.color : 'text-dark'
        if(this.config.condition === '<=') return this.value <= +this.config.value ?  'text-'+this.config.color : 'text-dark'
        if(this.config.condition === '>') return this.value > +this.config.value ?  'text-'+this.config.color : 'text-dark'
        if(this.config.condition === '<') return this.value < +this.config.value ?  'text-'+this.config.color : 'text-dark'
        if(this.config.condition === '!=') return this.value != +this.config.value ?  'text-'+this.config.color : 'text-dark'
     }


    },
  },
  
  mounted(){
    
    // topic format for reading data ->>  userId / dId / uniquevariablename / sdata
    const topic = `${this.config.userId}/${this.config.selectedDevice.dId}/${this.config.variable}/sdata`
    this.$nuxt.$on(topic, this.porcessRecivedData);
  
  },
  beforeDestroy(){
    const topic = `${this.config.userId}/${this.config.selectedDevice.dId}/${this.config.variable}/sdata`
    this.$nuxt.$off(topic)
  },
  
};
</script>
