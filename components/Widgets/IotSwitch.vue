<template>
  <card>
    <template slot="header">
      <h5 class="card-category">
        {{ config.selectedDevice.name }} - {{ config.variableFullName }}
      </h5>

      <h3 class="card-title">
        <i
          class="fa "
          :class="[config.icon, getIconColor]"
          aria-hidden="true"
          style="font-size: 30px;"
        ></i>
        <base-switch
          @click="
            value = !value;
            sendValue();
          "
          :value="value"
          type="primary"
          
          on-text="ON"
          off-text="OFF"
          :style="'margin-top: 10px; ' + setColorSwitch"
          class="pull-right"
        >
        </base-switch>
      </h3>
    </template>
  </card>
</template>

<script>
export default {
  name: "iotswitch",
  props: ["config"],

  data() {
    return {
      value: true
    };
  },
  watch: {
    config: {
      immediate: true,
      deep: true,
      handler() {}
    }
  },

  mounted() {},
  beforeDestroy() {},
  computed:{
    setColorSwitch(){
        if(this.config.class === 'success') return 'background: rgba(123, 255, 200, 0.7);'
        else if(this.config.class==='primary')return 'background: rgba(237, 0, 200, 0.7);'
        else if(this.config.class==='warning') return 'background: rgba(255, 135, 101, 0.7);'
        else if(this.config.class==='danger') return 'background: rgba(255, 23, 139, 0.7);'        
    },
    getIconColor(){
        return this.value ? 'text-'+this.config.class : 'text-dark'
    },
  },
  methods: {
    sendValue() {
      const toSend = {
        topic:
          this.config.userId +
          "/" +
          this.config.selectedDevice.dId +
          "/" +
          this.config.variable +
          "/actdata",
        msg: {
          value: this.value
        }
      };

      $nuxt.$emit("mqtt-sender", toSend);
    }
  }
};
</script>
<style></style>
