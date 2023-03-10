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
        <i class="fa " :class="[config.icon, getColorIcon]" style="font-size:63px"></i>
        </div>
    </template>

  </card>
</template>

<script>
export default {
  props:['config'],
  data() {
    return {
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
