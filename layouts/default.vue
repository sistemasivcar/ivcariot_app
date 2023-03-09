<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <notifications></notifications>

    <side-bar
      :background-color="sidebarBackground"
      short-title="IIOT"
      title="IvcarIoT"
    >
      <template slot-scope="" slot="links">
        <sidebar-item
          :link="{

            name: `${$t('sidebar.dashboard')}`,
            icon: 'tim-icons tim-icons icon-laptop',
            path: `${defaultLocal}/app/dashboard`
          }"
        >
        </sidebar-item>

        <sidebar-item
          :link="{
            name: `${$t('sidebar.devices')}`,
            icon: 'tim-icons icon-light-3',
            path: `${defaultLocal}/app/devices`
          }"
        >
        </sidebar-item>

        <sidebar-item
          :link="{
            name: `${$t('sidebar.templates')}`,
            icon: 'tim-icons icon-atom',
            path: `${defaultLocal}/app/templates`
          }"
        >
        </sidebar-item>


        <sidebar-item
          :link="{
            name: `${$t('sidebar.alarms')}`,
            icon: 'tim-icons icon-bell-55',
            path: `${defaultLocal}/app/alarms`
          }"
        >
        </sidebar-item>


                <sidebar-item
          :link="{
            name: `${$t('sidebar.notifications')}`,
            icon: 'tim-icons icon-spaceship',
            path: `${defaultLocal}/app/notifications`
          }"
        >
        </sidebar-item>

        <sidebar-item
          :link="{
            name: `${$t('sidebar.profile')}`,
            icon: 'tim-icons icon-single-02',
            path: `${defaultLocal}/app/profile`
          }"
        >
        </sidebar-item>

          <sidebar-item
          :link="{
            name: `${$t('sidebar.help')}`,
            icon: 'tim-icons icon-paper',
            path: `${defaultLocal}/app/docs`
          }"
        >
        </sidebar-item>
      </template>
    </side-bar>
    

    <sidebar-share v-if="dev=='development'" :background-color.sync="sidebarBackground"></sidebar-share>

    <div class="main-panel" :data="sidebarBackground">
      <dashboard-navbar></dashboard-navbar>
      <router-view name="header"></router-view>

      <div :class="{ content: !isFullScreenRoute }" @click="toggleSidebar">
        <zoom-center-transition :duration="350" mode="out-in">
          <!-- your content here -->
          <nuxt></nuxt>
        </zoom-center-transition>
      </div>
      <content-footer v-if="!isFullScreenRoute"></content-footer>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-new */

import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import SidebarShare from "@/components/Layout/SidebarSharePlugin";
function hasElement(className) {
  return document.getElementsByClassName(className).length > 0;
}

function initScrollbar(className) {
  if (hasElement(className)) {
    new PerfectScrollbar(`.${className}`);
  } else {
    // try to init it later in case this component is loaded async
    setTimeout(() => {
      initScrollbar(className);
    }, 100);
  }
}


import DashboardNavbar from "@/components/Layout/DashboardNavbar.vue";
import ContentFooter from "@/components/Layout/ContentFooter.vue";
import DashboardContent from "@/components/Layout/Content.vue";
import { SlideYDownTransition, ZoomCenterTransition } from "vue2-transitions";
import SideBar from "../components/SidebarPlugin/SideBar.vue";
import mqtt from "mqtt";

