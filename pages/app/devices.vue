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
            v-model="deviceName"
              label="Device Name"
              type="text"
              placeholder="Ex: Home, Office..."
            >
            </base-input>
          </div>

          <div class="col-4">
            <base-input
            v-model="deviceId"
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
              placeholder="Select Template"
              class="select-primary"
              style="width:100%"
            >
              <el-option
                class="text-dark"
                value="Template 1"
                label="Template 1"
              ></el-option>

              <el-option
                class="text-dark"
                value="Template 2"
                label="Template 2"
              ></el-option>

              <el-option
                class="text-dark"
                value="Template 3"
                label="Template 3"
              ></el-option>
            </el-select>
          </div>
        </div>

        <div class="row pull-right">
          <div class="col-12">
            <base-button type="primary" class="mb-3" size="lg">Add</base-button>
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

                <el-tooltip content="Saver Status Indicator" style="margin-right:10px">
                <i class="fas fa-database " :class="{'text-success' : row.saverRule, 'text-dark' : !row.saverRule}" ></i>
              </el-tooltip>

              <el-tooltip
                content="DB Saver"
                effect="light"
                :open-delay="300"
                placement="top"
              >
                <base-switch
                @click="updateSaverRuleStatus($index)"
                  type="primary"
                  style="background:rgba(253,93,147,0.4)"
                  :value="row.saverRule"
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
                  @click="deleteDevice(row)"
                >
                  <i class="tim-icons icon-simple-remove "></i>
                </base-button>
              </el-tooltip>
            </div>
          </el-table-column>
        </el-table>
      </card>
    </div>
    <json :value="$store.getters['devices/getDevices']"></json>
  </div>
</template>

<script>
export default {
  components: { BaseSwitch, LoadingPanel },};
</script>

<style></style>

<script>
import { Table, TableColumn } from "element-ui";
import { Select, Option } from "element-ui";
import BaseSwitch from '../../components/BaseSwitch.vue';
import LoadingPanel from '../../components/LoadingPanel.vue';
export default {
  middleware:'authtenticated',
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Option.name]: Option,
    [Select.name]: Select
  },
  data() {
    return {
      deviceName:null,
      deviceId:null,
      templateId:null,
      isLoading:false

    };
  },
  computed:{
    devices(){
      return this.$store.getters['devices/getDevices'];
    }
  },
  methods: {
    async getDevices(){
      try {
      await this.$store.dispatch('devices/fetchDevices')

    } catch (e) {
      this.$notify({
          type: "danger",
          icon:'tim-icons icon-alert-circle-exc',
          message:e
      });
    }
      
    },

    async newDevice(){

      try {
        await this.$store.dispatch('devices/newDevice')
      } catch (e) {
        this.$notify({
          type: "danger",
          icon:'tim-icons icon-alert-circle-exc',
          message:e
        })
      }
    },
    async deleteDevice(device) {
      try {
        await this.$store.dispatch('devices/deleteDevice', device);
          this.$notify({
          type: "success",
          icon: "tim-icons icon-check-2",
          message: ` "${device.name.toUpperCase()}" deleted!`
        });
        
      } catch (e) {
        this.$notify({
          type: "danger",
          icon:'tim-icons icon-alert-circle-exc',
          message:e
      });
      }
    },
    updateSaverRuleStatus(index){
        this.devices[index].saverRule=!this.devices[index].saverRule;
    }
  },
  mounted(){
    this.isLoading=true;
    this.getDevices();
    this.isLoading=false;
  }
  
};
</script>
