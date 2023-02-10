<template>
  <div>
    <!-- FORM ADD DEVICE -->
    <div class="row">
      <card>
        <div slot="header">
          <h4 class="card-title">Add new Device</h4>
        </div>

        <div class="row">
          <div class="col-4">
            <base-input
              v-model.trim="deviceName"
              label="Device Name"
              type="text"
              placeholder="Ex: Home, Office..."
            >
            </base-input>
          </div>

          <div class="col-4">
            <base-input
              v-model.trim="deviceId"
              label="Device Id"
              type="text"
              placeholder="Ex: 7777-8888"
            >
            </base-input>
          </div>

          <div class="col-4">
            <slot name="label">
              <label> Template </label>
            </slot>

            <el-select
              value="1"
              v-model="templateSelectedIndex"
              placeholder="Select Template"
              class="select-info"
              style="width:100%"
            >
              <el-option
                v-for="(template, index) in templates"
                :key="template._id"
                class="text-dark"
                :value="index"
                :label="template.name"
              ></el-option>
            </el-select>
          </div>
        </div>

        <div class="row pull-right">
          <div class="col-12">
            <base-button type="info" @click="newDevice()" class="mb-3" size="lg"
              >Add</base-button
            >
          </div>
        </div>
      </card>
    </div>

    <!-- DEVICES TABLE -->
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
                  type="primary"
                  style="background:rgba(0, 228, 106, 0.8)"
                  :value="row.saverRule.status"
                  onText="On"
                  offText="Off"
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
        Are you sure you wanna DELETE "{{ deviceToDelete.name.toUpperCase() }}"
        device?
      </div>
      <template slot="footer">
        <base-button type="secondary" @click="closeModalDevice">NO</base-button>
        <base-button type="info" @click="deleteDevice(deviceToDelete)"
          >YES</base-button
        >
      </template>
    </modal>

  <!-- <json :value="$store.state.devices.selectedDevice"></json> -->
    <json :value="$store.getters['devices/getDevices']"></json>
    <!-- <json :value="templates"></json> -->
  </div>
</template>

<script>
export default {
  components: { BaseSwitch, LoadingPanel, Modal }
};
</script>

<style></style>

<script>
import { Table, TableColumn } from "element-ui";
import { Select, Option } from "element-ui";
import BaseSwitch from "../../components/BaseSwitch.vue";
import LoadingPanel from "../../components/LoadingPanel.vue";
import Modal from "../../components/Modal.vue";
export default {
  middleware: "authtenticated",
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Option.name]: Option,
    [Select.name]: Select
  },
  data() {
    return {
      deviceName: null,
      deviceId: null,
      templateSelectedIndex: null,
      templates: [],
      isLoading: false,
      deviceToDelete: null
    };
  },
  computed: {
    devices() {
      return this.$store.getters["devices/getDevices"];
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

    async getTemplates() {
      try {
        const token = this.$store.state.auth.auth.token;
        const axiosHeaders = {
          headers: {
            "x-auth-token": token
          }
        };

        const res = await this.$axios.get("/template", axiosHeaders);
        if (res.data.status == "success") {
          this.templates = res.data.data;
          console.log("get tempalte OK");
        }
      } catch (e) {
        console.log(e);
        this.$notify({
          type: "danger",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Fail to load templates"
        });
      }
    },

    async newDevice() {
      if (!this.deviceName) {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: " Device Name is Empty"
        });
        return;
      }
      if (!this.deviceId) {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: " Device ID is Empty"
        });
        return;
      }
      if (this.templateSelectedIndex === null) {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: " Please, Select a Template"
        });
        return;
      }
      try {
        const templateSelected = this.templates[this.templateSelectedIndex];
        const newDevice = {
          name: this.deviceName,
          dId: this.deviceId,
          templateId: templateSelected._id,
          templateName: templateSelected.name
        };
        await this.$store.dispatch("devices/newDevice", newDevice);
        await this.$store.dispatch("devices/fetchDevices");
        await this.$store.commit('devices/setSelectedDevice');
        this.$notify({
          type: "success",
          icon: "tim-icons icon-check-2",
          message: `Device "${this.deviceName.toUpperCase()}" created!`
        });
      } catch (e) {
        console.log(e);
        this.$notify({
          type: "danger",
          icon: "tim-icons icon-alert-circle-exc",
          message: e
        });
      }
    },
    async deleteDevice(device) {
      try {
        await this.$store.dispatch("devices/deleteDevice", device);
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
    async updateSaverRuleStatus(device) {

      try {
        await this.$store.dispatch("devices/updateSaverRule", {
          status: !device.saverRule.status,
          emqxRuleId:device.saverRule.emqxRuleId
        });
        await this.getDevices();
        this.$notify({
          type: "success",
          icon: "tim-icons icon-check-2",
          message: `Saver rule ${device.saverRule.status? 'OFF' : 'ON'}`
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
      this.deviceToDelete = device;
    }
  },
  mounted() {
    this.isLoading = true;
    this.getTemplates();
    this.isLoading = false;
  }
};
</script>
