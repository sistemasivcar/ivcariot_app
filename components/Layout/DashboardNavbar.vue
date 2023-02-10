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
          <div class="notification d-none d-lg-block d-xl-block"></div>
          <i class="tim-icons icon-sound-wave"></i>
          <p class="d-lg-none">New Notifications</p>
        </template>
        <li class="nav-link">
          <a href="#" class="nav-item dropdown-item"
            >Mike John responded to your email</a
          >
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
          <div class="photo"><img src="/img/mike.jpg" /></div>
          <b class="caret d-none d-lg-block d-xl-block"></b>
          <p class="d-lg-none">Log out</p>
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
export default {
  components: {
    CollapseTransition,
    BaseNav,
    [Select.name]: Select,
    [Option.name]: Option
  },
    data() {
      return {
        activeNotifications: false,
        showMenu: false,
        searchModalVisible: false,
        searchQuery: "",
        selectedDeviceIndex: null,
  
      };
    },
  async mounted() {
    await this.getDevices();
    this.$store.commit('devices/setSelectedDevice')
    this.getSelectedDevice();
  },
  computed: {
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
    async getDevices() {
      try {
        await this.$store.dispatch("devices/fetchDevices");
      } catch (e) {
        this.$notify({
          type: "danger",
          icon: "tim-icons icon-alert-circle-exc",
          message: e
        });
      }
    },
    async selectDevice() {
      try {
        const devices = this.$store.getters['devices/getDevices'];
        const deviceSelected = devices[this.selectedDeviceIndex];
        await this.$store.dispatch('devices/updateSelected', deviceSelected);
        await this.$store.dispatch('devices/fetchDevices');
        await this.$store.commit('devices/setSelectedDevice');

      } catch (e) {
        console.log(e)
      }
    },
    async getSelectedDevice(){
      if (this.$store.getters['devices/hasDevices']) {
        this.selectedDeviceIndex=this.$store.getters['devices/getIndexSelectedDevice']
      }else{
        this.selectedDeviceIndex=null;
      }


    },
    logout() {
      console.log("logout");
      this.$store.dispatch("logout");
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
  }
};
</script>
<style scoped>
.top-navbar {
  top: 0px;
}
</style>
