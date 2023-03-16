<template>
  <card>
    <!-- header-card -->
    <template slot="header">
      <h4 class="card-title">
        {{ capitalizeWord(config.selectedDevice.name) }} -
        {{ capitalizeWord(config.variableFullName) }}
      </h4>
    </template>

    <!-- body-card -->
    <template #default>
      <i
        class=""
        :class="[config.icon, getColorIcon]"
        style="font-size:35px"
      ></i>
      <base-button
        @click="sendValue"
        :type="config.colorButton"
        size="lg"
        class="pull-right"
        >{{ config.text }}</base-button
      >
    </template>

    <!-- footer-card -->
    <template slot="raw-content"> </template>
  </card>
</template>

<script>
import Json from "../Json.vue";
export default {
  components: { Json },
  props: ["config"],
  data() {
    return {
      sneding: false,
      colorIndicator: "text-",
      topic:"",
    };
  },
  watch:{
    'config.selectedDevice.dId'(){
      this.topic=`${config.userId}/${config.selectedDevice.dId}/${config.variable}/actdata`
    }
  },
  methods: {
    capitalizarPrimeraLetra(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    capitalizeWord(str) {
      let res = "";
      const words = str.split(" ");
      words.forEach(w => {
        res += this.capitalizarPrimeraLetra(w) + " ";
      });
      return res;
    },
    sendValue() {
      this.sneding = true;

      setTimeout(() => {
        this.sneding = false;
      }, 500);

      const retain = this.config.retain || false;
      const qos = this.config.retain ? 1 : 0;
      const toSend = {
        topic: this.topic,
        msg: {
          value: this.config.message
        },
        flags: {
          retain,
          qos
        }
      };
      this.$nuxt.$emit("mqtt-sender", toSend);
    },
  },

  computed: {
    getColorIcon() {
      return this.sneding
        ? this.colorIndicator + this.config.colorButton
        : this.colorIndicator + "dark";
    }
  },
  mounted() {
    this.topic=`${config.userId}/${config.selectedDevice.dId}/${config.variable}/actdata`
  }
};
</script>

<style scoped>
.icon-success {
  color: rgba(0, 240, 205, 0.7);
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
  color: #ffffff;
  text-align: center;
  margin: 4px 1px;
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
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.4);
}
.button:focus {
  outline: none;
  width: 75px;
  height: 75px;
}
</style>