export default {
  head () {
    return 'Ivcar Application'
  },
  components: {
    DashboardNavbar,
    ContentFooter,
    DashboardContent,
    SlideYDownTransition,
    ZoomCenterTransition,
    SidebarShare,
    SideBar
  },
  data() {

    return {
      sidebarBackground: "blue", //vue|blue|orange|green|red|primary
      client: null,
      dev:process.env.environment,
      options: {
        host: process.env.mqtt_host,
        port: process.env.mqtt_port,
        keepalive:60,
        endpoint: "/mqtt",
        clean: true,
        protocolVersion:4, // MQTT 3.1.1
        connectTimeout: 10000,
        reconnectPeriod: 5000,
        // crendentials info
        clientId: `webClient_${this.$store.getters["auth/getUserName"]}_${Math.floor(
          Math.random() * 1000000 + 1
        )}`,
        username: null,
        password: null,
      }
    };
  },
  computed: {
    isFullScreenRoute() {
      return this.$route.path === "/maps/full-screen";
    },
    defaultLocal() {
      const locale = this.$store.state.locale.locale;
      if (locale == 'es') return '';
      return this.$store.state.locale.locale;
    },
    userId(){
      return this.$store.getters['auth/getUserId']
    },

  },
  methods: {
    async startMqttClient() {
      await this.getMqttCredentials();

      const deviceSubscribeTopic = `${this.userId}/+/+/sdata`;
      const notifSubscribeTopic = `${this.userId}/+/+/notif`;
      const statusSubscribeTopic = `${this.userId}/+/+/status`;
      // ex. topic: "userId/dId/variableid/sdata"
      const connectUrl = `${process.env.mqtt_prefix}://${this.options.host}:${this.options.port}${this.options.endpoint}`;

      try {
        this.client = mqtt.connect(connectUrl, this.options);
      } catch (e) {
        console.log(e);
      }

      this.client.on("connect", () => {
        console.log('conectaado')

        this.client.subscribe([deviceSubscribeTopic, notifSubscribeTopic], err => {
          if (err) return err;
        });
        this.client.subscribe(statusSubscribeTopic, {qos:0}, err => {
          if (err) return err;

        });
      });

      this.client.on("error", err => {
      });

      this.client.on("reconnect", err => {
        this.getMqttCredentialsForReconnection();

      });

      this.client.on("message", (topic, message) => {
        console.log('mensaje de recibido', message.toString())
        const splittedTopic = topic.split("/");
        const msgType = splittedTopic[3]; // sdata, notif

        if (msgType == "notif") {
          this.$notify({
            type: "danger",
            icon: "tim-icons icon-bell-55",
            message: message.toString()
          });
          this.getNotifications();
        }else if (msgType == "sdata") {
          this.$nuxt.$emit(topic, JSON.parse(message.toString()));
        }else if(msgType=='status'){
          const msg = JSON.parse(message.toString());
          setTimeout(()=>{
            this.getDevices(); // update the view
          },5000)
          const deviceName = msg.name;
          const status = msg.status;
          if(status=='offline'){
            this.$notify({
            type: "danger",
            icon: "tim-icons icon-bell-55",
            message: `ATENCIÓN: "${deviceName}" Fuera de Línea` 
          });

          }else if (status=='online'){
            this.$notify({
            type: "success",
            icon: "tim-icons icon-bell-55",
            message: `ATENCIÓN: "${deviceName}" En Línea` 
          });
          }
          
        }
      });

      this.$nuxt.$on("mqtt-sender", toSend => {
        this.client.publish(toSend.topic, JSON.stringify(toSend.msg));
      });
    },
    findDevice(dId){
      const devices = this.$store.getters['devices/getDevices'];
      const {name} = devices.find(device => device.dId == dId) 
      return name;
    },
    async getNotifications() {
      try {
        await this.$store.dispatch("notif/fetchNotifications");
        await this.$store.dispatch("notif/fetchNotificationsForDevice",1);
      } catch (e) {
        this.$notify({
          type: "danger",
          icon: "tim-icons icon-alert-circle-exc",
          message: e
        });
      }
    },
    
    async getDevices() {
      try {
        await this.$store.dispatch("devices/fetchDevices");
        await this.$store.dispatch("notif/fetchNotificationsForDevice",1);
      } catch (e) {
        console.log('ERROR GET DEVICES (default.vue)')
      }
    },
    async getMqttCredentials() {
      try {
        const token = this.$store.getters["auth/getToken"];
        const axiosHeader = {
          headers: {
            "x-auth-token": token
          }
        };
        const credentials = await this.$axios.post(
          "/user/getmqttcredentials",
          null,
          axiosHeader
        );
        
        this.options.username = credentials.data.username;
        this.options.password = credentials.data.password;
      } catch (e) {
        console.log('ERROR GETMQTTCREDENTIALS');
        if(e.response.status === 400){
          localStorage.clear();
          this.$store.commit('auth/setAuth',null);
          this.$router.replace('/')
        }
      }
    },
    async getMqttCredentialsForReconnection(){
      try {
        const token = this.$store.getters["auth/getToken"];
        const axiosHeader = {
          headers: {
            "x-auth-token": token
          }
        };
    
        const credentials = await this.$axios.post(
          "/user/getmqttcredentialsforreconnection",
          null,
          axiosHeader
        );
        this.client.options.username = credentials.data.username;
        this.client.options.password = credentials.data.password;
      } catch (e) {
        if(e.response.status === 400){
          localStorage.clear();
          this.$store.commit('auth/setAuth',null);
          this.$router.replace('/')
        }
      }
    },

    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    },
    initScrollbar() {
      let docClasses = document.body.classList;
      let isWindows = navigator.platform.startsWith("Win");
      if (isWindows) {
        // if we are on windows OS we activate the perfectScrollbar function
        initScrollbar("sidebar");
        initScrollbar("main-panel");
        initScrollbar("sidebar-wrapper");

        docClasses.add("perfect-scrollbar-on");
      } else {
        docClasses.add("perfect-scrollbar-off");
      }
    },

  },
  async mounted() {
    this.initScrollbar();
    
    setTimeout(() => {
      this.startMqttClient();
    }, 2000);
  },
  beforeDestroy() {
    this.$nuxt.$off("mqtt-sender");
  }
};
</script>

<style lang="scss">
$scaleSize: 0.95;
@keyframes zoomIn95 {
  from {
    opacity: 0;
    transform: scale3d($scaleSize, $scaleSize, $scaleSize);
  }
  to {
    opacity: 1;
  }
}

.main-panel .zoomIn {
  animation-name: zoomIn95;
}

@keyframes zoomOut95 {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: scale3d($scaleSize, $scaleSize, $scaleSize);
  }
}

.main-panel .zoomOut {
  animation-name: zoomOut95;
}
</style>
