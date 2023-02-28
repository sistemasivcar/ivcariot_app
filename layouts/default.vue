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
    

    <sidebar-share :background-color.sync="sidebarBackground"></sidebar-share>

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
import i18n from '../locales/i18n.js';
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
    return this.$nuxtI18nHead()
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
      options: {
        host: "localhost",
        port: 8083,
        endpoint: "/mqtt",
        clean: true,
        connectTimeout: 5000,
        reconnectPeriod: 5000,
        // crendentials info
        clientId: `web_${this.$store.getters["auth/getUserName"]}_${Math.floor(
          Math.random() * 1000000 + 1
        )}`,
        username: null,
        password: null
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
    }
  },
  methods: {
    async startMqttClient() {
      await this.getMqttCredentials();

      const userId = this.$store.getters["auth/getUserId"];

      const deviceSubscribeTopic = `${userId}/+/+/sdata`;
      const notifSubscribeTopic = `${userId}/+/+/notif`;
      // ex. topic: "userId/dId/variableid/sdata"
      const connectUrl = `ws://${this.options.host}:${this.options.port}${this.options.endpoint}`;
      console.log(connectUrl);

      try {
        this.client = mqtt.connect(connectUrl, this.options);
      } catch (e) {
        console.log(e);
      }

      this.client.on("connect", () => {
        console.log("MQTT CONNECTION SUCCESS!");

        this.client.subscribe(deviceSubscribeTopic, { qos: 0 }, err => {
          if (err) return err;
          // console.log("Devicesubscription success!");
          // console.log(deviceSubscribeTopic);
        });

        this.client.subscribe(notifSubscribeTopic, { qos: 0 }, err => {
          if (err) return err;
          // console.log("Notifsubscription success!");
          // console.log(notifSubscribeTopic);
        });
      });

      this.client.on("error", err => {
        console.log("connection failed");
      });

      this.client.on("reconnect", err => {
        console.log("reconnectig...", err);
        this.getMqttCredentialsForReconnection();

      });

      this.client.on("message", (topic, message) => {
        console.log("Message MQTT from topic -> ", topic);
        console.log("message: ", message.toString());

        const splittedTopic = topic.split("/");
        const msgType = splittedTopic[3]; // sdata, notif

        if (msgType == "notif") {
          this.$notify({
            type: "danger",
            icon: "tim-icons icon-bell-55",
            message: message.toString()
          });
          this.getNotifications();
        } else if (msgType == "sdata") {
          this.$nuxt.$emit(topic, JSON.parse(message.toString()));
        }
      });

      this.$nuxt.$on("mqtt-sender", toSend => {
        this.client.publish(toSend.topic, JSON.stringify(toSend.msg));
      });
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
        console.log(e);
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
        console.log(e);
          localStorage.clear();
          this.$store.commit('auth/setAuth',null);
          this.$router.replace('/')
      }
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
    console.log(i18n.defaultLocale);
    this.initScrollbar();
    setTimeout(() => {
      this.startMqttClient();
    }, 2000);
    this.getNotifications();
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
