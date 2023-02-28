<template>
  <div class="row">
    <card>
      <div slot="header">
        <h4 class="card-title">{{$t('devices.new.title')}}</h4>
      </div>

      <div class="row">
        <div class="col-12 col-md-4">
          <base-input
            v-model.trim="deviceName"
            :label="$t('devices.new.name')"
            type="text"
             :class="{'has-danger': !inputs.deviceName}"
            placeholder="Ex: Home, Office..."
          >
          </base-input>
        </div>

        <div class="col-12 col-md-4">
          <base-input
            v-model.trim="deviceId"
             :class="{'has-danger': !inputs.deviceId}"
            :label="$t('devices.new.id')"
            type="text"
            placeholder="Ex: 7777-8888"
          >
          </base-input>
        </div>

        <div class="col-12 col-md-4">
          <slot name="label">
            <label> {{$t('devices.new.templateinp')}} </label>
          </slot>

          <el-select
            value="1"
            v-model="templateSelectedIndex"
            :placeholder="$t('devices.new.template')"
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
        <div class="col-12 col-md-12 mt-2">
          <base-button type="info" @click="newDevice()" :loading="addLoading" class="mb-3" size="lg"
            >{{$t('devices.new.btn')}} <i class="fa fa-plus ml-2"></i></base-button
          >
        </div>
      </div>
      <div v-if="!hasTemplates">
        {{$t('devices.new.notemplatestxt')}}
        <BaseButton
          :link="true"
          @click="$router.push('/app/templates')"
          type="info"
          >{{$t('devices.new.notemplatesbtn')}}</BaseButton
        >
      </div>
    </card>
  </div>
</template>

<script>
import { Select, Option} from 'element-ui';
import BaseButton from '../BaseButton.vue';
export default {
  components: {
    [Option.name]: Option,
    [Select.name]: Select,
    BaseButton
},
  data() {
    return {
      deviceName: null,
      deviceId: null,
      addLoading:false,
      templates: [],
      inputs: {
        deviceName: true,
        deviceId:true,
      },
      templateSelectedIndex: null
    };
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
    validateForm() {
      if (!this.deviceName || !this.deviceId || this.templateSelectedIndex == null) {
        this.isValidForm = false
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: `${this.$t('devices.new.invalidinp')}`
        });
        return
      }
      this.isValidForm = true;
    },

    async newDevice() {
      this.validateForm();
      if (!this.isValidForm) return;

      try {
        this.addLoading=true;
        const templateSelected = this.templates[this.templateSelectedIndex];
        const newDevice = {
          name: this.deviceName,
          dId: this.deviceId,
          status:false,
          templateId: templateSelected._id,
          templateName: templateSelected.name
        };
        await this.$store.dispatch("devices/newDevice", newDevice);
        await this.$store.dispatch("devices/fetchDevices");
        this.$notify({
          type: "success",
          icon: "tim-icons icon-check-2",
          //message: `Device "${newDevice.name.toUpperCase()}" created!`
          message:`${this.$t('devices.new.ok {device}',{device:newDevice.name.toUpperCase()})}`
        });
      } catch (e) {
        this.$notify({
          type: "danger",
          icon: "tim-icons icon-alert-circle-exc",
          message: e
        });
      }finally{
        this.addLoading=false;
      }
    }
  },
    computed: {
    hasTemplates() {
      return this.templates.length > 0;
    }
  },
  watch: {

    deviceName(val) {
      if (!val) {
        this.inputs.deviceName = false;
      } else {
        this.inputs.deviceName = true;
      }
    },
    deviceId(val) {
      if (!val) {
         this.inputs.deviceId = false;
      } else {
        this.inputs.deviceId = true;
      }
    }


    
  },
    created() {
        this.getTemplates();
  }
};
</script>
