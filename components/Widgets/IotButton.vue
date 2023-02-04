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
      <base-button @click="sendValue" :type="config.colorButton" size="lg" class="mb-3 ml-3 pull-right">{{
        config.text
      }}</base-button>
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
      sneding: false,
      colorIndicator: "text-",
      
      // config: {
      //   userId: "userid",
      //   dId: "deviceid",
      //   selectedDevice: {
      //     name: "Home",
      //     dId: "8888",
      //     templateName: "Power Sensor",
      //     templateId: "984237562348756ldksjfh",
      //     saverRule: false
      //   },
      //   variableFullName: "Pump",
      //   variable: "uniquevariablename",
      //   icon: "fa-sun",
      //   column: "col-12",
      //   widget: "button",
      //   colorButton: "success",
      //   message: "{'fanstatus:stop'}",
      //   text:'On'
      // }


    };
  },
  methods: {
    sendValue() {
      this.sneding = true;

      setTimeout(() => {
        this.sneding = false;
      }, 500);

      const toSend = {
        topic:`${this.config.userId}/${this.config.selectedDevice.dId}/${this.config.selectedDevice.variable}/sdata`,
        msg:{
            value:this.message
            }
      };

      this.$nuxt.$emit('mqtt-sender',toSend);
    }
  },

  computed: {
    getColorIcon() {
      return this.sneding ? this.colorIndicator+this.config.colorButton : this.colorIndicator+"dark";
    }
  },
  mounted() {}
};
</script>
