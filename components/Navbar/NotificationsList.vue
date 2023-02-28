<template>
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
          <b class="caret d-none d-lg-block d-xl-block"></b>
          <p class="d-lg-none">{{$t('dashboardnavbar.notifications.title')}}</p>
        </template>
        <div v-if="notifs.length > 0">
          <NotificationItem
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
          </NotificationItem>
        </div>
        <li v-else>
          <a href="#" class="nav-item dropdown-item"> {{$t('dashboardnavbar.notifications.nonotifs')}}</a>
        </li>
        <div class="dropdown-divider"></div>
        <li class="nav-link">
          <nuxt-link class="nav-item dropdown-item" :to="`${locale}/app/notifications`"
            >{{$t('dashboardnavbar.notifications.viewhistory')}}</nuxt-link>
        </li>
      </base-dropdown>
</template>


<script>
import NotificationItem from "./NotificationItem.vue";
export default {
    components: {
    NotificationItem,
  },
  data() {
    return {
      
    };
  },
  computed:{
    notifs() {
      return this.$store.getters["notif/getUnrededNotifications"];
    },
    locale() {
      const locale = this.$store.state.locale.locale;
      if (locale == 'es') return '';
      return this.$store.state.locale.locale;
    },
  },
  methods:{
    async setReaded(notifId) {
      try {
        await this.$store.dispatch("notif/setReaded", notifId);
        await this.$store.dispatch('notif/fetchNotifications');
      } catch (e) {
        console.log(e)
      }
    },
    
  },
 
};
</script>