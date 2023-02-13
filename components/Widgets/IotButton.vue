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
      <i
        class="fa "
        :class="[config.icon, getColorIcon]"
        style="font-size:35px"
      ></i>
      <button v-if="config.colorButton=='green'" class="button mb-3 ml-3 btn-lg pull-right">{{config.text}}</button>
      <base-button v-else @click="sendValue" :type="config.colorButton" size="lg" class="mb-3 ml-3 pull-right">{{
        config.text
      }}</base-button>

      

    </template>

    <!-- footer-card -->
    <template slot="raw-content"> </template>
    
  </card>
</template>

<script>
import Json from '../Json.vue';
export default {
  components: { Json },
  props:['config'],
  data() {
    return {
      sneding: false,
      colorIndicator: "icon-",
      };
  },
  methods: {
    sendValue() {
      this.sneding = true;

      setTimeout(() => {
        this.sneding = false;
      }, 500);

      const toSend = {
        topic:`${this.config.userId}/${this.config.selectedDevice.dId}/${this.config.variable}/actdata`,
        msg:{
            value:this.config.message
            }
      };
      this.$nuxt.$emit('mqtt-sender',toSend);

    }
  },

  computed: {
    getColorIcon() {
      return this.sneding ? this.colorIndicator+this.config.colorButton : this.colorIndicator+"dark";
    },

  },
  mounted() {}
};
</script>

<style scoped>
.icon-success {
  color: rgba(0, 240, 205, 0.7)
}

.icon-green {
  color: rgba(0, 193, 118, 0.7);
}
.icon-danger {
  color: rgba(248, 0, 20, 0.7);
}

.icon-warning {
  color: rgba(255, 135, 101, 0.7);
}

.icon-info {
  color: rgba(40, 150, 252, 0.7);
}

.icon-primary {
  color: rgba(255, 23, 139, 0.7);
}

.icon-primary {
  color: rgba(237, 0, 200, 0.7);
}


.button {
  display: inline-block;
  border-radius: 9px;
  background-color: rgba(21, 173, 114, 0.7);
  border: none;
  position: relative;
  overflow: hidden;
  color: #FFFFFF;
  text-align:center;
  margin:4px 1px; 
        -webkit-transition-duration: 0.4s; /* Safari */
      transition-duration: 0.4s;
  cursor: pointer;
}
.button span {
  cursor: pointer;
  display: inline-block;
  position: relative;
  transition: 0.5s;
}


.button:hover {
  box-shadow: 2px 2px 6px rgba(0,0,0,.4);

 }
.button:focus {
  outline: none;
   width: 75px;
 height: 75px;
}




</style>
