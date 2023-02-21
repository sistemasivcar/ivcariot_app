<template>
  <div class="row">
    <card>
      <template slot="header">
        <h4 class="card-title" v-if="deviceSelected">
          Notifications for Device: <strong> {{ deviceSelected.name }}</strong>
        </h4>
      </template>

      <el-table :data="notifications">
        <el-table-column label="fecha">
          <template slot-scope="{ row }">{{
            unixToDate(row.createdTime)
          }}</template></el-table-column
        >
        <el-table-column
          prop="variableFullName"
          label="Var name"
        ></el-table-column>
        <el-table-column prop="payload.value" label="with"></el-table-column>
        <el-table-column prop="condition" label="condition"></el-table-column>
        <el-table-column prop="value" label="value"></el-table-column>
      </el-table>
      <base-button
        type="info"
        size="sm"
        @click="next"
        :disabled="notifications.length <= 10 && currentPage != 1"
        class="pull-right mr-2 ml-3"
        icon
      >
        <i class="tim-icons icon-minimal-right"></i>
      </base-button>
      <base-button
        type="info"
        size="sm"
        icon
        @click="prev"
        :disabled="currentPage == 1"
        class="pull-right"
      >
        <i class="tim-icons icon-minimal-left"></i>
      </base-button>
    </card>
  </div>
</template>

<script>
import { Table, TableColumn } from "element-ui";
import BaseTable from "../../components/BaseTable.vue";
import Card from "../../components/Cards/Card.vue";
import UserTable from "../../components/Dashboard/UserTable.vue";
export default {
  components: {
    BaseTable,
    Card,
    UserTable,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn
  },

  middleware: "authtenticated",
  data() {
    return {
      currentPage: 1
    };
  },
  methods: {

    async next() {
      this.currentPage = this.currentPage + 1;
      try {
        await this.$store.dispatch(
          "notif/fetchNotificationsForDevice",
          this.currentPage
        );
      } catch (e) {
        console.log(e);
      }
    },
    async prev() {
      try {
        this.currentPage = this.currentPage - 1;

        await this.$store.dispatch(
          "notif/fetchNotificationsForDevice",
          this.currentPage
        );
      } catch (e) {
        console.log(e);
      }
    },
    unixToDate(ms) {
      var d = new Date(parseInt(ms)),
        yyyy = d.getFullYear(),
        mm = ("0" + (d.getMonth() + 1)).slice(-2), // Months are zero based. Add leading 0.
        dd = ("0" + d.getDate()).slice(-2), // Add leading 0.
        hh = d.getHours(),
        h = hh,
        min = ("0" + d.getMinutes()).slice(-2), // Add leading 0.
        ampm = "AM",
        time;
      if (hh > 12) {
        h = hh - 12;
        ampm = "PM";
      } else if (hh === 12) {
        h = 12;
        ampm = "PM";
      } else if (hh == 0) {
        h = 12;
      }
      // ie: 2013-02-18, 8:35 AM
      time = dd + "/" + mm + "/" + yyyy + ", " + h + ":" + min + " " + ampm;
      return time;
    }
  },
  computed: {
    notifications() {
      return this.$store.getters["notif/getDeviceNotifications"];
    },
    deviceSelected() {
      return this.$store.getters["devices/getSelectedDevice"];
    }
  },
  mounted() {
    
  }
};
</script>
