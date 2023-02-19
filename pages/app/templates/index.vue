<template>
  <div>
    <!-- WIDGET CONFIGURATOR -->
    <div class="row">
      <card>
        <div slot="header">
          <div class="row">
            <div class="col-6">
              <h4 class="card-title" v-if="!selectedWidgetName">Select Widget</h4>
              <h4 class="card-title" v-else>Configure Widget Parameters</h4>
            </div>
            <div class="col-6">
              <h4 class="card-title" v-if="selectedWidgetName">Widget Preview</h4>
            </div>
          </div>
        </div>

        <div class="row">
          <!-- WIDGET SELECTOR AND FORMS -->
          <div class="col-6">
            <!-- WIDGETS SELECTOR -->

            <el-select
              v-model="selectedWidgetName"
              @change="defaultValues"
              class="select-info"
              placeholder="Select Widget"
              style="width: 100%;"
            >
              <el-option
                class="text-dark"
                value="numberchart"
                label="Realtime number chart"
              >
              </el-option>
              <el-option
                class="text-dark"
                value="indicator"
                label="Indicator"
              >
              </el-option>
              <!--               <el-option
                class="text-dark"
                value="map"
                label="Map INPUT <-"
              ></el-option> -->
              <el-option
                class="text-dark"
                value="switch"
                label="Switch "
              ></el-option>
              <el-option
                class="text-dark"
                value="button"
                label="Button "
              ></el-option>
            </el-select>
            <div class="row"  v-if="selectedWidgetName">
              <div class="col-4"><hr></div>
              <div class="col-4">Behavior</div>
              <div class="col-4"><hr></div>
            </div>


            <div v-if="selectedWidgetName == 'numberchart'">

             <from-grafico-realtime
             @decimal-places="decimalPlaces"
             @chart-time-ago="chartTimeAgo"
             @send-freq="sendFreqChart"
             @var-full-name="variableFullName"
             @unit="unit"
             @default-series-type="getStyleSerie"
             ></from-grafico-realtime>
            </div>


            <div v-if="selectedWidgetName == 'switch'">
              <from-switch
              @var-full-name="variableFullName"
              ></from-switch>

            </div>


            <div v-if="selectedWidgetName == 'button'">
              <form-button
              @var-full-name="variableFullName"
              @message="message"
              @text="text"></form-button>

            </div>


            <div v-if="selectedWidgetName == 'indicator'">
              <from-indicator
              @var-full-name="variableFullName"
              @send-freq="sendFreqIndicator"
              @message-on="messageOn"
              @message-off="messageOff"
              @condition="condition"
              @is-bool="isBoolean"
              @value="valueIndicator"></from-indicator>
            </div>


            <div class="row"  v-if="selectedWidgetName">
              <div class="col-4"><hr></div>
              <div class="col-4">Styles</div>
              <div class="col-4"><hr></div>
            </div>

            <div v-if="selectedWidgetName">
              <div class="row">
                <div class="col-6">
                  <label for="color">Color</label>
                  <color-config @color="getColor"></color-config>
                </div>
                <div class="col-6">
                  <label for="color">Icon</label>
                  <config-icon @icon="getIcon"></config-icon>
                </div>
              </div>
              <label for="color">Ancho</label>
              <config-cols @cols="getCols"></config-cols>
            </div>
          </div>

          <!-- WIDGET PREVIEW -->
          <div class="col-6">
            <grafico-realtime
              v-if="selectedWidgetName == 'numberchart'"
              :config="ncConfig"
            ></grafico-realtime>
            <iot-switch
              v-if="selectedWidgetName == 'switch'"
              :config="iotSwitchConfig"
            ></iot-switch>
            <iot-button
              v-if="selectedWidgetName == 'button'"
              :config="iotButtonConfig"
            ></iot-button>
            <iot-indicator
              v-if="selectedWidgetName == 'indicator'"
              :config="iotIndicatorConfig"
            ></iot-indicator>
          </div>
        </div>

        <!-- ADD WIDGET BUTTON -->
        <div slot="raw-content" class="row pull-right">
          <div class="col-12">
            <base-button
              :disabled="!selectedWidgetName"
              native-type="submit"
              type="info"
              class="mb-3 mr-3 pull-right"
              size="lg"
              @click="addNewWidget()"
            >
              Add Widget
            </base-button>
          </div>
        </div>
      </card>
    </div>

    <!-- DASHBOARD PREVIEW -->
    <div class="row" v-if="widgets.length > 0">
      <div class="col-sm-12">
        <h4 class="card-title">Dashboard Preview</h4>
      </div>
      <div
        v-for="(widget, index) in widgets"
        :key="widget.variable"
        :class="[widget.column]"
      >
        <i
          aria-hidden="true"
          class="fa fa-trash text-warning pull-right"
          @click="deleteWidget(index)"
          style="margin-bottom: 10px;"
        ></i>

        <grafico-realtime
          v-if="widget.widgetName == 'numberchart'"
          :config="widget"
        ></grafico-realtime>

        <iot-switch
          v-if="widget.widgetName == 'switch'"
          :config="widget"
        ></iot-switch>

        <iot-button
          v-if="widget.widgetName == 'button'"
          :config="widget"
        ></iot-button>

        <iot-indicator
          v-if="widget.widgetName == 'indicator'"
          :config="widget"
        ></iot-indicator>
      </div>
    </div>

    <!-- SAVE TEMPLATE-->
    <div class="row" v-if="widgets.length > 0">
      <card>
        <div slot="header">
          <h4 class="card-title">Save Template</h4>
        </div>

        <div class="row">
          <base-input
            class="col-4"
            v-model="templateName"
            label="Template Name"
            type="text"
          >
          </base-input>

          <base-input
            class="col-8"
            v-model="templateDescription"
            label="Template Description (optional)"
            type="text"
          >
          </base-input>
        </div>

        <br /><br />

        <div class="row">
          <div class="col-12">
            <base-button
              :disabled="!widgets.length"
              native-type="submit"
              type="info"
              class="mb-3 pull-right"
              size="lg"
              @click="newTemplate()"
            >
              Save Template
            </base-button>
          </div>
        </div>
      </card>
    </div>

    <!-- TEMPLATES TABLE -->
    <div class="row">
      <card>
        <div slot="header">
          <p class="card-title">My Templates</p>
        </div>

        <div class="row">
          <el-table :data="templates">
            <el-table-column min-width="50" label="#" align="center">
              <div class="photo" slot-scope="{ row, $index }">
                {{ $index + 1 }}
              </div>
            </el-table-column>

            <el-table-column prop="name" label="Name"></el-table-column>

            <el-table-column
              prop="description"
              label="Description"
            ></el-table-column>

            <el-table-column
              prop="widgets.length"
              label="Widgets"
            ></el-table-column>

            <el-table-column header-align="right" align="right" label="Actions">
              <div
                slot-scope="{ row, $index }"
                class="text-right table-actions"
              >
                <el-tooltip
                  content="Delete"
                  effect="light"
                  :open-delay="300"
                  placement="top"
                >
                  <base-button
                    @click="showModalDeleteTemplate(row, $index)"
                    type="danger"
                    icon
                    size="sm"
                    class="btn-link"
                  >
                    <i class="tim-icons icon-simple-remove "></i>
                  </base-button>
                </el-tooltip>
              </div>
            </el-table-column>
          </el-table>
        </div>
      </card>

      <modal :show="templateToDelete != null" v-if="templateToDelete">
        <template slot="header">
          <h5 class="modal-title" id="exampleModalLabel">Atention!</h5>
        </template>
        <div v-if="!templateInUse">
          Are you sure you wanna
          <a class="text-danger"
            >DELETE "{{ templateToDelete.name.toUpperCase() }}"</a
          >
          template?
        </div>
        <div v-else>
          <a class="text-danger"
            >YOU CAN NOT DELETE "{{ templateToDelete.name.toUpperCase() }}" </a
          >TEMPLATE BECAUSE IT IS BEING USED BY OTHER DEVICES
        </div>

        <template slot="footer" v-if="!templateInUse">
          <base-button type="secondary" @click="closeModalTemplate()"
            >NO</base-button
          >
          <base-button
            type="info"
            @click="deleteTemplate(templateToDelete, indexToDelete)"
            >YES</base-button
          >
        </template>

        <template slot="footer" v-else>
          <base-button type="secondary" @click="closeModalTemplate()"
            >OK</base-button
          >

          <base-button type="info" @click="$router.push('/app/devices')"
            >GO TO DEVICES</base-button
          >
        </template>
      </modal>
    </div>

    <!-- JSONS -->
    <!-- <Json :value="widgets"></Json> -->
  </div>
