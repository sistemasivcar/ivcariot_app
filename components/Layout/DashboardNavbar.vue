<template>
  <base-nav
    v-model="showMenu"
    class="navbar-absolute top-navbar"
    type="white"
    :transparent="true"
  >
    <div slot="brand" class="navbar-wrapper">
      <div
        class="navbar-toggle d-inline"
        :class="{ toggled: $sidebar.showSidebar }"
      >
        <button type="button" class="navbar-toggler" @click="toggleSidebar">
          <span class="navbar-toggler-bar bar1"></span>
          <span class="navbar-toggler-bar bar2"></span>
          <span class="navbar-toggler-bar bar3"></span>
        </button>
      </div>
      <a class="navbar-brand ml-xl-3 ml-5" href="#pablo">{{ routeName }}</a>
    </div>

    <ul class="navbar-nav" :class="$rtl.isRTL ? 'mr-auto' : 'ml-auto'">
      <el-select
        class="select-info"
        placeholder="Select Device"
        @change="selectDevice()"
        v-model="selectedDeviceIndex"
      >
        <el-option
          v-for="(device, index) in devices"
          :value="index"
          :label="device.name.toUpperCase()"
          :key="device._id"
        >
        </el-option>
      </el-select>

      <base-dropdown
        tag="li"
        :menu-on-right="!$rtl.isRTL"
        title-tag="a"
        title-classes="nav-link"
        class="nav-item"
      >
        <template slot="title">
          <div
            class="notification d-none d-lg-block d-xl-block"
            v-if="notifs.length > 0"
          ></div>
          <i class="tim-icons icon-bell-55"></i>
          <p class="d-lg-none">New Notifications</p>
        </template>
        <div v-if="notifs.length > 0">
          <notification-item
            v-for="notif in notifs"
            :key="notif._id"
            :condition="notif.condition"
            :dId="notif.dId"
            :time="notif.createdTime"
            :idNotif="notif._id"
            :valueToMatch="notif.value"
            :value="notif.payload.value"
            :varName="notif.variableFullName"
            @setNotifReaded="setReaded"
          >
          </notification-item>
        </div>
        <li v-else>
          <a href="#" class="nav-item dropdown-item"> No New Notifications</a>
        </li>
      </base-dropdown>

      <base-dropdown
        tag="li"
        :menu-on-right="!$rtl.isRTL"
        title-tag="a"
        class="nav-item"
        title-classes="nav-link"
        menu-classes="dropdown-navbar"
      >
        <template slot="title">
          <i class="tim-icons icon-single-02"></i>
          <b class="caret d-none d-lg-block d-xl-block"></b>
          <p class="d-lg-none" @click="logout">Log out</p>
        </template>
        <li class="nav-link">
          <nuxt-link class="nav-item dropdown-item" to="/app/profile"
            >Profile</nuxt-link
          >
        </li>
        <li class="nav-link">
          <a href="#" class="nav-item dropdown-item">Settings</a>
        </li>
        <div class="dropdown-divider"></div>
        <li class="nav-link">
          <a @click="logout()" class="nav-item dropdown-item">Log out</a>
        </li>
      </base-dropdown>
    </ul>
  </base-nav>
</template>
<script>
import { CollapseTransition } from "vue2-transitions";
import { BaseNav } from "@/components";
import { Select, Option } from "element-ui";
import NotificationItem from "../Navbar/NotificationItem.vue";
export default {
  components: {
    CollapseTransition,
    BaseNav,
    NotificationItem,
    [Select.name]: Select,
    [Option.name]: Option
  },
  data() {
    return {
      activeNotifications: false,
      showMenu: false,
      searchModalVisible: false,
      searchQuery: "",
      selectedDeviceIndex: null
    };
  },
  async mounted() {
    this.$nuxt.$on("selectedDeviceIndex", this.setSelectedDeviceIndex);
    this.getDevices();
  },
  computed: {
    notifs() {
      return this.$store.getters["notif/getUnrededNotifications"];
    },
    devices() {
      return this.$store.getters["devices/getDevices"];
    },

    routeName() {
      const { path } = this.$route;
      let parts = path.split("/");
      if (parts == ",") {
        return "Dashboard";
      }
      return parts.map(p => this.capitalizeFirstLetter(p)).join(" ");
    },
    isRTL() {
      return this.$rtl.isRTL;
    }
  },

  methods: {
    async setReaded(notifId) {
      try {
        await this.$store.dispatch("notif/setReaded", notifId);
        await this.$store.dispatch('notif/fetchNotifications');
      } catch (e) {
        console.log(e)
      }
    },
    async getDevices() {
      try {
        await this.$store.dispatch("devices/fetchDevices");
        await this.$store.dispatch("notif/fetchNotificationsForDevice",1);
      } catch (e) {
        console.log(e)
      }
    },
    async selectDevice() {
      try {
        const devices = this.$store.getters["devices/getDevices"];
        const deviceSelected = devices[this.selectedDeviceIndex];
        await this.$store.dispatch("devices/updateSelected", deviceSelected);
        await this.$store.dispatch("devices/fetchDevices");
        await this.$store.dispatch("notif/fetchNotificationsForDevice",1);
      } catch (e) {
        console.log(e);
      }
    },
    setSelectedDeviceIndex(device) {
      this.selectedDeviceIndex = device;
    },

    logout() {
      console.log("salir");
      this.$store.dispatch("auth/logout");
    },
    capitalizeFirstLetter(string) {
      if (!string || typeof string !== "string") {
        return "";
      }
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    closeDropDown() {
      this.activeNotifications = false;
    },
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
    },
    toggleMenu() {
      this.showMenu = !this.showMenu;
    }
  },
  beforeDestroy() {
    this.$nuxt.$off("selectedDeviceIndex");
  }
};
</script>
<style scoped>
.top-navbar {
  top: 0px;
}
</style>
