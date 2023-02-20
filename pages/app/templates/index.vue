<template>
  <div>
    <!-- CREATING TEMPLATE -->
    <div class="row">
      <card>
        <template slot="header">
          <div class="row">
            <div class="col-6">
              <h4 class="card-title" v-if="!selectedWidgetName">
                Create Template
              </h4>
              <p class="card-category" v-if="!selectedWidgetName">
                Add a collection of widgets to create a template
              </p>

              <h4 class="card-title" v-else>Configure Widget Parameters</h4>
            </div>
            <div class="col-6">
              <h4 class="card-title" v-if="selectedWidgetName">
                Widget Preview
              </h4>
            </div>
          </div>
        </template>

        <template name="card-body">
          <div class="row">
            <div class="col-6">
              <!-- WIDGET SELECTOR -->
              <WidgetSelector @selected-widget="getSelectedWidgetName" :widgetSelected="selectedWidgetName" />

              <!-- WIDGET FORMS -->
              <FromNumberchart
                :isEdition="enableEdition.numberchart"
                :config="numberchartConfig"
                v-if="selectedWidgetName === 'numberchart'"
                @numberchart-config="getNumberchartConfig"
                @add-widget="addNewWidget"
              />
              <FromIndicator
                :isEdition="enableEdition.indicator"
                :config="indicatorConfig"
                @indicator-config="getIndicatorConfig"
                v-if="selectedWidgetName === 'indicator'"
                @add-widget="addNewWidget"
              />
              <FormButton
                :isEdition="enableEdition.button"
                :config="buttonConfig"
                v-if="selectedWidgetName === 'button'"
                @button-config="getButtonConfig"
                @add-widget="addNewWidget"
              />
              <FromSwitch
                :isEdition="enableEdition.switch"
                v-if="selectedWidgetName === 'switch'"
                @switch-config="getSwitchConfig"
                @add-widget="addNewWidget"
              />
            </div>

            <!-- WIDGET PREVIEW -->
            <div class="col-6">
              <IotNumberchart
                :config="numberchartConfig"
                v-if="selectedWidgetName === 'numberchart'"
              />
              <IotIndicator
                :config="indicatorConfig"
                v-if="selectedWidgetName === 'indicator'"
              />
              <IotButton
                :config="buttonConfig"
                v-if="selectedWidgetName === 'button'"
              />
              <IotSwitch
                :config="switchConfig"
                v-if="selectedWidgetName === 'switch'"
              />
            </div>
          </div>
        </template>
      </card>
    </div>

    <!-- DASHBOARD PREVIEW -->
    <div class="row" ref="dashpreview">
      <div
        v-for="(widget, index) in widgets"
        :key="widget.variable"
        :class="[widget.column]"
      >
        <i
          aria-hidden="true"
          class="tim-icons icon-trash-simple text-warning option"
          @click="deleteWidget(index)"
          style="margin-bottom: 8px;"
        ></i>
        <i
          aria-hidden="true"
          class="tim-icons icon-pencil text-warning option pull-right"
          @click="editWidget(widget, index)"
          style="margin-bottom: 8px;"
        ></i>

        <IotNumberchart
          :ref="'widget_' + index"
          v-if="widget.widgetName === 'numberchart'"
          :config="widget"
        />
        <IotIndicator
          :ref="'widget_' + index"
          v-if="widget.widgetName === 'indicator'"
          :config="widget"
        />
        <IotButton
          :ref="'widget_' + index"
          v-if="widget.widgetName === 'button'"
          :config="widget"
        />
      </div>

      <base-button
        v-if="widgets.length > 0"
        type="warning"
        icon
        style="background:#344675;"
        size="sm"
        class="btn-link mt-4 ml-3 mb-3"
        @click="scrollToTop"
      >
        <i class="tim-icons icon-simple-add"></i>
      </base-button>
    </div>

    <!-- SAVE TEMPLATE -->
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
          <h4 class="card-title">My Templates</h4>
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

  </div>
</template>

<script>
import { Table, TableColumn } from "element-ui";
import Card from "../../../components/Cards/Card.vue";
import FromIndicator from "../../../components/Widgets/Forms/IotIndicator.vue";
import FormButton from "../../../components/Widgets/Forms/IotButton.vue";
import FromNumberchart from "../../../components/Widgets/Forms/GraficoRealtime.vue";
import FromSwitch from "../../../components/Widgets/Forms/IotSwitch.vue";
import WidgetSelector from "../../../components/Widgets/WidgetSelector.vue";
import BaseInput from "../../../components/Inputs/BaseInput.vue";
import IotIndicator from "../../../components/Widgets/IotIndicator.vue";
import IotNumberchart from "../../../components/Widgets/GraficoRealtime.vue";
import IotButton from "../../../components/Widgets/IotButton.vue";
import IotSwitch from "../../../components/Widgets/IotSwitch.vue";
import BaseButton from "../../../components/BaseButton.vue";
import BaseAlert from "../../../components/BaseAlert.vue";