</template>

<script>
import { Table, TableColumn } from "element-ui";
import { Select, Option } from "element-ui";
import IotSwitch from "../../../components/Widgets/IotSwitch.vue";
import IotButton from "../../../components/Widgets/IotButton.vue";
import IotIndicator from "../../../components/Widgets/IotIndicator.vue";
import GraficoRealtime from "../../../components/Widgets/GraficoRealtime.vue";
import Card from "../../../components/Cards/Card.vue";
import ColorConfig from "../../../components/Widgets/Configs/Style/ColorConfig.vue";
import ConfigCols from "../../../components/Widgets/Configs/Style/ConfigCols.vue";
import ConfigIcon from "../../../components/Widgets/Configs/Style/ConfigIcon.vue";
import FromGraficoRealtime from '../../../components/Widgets/Configs/Behaivor/FromGraficoRealtime.vue';
import FromIndicator from '../../../components/Widgets/Configs/Behaivor/FromIndicator.vue';

export default {
  middleware: "authtenticated",
  components: {
    ColorConfig,
    ConfigIcon,
    ConfigCols,
    IotSwitch,
    IotIndicator,
    IotButton,
    GraficoRealtime,
    Card,
    FromGraficoRealtime,
    FromIndicator,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Option.name]: Option,
    [Select.name]: Select
  },
  data() {
    return {
      widgets: [],
      templates: [],
      templateInUse: false,
      selectedWidgetName: "",
      templateName: "",
      templateDescription: "",
      sendFrequency: 5,
      ncConfig: {
        selectedDevice: {
          name: "Home",
          dId: "dummy-device-id"
        },
        variableFullName: "temperature",
        variableType: "input",
        variableSendFreq: "5",
        unit: "ºC",
        class: "success",
        column: "col-6",
        decimalPlaces: 2,
        widgetName: "numberchart",
        icon: "fa-thermometer",
        defaultSeriesType:'line',
        chartTimeAgo: 120,
        demo: true
      },
      iotSwitchConfig: {
        selectedDevice: {
          name: "Home",
          dId: "dummy-device-id"
        },
        variableFullName: "Engine",
        class: "success",
        variableType: "output",
        widgetName: "switch",
        icon: "fa-lightbulb",
        column: "col-6"
      },
      iotButtonConfig: {
        selectedDevice: {
          name: "Home",
          dId: "dummy-device-id"
        },
        variableFullName: "Pump",
        variableType: "output",
        text: "ON",
        message: "on",
        widgetName: "button",
        colorButton: "success",
        icon: "fa-home",
        column: "col-6"
      },
      iotIndicatorConfig: {
        selectedDevice: {
          name: "Home",
          dId: "dummy-device-id"
        },
        isBoolean:true,
        messageOn:'The alarm is ON',
        messageOff:'The alarm is OFF',
        condition:'>',
        value:0,

        variableFullName: "Alarm Status",
        color: "success",
        variableType: "input",
        variableSendFreq: "5",
        widgetName: "indicator",
        icon: "fa-home",
        column: "col-6"
      },
      value: false,
      templateToDelete: null,
      indexToDelete: null
    };
  },
  methods: {
    // metodos para actualizar el widget cuando cambia el formulario
    getColor(color) {
      this.iotButtonConfig.colorButton = color;
      this.ncConfig.class = color;
      this.iotIndicatorConfig.color = color;
      this.iotSwitchConfig.class = color;
    },

    getCols(cols) {
      this.iotButtonConfig.column = cols;

      this.ncConfig.column = cols;

      this.iotIndicatorConfig.column = cols;

      this.iotSwitchConfig.column = cols;
    },
    getIcon(icon) {
      this.iotButtonConfig.icon = icon;
      this.ncConfig.icon = icon;
      this.iotIndicatorConfig.icon = icon;
      this.iotSwitchConfig.icon = icon;
    },

    // metodos para el grafico
    unit(value){
      this.ncConfig.unit=value;
    },
    getStyleSerie(value){
      this.ncConfig.defaultSeriesType=value;
    },
    decimalPlaces(value){
      this.ncConfig.decimalPlaces=value;
    },
    chartTimeAgo(value){
      this.ncConfig.chartTimeAgo=value;
    },
    sendFreqChart(value){
      this.ncConfig.variableSendFreq=value;
    },
    // metodos para el indicator
    messageOn(value){
      this.iotIndicatorConfig.messageOn=value;
    },
    messageOff(value){
      this.iotIndicatorConfig.messageOff=value;
    },
    valueIndicator(value){
      this.iotIndicatorConfig.value=value;
    },
    condition(value){
      this.iotIndicatorConfig.condition=value;
    },
    isBoolean(value){
      this.iotIndicatorConfig.isBoolean=value;
    },

    sendFreqIndicator(value){
      this.iotIndicatorConfig.variableSendFreq=value;
    },

    //metodos para el button
    text(value){
      this.iotButtonConfig.text=value;
    },
    message(value){
      this.iotButtonConfig.message=value;
    },

    variableFullName(value){
      this.ncConfig.variableFullName=value;
      this.iotIndicatorConfig.variableFullName=value;
      this.iotButtonConfig.variableFullName=value;
      this.iotSwitchConfig.variableFullName=value;
    },
    defaultValues(selectedWidgetName){
      // para que los valores por defectos con los que se monta el
      // formulario coincidan con los valores de configuracion del widget preview
      switch (selectedWidgetName) {
        case "button":
          this.iotButtonConfig.variableFullName = 'Pump';
          this.iotButtonConfig.icon = 'fa-bath';
          this.$nuxt.$emit('set-icon',this.iotButtonConfig.icon);
          break;
        case "numberchart":
          this.ncConfig.icon="fa-thermometer"
          this.ncConfig.variableFullName = 'Temperature';
          this.ncConfig.decimalPlaces = 2;
          this.ncConfig.unit = "ºC";
          this.ncConfig.chartTimeAgo = 120;
          this.ncConfig.variableSendFreq = "120";
          this.$nuxt.$emit('set-icon',this.ncConfig.icon);
          break;
        case "indicator":
          this.iotIndicatorConfig.icon="fa-home"
          this.iotIndicatorConfig.variableSendFreq = "5";
          this.iotIndicatorConfig.value = 0;
          this.iotIndicatorConfig.isBoolean = true;
          this.iotIndicatorConfig.condition = ">";
          this.iotIndicatorConfig.messageOn = "The alarm is ON";
          this.iotIndicatorConfig.messageOff = "The alarm is OFF";
          this.iotIndicatorConfig.variableFullName = 'Alarm Status';
          this.$nuxt.$emit('set-icon',this.iotIndicatorConfig.icon);

          break;
        case "switch":
          this.iotSwitchConfig.variableFullName = 'Ligth';
          this.iotSwitchConfig.icon="fa-lightbulb"
          this.$nuxt.$emit('set-icon',this.iotSwitchConfig.icon);

          break;

        default:
          break;
      }
    },
    async newTemplate() {
      try {
        const token = this.$store.state.auth.auth.token;
        const axiosHeaders = {
          headers: {
            "x-auth-token": token
          }
        };

        const toSend = {
          template: {
            name: this.templateName,
            description: this.templateDescription,
            widgets: this.widgets
          }
        };

        const res = await this.$axios.post("/template", toSend, axiosHeaders);

        if (res.data.status == "success") {
          this.templates.push(res.data.data);
          this.templateName = "";
          this.templateDescription = "";
          this.selectedWidgetName = "";
          this.widgets = [];
          this.$notify({
            type: "success",
            icon: "tim-icons icon-check-2",
            message: `Template "${this.templateName.toUpperCase()}" created!`
          });
        }
      } catch (e) {
        console.log(e);
        this.$notify({
          type: "danger",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Error creating template"
        });
      }
    },

    async getTemplates() {
      try {
        const token = this.$store.getters["auth/getToken"];
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

    async deleteTemplate(template, index) {
      try {
        const token = this.$store.getters["auth/getToken"];
        const axiosHeaders = {
          headers: {
            "x-auth-token": token
          },
          params: {
            _id: template._id
          }
        };

        const res = await this.$axios.delete("/template", axiosHeaders);
        if (res.data.status == "success") {
          this.templates.splice(index, 1);
          this.$notify({
            type: "success",
            icon: "tim-icons icon-check-2",
            message: `Template "${template.name.toUpperCase()}" deleted!`
          });
          this.templateToDelete = null;
        }
      } catch (e) {
        this.$notify({
          type: "danger",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Error deleting template"
        });
      }
    },
    addNewWidget() {
      switch (this.selectedWidgetName) {
        case "button":
          this.iotButtonConfig.variable = this.makeid(10);
          this.iotButtonConfig.userId = this.$store.getters["auth/getUserId"];
          this.widgets.push(JSON.parse(JSON.stringify(this.iotButtonConfig)));
          break;
        case "numberchart":
          this.ncConfig.userId = this.$store.getters["auth/getUserId"];
          this.ncConfig.variable = this.makeid(10);
          this.widgets.push(JSON.parse(JSON.stringify(this.ncConfig)));
          break;
        case "indicator":
          this.iotIndicatorConfig.userId = this.$store.getters[
            "auth/getUserId"
          ];
          this.iotIndicatorConfig.variable = this.makeid(10);

          this.widgets.push(
            JSON.parse(JSON.stringify(this.iotIndicatorConfig))
          );
          break;
        case "switch":
          this.iotSwitchConfig.userId = this.$store.getters["auth/getUserId"];
          this.iotSwitchConfig.variable = this.makeid(10);
          this.widgets.push(JSON.parse(JSON.stringify(this.iotSwitchConfig)));

          break;

        default:
          break;
      }
    },
    deleteWidget(index) {
      this.widgets.splice(index, 1);
    },
    closeModalTemplate() {
      this.templateToDelete = null;
    },
    showModalDeleteTemplate(template, index) {
      const devices = this.$store.getters["devices/getDevices"];
      const isTemplateInUse = devices.some(
        d => d.templateId._id == template._id
      );
      if (isTemplateInUse) {
        this.templateInUse = true;
        this.templateToDelete = template;
        this.indexToDelete = index;
      } else {
        this.templateInUse = false;
        this.templateToDelete = template;
        this.indexToDelete = index;
      }
    },
    makeid(length) {
      var result = "";
      var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    }
  },

  computed: {
    userId() {
      return this.$store.getters["auth/getUserId"];
    },
    inputTypeWidget() {
      return (
        this.selectedWidgetName == "indicator" ||
        this.selectedWidgetName == "numberchart"
      );
    }
  },
  async mounted() {
    await this.getTemplates();
  },
  watch:{

  }
};
</script>
