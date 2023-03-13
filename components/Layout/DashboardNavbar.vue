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
      <a @click="toggleSidebar" class="navbar-brand ml-xl-3 ml-5" href="#">{{
        routeName
      }}</a>
    </div>

    <ul class="navbar-nav" :class="$rtl.isRTL ? 'mr-auto' : 'ml-auto'">

      <DeviceSelector></DeviceSelector>

      <LanguajeSwitcher></LanguajeSwitcher>

      <NotificationsList></NotificationsList>

      <!-- USER -->
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
          <p class="d-lg-none"></p>
        </template>
        <li class="nav-link">
          <nuxt-link
            class="nav-item dropdown-item"
            :to="`${locale}/app/profile`"
            >{{ $t("dashboardnavbar.user.profile") }}</nuxt-link
          >
        </li>
        <li class="nav-link">
          <nuxt-link
            :to="`${locale}/app/config`"
            class="nav-item dropdown-item"
            >{{ $t("dashboardnavbar.user.settings") }}</nuxt-link
          >
        </li>
        <li class="nav-link">
          <nuxt-link
            class="nav-item dropdown-item"
            :to="`${locale}/app/docs`"
            >{{ $t("dashboardnavbar.user.help") }}</nuxt-link
          >
        </li>
        <div class="dropdown-divider"></div>
        <li class="nav-link">
          <a @click="logout()" class="nav-item dropdown-item">{{
            $t("dashboardnavbar.user.logout")
          }}</a>
        </li>
      </base-dropdown>
    </ul>
  </base-nav>
</template>
<script>
import { CollapseTransition } from "vue2-transitions";
import { BaseNav } from "@/components";
import { Select, Option } from "element-ui";
import DeviceSelector from "../Navbar/DeviceSelector.vue";
import NotificationsList from "../Navbar/NotificationsList.vue";
import LanguajeSwitcher from "../Navbar/LanguajeSwitcher.vue";

export default {
  components: {
    CollapseTransition,
    BaseNav,
    [Select.name]: Select,
    [Option.name]: Option,
    DeviceSelector,
    NotificationsList,
    LanguajeSwitcher
  },
  data() {
    return {
      activeNotifications: false,
      showMenu: false,
      searchModalVisible: false,
      searchQuery: ""
    };
  },
  computed: {
    locale() {
      const locale = this.$store.state.locale.locale;
      if (locale == "es") return "";
      return this.$store.state.locale.locale;
    },

    routeName() {
      const { path } = this.$route;
      let parts = path.split("/");
      if (parts == ",") {
        return "Dashboard";
      }

      if (parts[1] == "en") {
        const page = parts.splice(3);
        return page[0];
      }

      const page = parts.splice(2);
      return page[0];
    },
    isRTL() {
      return this.$rtl.isRTL;
    }
  },

  methods: {
    logout() {
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
  }
};
</script>
<style scoped>
.top-navbar {
  top: 0px;
}
</style>
