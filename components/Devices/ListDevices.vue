<template>
  <div>
    <LoadingMainPanel v-if="isLoading"></LoadingMainPanel>
    <div v-else-if="devices.length > 0" class="row">
      <card>
        <template slot="header">
          <h4 class="card-title">My Devices</h4>
        </template>

        <el-table :data="devices">
          <el-table-column label="#" min-width="50" align="center">
            <div slot-scope="{ row, $index }">
              {{ $index + 1 }}
            </div>
          </el-table-column>

          <el-table-column prop="name" label="Name"></el-table-column>

          <el-table-column prop="dId" label="Device Id"></el-table-column>

          <el-table-column label="Password">
            <template slot-scope="{ row }">
              <el-tooltip
                content="A secret for your device to conect to the broker MQTT"
                :open-delay="300"
                placement="top"
                ><i class="fas fa-info" style="margin-right:5px"></i>
              </el-tooltip>

              {{ row.whpassword }}
            </template>
          </el-table-column>

          <el-table-column
            prop="alarmRules.length"
            label="Alarm Rules"
          ></el-table-column>

          <el-table-column
            prop="templateName"
            label="Template"
          ></el-table-column>

          <el-table-column label="Actions">
            <div slot-scope="{ row, $index }">
              <el-tooltip
                content="Saver Status Indicator"
                style="margin-right:10px"
              >
                <i
                  class="fas fa-database "
                  :class="{
                    'text-success': row.saverRule.status,
                    'text-dark': !row.saverRule.status
                  }"
                ></i>
              </el-tooltip>

              <el-tooltip
                content="DB Saver"
                effect="light"
                :open-delay="300"
                placement="top"
              >
                <base-switch
                  @click="updateSaverRuleStatus(row)"
                  type="info"
                  style=""
                  :value="row.saverRule.status"
                  onText="ON"
                  offText="OFF"
                >
                </base-switch>
              </el-tooltip>

              <el-tooltip
                content="Delete"
                effect="light"
                :open-delay="300"
                placement="top"
              >
                <base-button
                  type="danger"
                  icon
                  size="sm"
                  class="btn-link"
                  @click="showModalDeleteDevice(row)"
                >
                  <i class="tim-icons icon-simple-remove "></i>
                </base-button>
              </el-tooltip>
            </div>
          </el-table-column>
        </el-table>
      </card>
    </div>

    <modal :show="deviceToDelete != null" v-if="deviceToDelete">
      <template slot="header">
        <h5 class="modal-title" id="exampleModalLabel">Atention!</h5>
      </template>
      <div>
        Are you sure to
        <a class="text-danger">
          DELETE "{{ deviceToDelete.name.toUpperCase() }}"</a
        >
        device?
        <div v-if="hasAlarmRules">
          The <a class="text-danger">ALARM-RULES</a> associates will be deleted
        </div>
      </div>
      <template slot="footer">
        <base-button type="secondary" @click="closeModalDevice">NO</base-button>
        <base-button type="info" @click="deleteDevice(deviceToDelete)"
          >YES</base-button
        >
      </template>
    </modal>
  </div>
</template>

<script>
import { Table, TableColumn } from "element-ui";
import BaseSwitch from "../../components/BaseSwitch.vue";
import LoadingPanel from "../../components/LoadingPanel.vue";
import Modal from "../../components/Modal.vue";
export default {
  components: {
    BaseSwitch,
    LoadingPanel,
    Modal,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn
  },
  data() {
    return {
      isLoading: false,
      deviceToDelete: null,
      hasAlarmRules: false
    };
  },
  methods: {
    async deleteDevice(device) {
      try {
        await this.$store.dispatch("devices/deleteDevice", device);
        await this.$store.dispatch("devices/fetchDevices");
        this.$notify({
          type: "success",
          icon: "tim-icons icon-check-2",
          message: `Device "${device.name.toUpperCase()}" deleted!`
        });
        this.deviceToDelete = null;
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
      } catch (e) {
        this.$notify({
          type: "danger",
          icon: "tim-icons icon-alert-circle-exc",
          message: e
        });
      }
    },
    async updateSaverRuleStatus(device) {
      try {
        await this.$store.dispatch("devices/updateSaverRule", {
          status: !device.saverRule.status,
          emqxRuleId: device.saverRule.emqxRuleId
        });
        await this.getDevices();
        this.$notify({
          type: "success",
          icon: "tim-icons icon-check-2",
          message: `Saver rule ${device.saverRule.status ? "OFF" : "ON"}`
        });
      } catch (e) {
        this.$notify({
          type: "danger",
          icon: "tim-icons icon-check-2",
          message: e
        });
      }
    },
    closeModalDevice() {
      this.deviceToDelete = null;
    },
    showModalDeleteDevice(device) {
      if (device.alarmRules.length > 0) {
        this.deviceToDelete = device;
        this.hasAlarmRules = true;
      } else {
        this.deviceToDelete = device;
        this.hasAlarmRules = false;
      }
    }
  },
  computed: {
    devices() {
      return this.$store.getters["devices/getDevices"];
    },
    
  },
  created() {}
};
</script>