export default {
  components: {
    Card,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    BaseInput,
    BaseButton,
    WidgetSelector,
    FromIndicator,
    FormButton,
    FromSwitch,
    FromNumberchart,
    IotIndicator,
    IotNumberchart,
    IotButton,
    IotSwitch,
    BaseAlert
  },
  middleware: "authtenticated",
  data() {
    return {
      items: [
      'a',
      'b',
      'c'
    ],
      selectedWidgetName: null,
      templateInUse: false,
      value: false,
      enableEdition: {
        indicator: false,
        numberchart: false,
        button: false,
        switch: false
      },
      templateToDelete: null,
      indexToDelete: null,
      templates: [],
      widgets: [],
      templateName: null,
      templateDescription: null,
      numberchartConfig: {
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
        defaultSeriesType: "line",
        chartTimeAgo: 120,
        demo: true
      },
      indicatorConfig: {
        selectedDevice: {
          name: "Home",
          dId: "dummy-device-id"
        },
        isBoolean: true,
        messageOn: "The alarm is ON",
        messageOff: "The alarm is OFF",
        condition: ">",
        value: 0,
        variableFullName: "Alarm Status",
        color: "success",
        variableType: "input",
        variableSendFreq: "5",
        widgetName: "indicator",
        icon: "fa-home",
        column: "col-6"
      },
      switchConfig: {
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
      buttonConfig: {
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
      }
    };
  },
  methods: {

    getWidgets(w) {
      console.log(w);
    },
    getSelectedWidgetName(name) {
      this.selectedWidgetName = name;
    },
    getIndicatorConfig(config) {
      this.indicatorConfig = config;
    },
    getNumberchartConfig(config) {
      this.numberchartConfig = config;
    },
    getButtonConfig(config) {
      this.buttonConfig = config;
    },
    getSwitchConfig(config) {
      this.switchConfig = config;
    },
    scrollToTop() {
      window.scrollTo({ left: 0, top: 0, behavior: "smooth" });
    },


    addNewWidget({ widgetConfig, isEdition, cancel }) {
      // invalid inputs
      if (!widgetConfig) return;

      if (!isEdition) {
        // add widget
        widgetConfig.variable = this.makeid(15);
        widgetConfig.userId = this.$store.getters["auth/getUserId"];
        this.widgets.push(JSON.parse(JSON.stringify(widgetConfig)));

        this.$refs["dashpreview"].scrollIntoView({
          behavior: "smooth"
        });
        this.$notify({
          message: `Widget added!`,
          type: "success",
          icon: "tim-icons icon-check-2"
        });
        return;
      }

      // edition canceled
      if (isEdition && cancel.isCanceled) {
        this.enableEdition[widgetConfig.widgetName] = false;
        const index = this.widgets.indexOf(widgetConfig);
        this.widgets.splice(
          index,
          1,
          JSON.parse(JSON.stringify(cancel.oldConfig))
        );
        this.$notify({
          message: `Canceled!`,
          type: "danger",
          icon: "tim-icons icon-check-2"
        });
        return;
      }

      if (isEdition && !cancel.isCanceled) {
        // edit widget
        this.enableEdition[widgetConfig.widgetName] = false;
        const index = this.widgets.indexOf(widgetConfig);
        this.widgets.splice(index, 1, JSON.parse(JSON.stringify(widgetConfig)));
        this.$refs["widget_" + index][0]["$el"].scrollIntoView({
          behavior: "smooth"
        }); // voy al elemento editado
        this.$notify({
          message: `Widget edited!`,
          type: "success",
          icon: "tim-icons icon-check-2"
        });

        return;
      }
    },
    deleteWidget(index) {
      this.widgets.splice(index, 1);
    },
    editWidget(widgetConfig, index) {
      const widgetName = widgetConfig.widgetName;
      const widgetToEdit = widgetName + "Config";

      this.enableEdition[widgetName] = true;
      this.selectedWidgetName = widgetName;
      this[widgetToEdit] = widgetConfig;

      window.scrollTo({ left: 0, top: 0, behavior: "smooth" });
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
          this.widgets = [];
          this.templateName = null;
          this.templateDescription = null;
          this.selectedWidgetName = null;
          this.$notify({
            type: "success",
            icon: "tim-icons icon-check-2",
            message: `Template "${toSend.template.name.toUpperCase()}" created!`
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
    }
  },

  mounted() {
    this.getTemplates();
  },
  created() {}
};
</script>

<style scoped>
.option {
  cursor: pointer;
}
</style>
