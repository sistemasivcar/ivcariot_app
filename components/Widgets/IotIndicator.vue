<template>
  <card>
    <!-- header-card -->
    <div slot="header">
      <h4 class="card-title">
        {{ deviceName }} - {{ variableFullName }}
      </h4>
    </div>

    <!-- body-card -->
    <template #default >
      <div class="text-center">
        <i class="" :class="[config.icon, getColorIcon]" style="font-size:63px"></i>
        </div>
    </template>

  </card>
</template>

<script>
export default {
  props:['config'],
  data() {
    return {
      topic: "",
      value: 0,
    };
  },
  methods:{
    capitalizarPrimeraLetra(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    capitalizeWords(str){
      let res = '';
      const words = str.split(' ');
      words.forEach(w => {
        res += this.capitalizarPrimeraLetra(w) + ' '
      });
      return res;

    },
    porcessRecivedData(data){
        
        try {
          this.value=data.value;
        } catch (e) {
          console.log(e)
        }
    }
  },

  computed:{
    deviceName(){
      return this.capitalizeWords(this.config.selectedDevice.name);

    },
    variableFullName(){
      return this.capitalizeWords(this.config.variableFullName);
    },
    getColorIcon(){
      if(this.config.isBoolean){
        return this.value ? 'text-'+this.config.color : 'text-dark'
      }

      if(!this.config.isBoolean){
        if(this.config.condition === '=') return this.value == +this.config.value ?  'text-'+this.config.color : 'text-dark';
        if(this.config.condition === '>=') return this.value >= +this.config.value ?  'text-'+this.config.color : 'text-dark'
        if(this.config.condition === '<=') return this.value <= +this.config.value ?  'text-'+this.config.color : 'text-dark'
        if(this.config.condition === '>') return this.value > +this.config.value ?  'text-'+this.config.color : 'text-dark'
        if(this.config.condition === '<') return this.value < +this.config.value ?  'text-'+this.config.color : 'text-dark'
        if(this.config.condition === '!=') return this.value != +this.config.value ?  'text-'+this.config.color : 'text-dark'
     }


    },
  },

  watch: {
    config: {
      immediate: true,
      deep: true,
      handler() {
        setTimeout(() => {
          // esto solo es necesario si el dispositivo manda mensajes retendios por cada  
          // cambio de estado
  
          this.$nuxt.$off(this.sirena + "/sdata");
          
          this.topic =
          this.config.userId +
          "/" +
          this.config.selectedDevice.dId +
          "/" +
          this.config.variable;
          

          this.$nuxt.$on(this.topic + "/sdata", this.porcessRecivedData);

        }, 300);
      }
    }
  },
  
  mounted(){
    const topic = this.config.userId + "/" + this.config.selectedDevice.dId + "/" + this.config.variable + "/sdata";
    this.$nuxt.$on(topic, this.porcessRecivedData);
  },
  beforeDestroy(){
    this.$nuxt.$off(this.topic);
  },
  
};
</script>
