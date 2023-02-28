<template>
  <div>
    <!-- EDITING TEMPLATE -->
    <div class="row">
      <card>
        <template slot="header">
          <div class="row">
            <div class="col-12 col-md-6">
              <h4 class="card-title" v-if="!selectedWidgetName">
                {{$t('templates_id.title {templateName}',{templateName:templateName.toUpperCase()})}}
              </h4>
              <p class="card-category" v-if="!selectedWidgetName">
                {{$t('templates_id.subtitle')}}
              </p>

              <h4 class="card-title" v-else>
                {{
                  this.isEdition
                    ? `${$t('edittitle')}`
                    : `${$t('confwidgtitle')}`
                }}
              </h4>
              <p class="card-category" v-if="indexToAdd == null && selectedWidgetName && !isEdition">
                {{$t('addwidget')}}
              </p>
              <p class="card-category text-danger" v-if="indexToAdd !== null">
               {{$t('addwidgetat {indexToAdd}', {indexToAdd})}}
              </p>
            </div>
          </div>
        </template>

        <template name="card-body">
          <div class="row">
            <div class="col-12 col-md-6">
              <!-- WIDGET SELECTOR -->
              <WidgetSelector
                @selected-widget="getSelectedWidgetName"
                :widgetSelected="selectedWidgetName"
              />

              <!-- WIDGET FORMS -->
              <FromNumberchart
                :isEdition="enableEdition.numberchart"
                :config="numberchartConfig"
                v-if="selectedWidgetName === 'numberchart'"
                @numberchart-config="getWidgetConfiguration"
                @add-widget="handleNewWidget"
              />
              <FromIndicator
                :isEdition="enableEdition.indicator"
                :config="indicatorConfig"
                @indicator-config="getWidgetConfiguration"
                v-if="selectedWidgetName === 'indicator'"
                @add-widget="handleNewWidget"
              />
              <FormButton
                :isEdition="enableEdition.button"
                :config="buttonConfig"
                v-if="selectedWidgetName === 'button'"
                @button-config="getWidgetConfiguration"
                @add-widget="handleNewWidget"
              />
              <FromSwitch
                :isEdition="enableEdition.switch"
                v-if="selectedWidgetName === 'switch'"
                @switch-config="getWidgetConfiguration"
                @add-widget="handleNewWidget"
              />
            </div>

            <!-- WIDGET PREVIEW -->
            <div class="col-12 col-md-6">
              <h4 class="card-title" v-if="selectedWidgetName">
                {{$t('widgprev')}}
              </h4>
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

    <div class="row">
      <div class="col-12 col-md-8">
        <base-button
          type="success"
          size="md"
          :loading="isLoading"
          class="mb-3 pull-left"
          @click="confirmTemplate"
        >
          {{$t('templates_id.confbtn')}}
          <i class="tim-icons icon-check-2"></i>
        </base-button>
      </div>

      <div class="col-12 col-md-4">
        <base-button
          type="danger"
          size="md"
          class="mb-3 pull-right"
          @click="cancelEdition"
        >
          {{$t('templates_id.cancelbtn')}}
          <i class="tim-icons icon-simple-remove"></i>
        </base-button>
      </div>
    </div>

    <!-- DASHBOARD PREVIEW -->
    <div class="row" ref="dashpreview">

      <div
        v-for="(widget, index) in widgets"
        :key="widget.variable"
        class="col-12"
        :class="[widget.column]"
        ref="widgets"
      >
        <el-tooltip :open-delay="300" :content="$t('tooldelete')" placement="top">
          <i
            aria-hidden="true"
            class="tim-icons icon-trash-simple text-warning option"
            @click="deleteWidget(index)"
            style="margin-bottom: 8px;"
          ></i>
        </el-tooltip>

        <el-tooltip :open-delay="300" :content="$t('tooledit')" placement="top">
          <i
            aria-hidden="true"
            class="tim-icons icon-pencil text-warning option ml-2"
            @click="editWidget(widget, index)"
            style="margin-bottom: 8px;"
          ></i>
        </el-tooltip>

        <el-tooltip :open-delay="300" :content="$t('tooladdnext')" placement="top">
          <i
            aria-hidden="true"
            class="tim-icons icon-simple-add text-success option pull-right"
            @click="addAt(index)"
            style="margin-bottom: 8px;"
          ></i>
        </el-tooltip>

        <IotNumberchart
          
          v-if="widget.widgetName === 'numberchart'"
          :config="widget"
        />
        <IotIndicator
          
          v-if="widget.widgetName === 'indicator'"
          :config="widget"
        />
        <IotButton
          
          v-if="widget.widgetName === 'button'"
          :config="widget"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Card from "../../../components/Cards/Card.vue";
import FromIndicator from "../../../components/Widgets/Forms/FIotIndicator.vue";
import FormButton from "../../../components/Widgets/Forms/FIotButton.vue";
import FromNumberchart from "../../../components/Widgets/Forms/FGraficoRealtime.vue";
import FromSwitch from "../../../components/Widgets/Forms/FIotSwitch.vue";
import WidgetSelector from "../../../components/Widgets/WidgetSelector.vue";
import BaseInput from "../../../components/Inputs/BaseInput.vue";
import IotIndicator from "../../../components/Widgets/IotIndicator.vue";
import IotNumberchart from "../../../components/Widgets/GraficoRealtime.vue";
import IotButton from "../../../components/Widgets/IotButton.vue";
import IotSwitch from "../../../components/Widgets/IotSwitch.vue";
import BaseButton from "../../../components/BaseButton.vue";

export default {
  middleware: "authtenticated",
  scrollToTop: true,
  components: {
    Card,
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
    IotSwitch
  },
  data() {
    return {
      templateName: "",
      widgets: [],
      selectedWidgetName: "",
      indexToAdd: null,
      enableEdition: {
        indicator: false,
        numberchart: false,
        button: false,
        switch: false
      },
      isEdition: false,
      isLoading:false,
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
        column: "col-md-6",
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
        column: "col-md-6"
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
        column: "col-md-6"
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
        column: "col-md-6"
      },
      oldConfig: {}
    };
  },
  methods: {
    getSelectedWidgetName(name) {
      this.selectedWidgetName = name;
    },
    getWidgetConfiguration(config) {
      this[`${config.widgetName}Config`] = config;
    },

    addAt(index) {
      this.indexToAdd = index + 1;
      this.selectedWidgetName = "numberchart";
      this.scrollToTop();
    },

    handleNewWidget({ widgetConfig, isCanceled, isValidForm }) {
      // INVALID INPUTS
      if (isValidForm === false) {
        this.$notify({
          message: `${this.$t('inpinv')}`,
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc"
        });
        return;
      }

      // ADD WIDGET
      if (!this.isEdition) {
        if (this.indexToAdd !== null) {
          // add widget at specific index
          widgetConfig.variable = this.makeid(15);
          widgetConfig.userId = this.$store.getters["auth/getUserId"];
          const firstHalf = this.widgets.slice(0, this.indexToAdd);
          const secondHalf = this.widgets.slice(this.indexToAdd); // hasta el final
          const newWidget = JSON.parse(JSON.stringify(widgetConfig));
          this.widgets = [...firstHalf, newWidget, ...secondHalf];

          this.$notify({
            message: `${this.$t('notifaddwid')}`,
            type: "success",
            icon: "tim-icons icon-check-2"
          });


          this.$refs.widgets[this.indexToAdd-1].scrollIntoView({
            behavior: "smooth"
          });
        
          this.indexToAdd = null;
          return;
        }

        // just push the widget to the array
        widgetConfig.variable = this.makeid(15);
        widgetConfig.userId = this.$store.getters["auth/getUserId"];
        this.widgets.push(JSON.parse(JSON.stringify(widgetConfig)));

        setTimeout(() => {
          this.$refs.widgets[this.widgets.length-1].scrollIntoView({
            behavior: "smooth"
          });
        }, 200);


        this.$notify({
          message: `${this.$t('notifaddwid')}`,
          type: "success",
          icon: "tim-icons icon-check-2"
        });

        return;
      }

      // EDITION CANCELED
      if (this.isEdition && isCanceled) {
        this.isEdition = false;
        this.enableEdition[widgetConfig.widgetName] = false;
        const index = this.widgets.indexOf(widgetConfig);

        // update form and widget preview
        this[widgetConfig.widgetName + "Config"] = this.oldConfig;
        // delete the widget and replace it for another with the original data
        this.widgets.splice(
          index,
          1,
          JSON.parse(JSON.stringify(this.oldConfig))
        );
        this.$notify({
          message: `${this.$t('notifcancel')}`,
          type: "danger",
          icon: "tim-icons icon-check-2"
        });
        return;
      }

      // EDIT WIDGET
      if (this.isEdition && !isCanceled) {
        this.isEdition = false;
        this.enableEdition[widgetConfig.widgetName] = false;
        const index = this.widgets.indexOf(widgetConfig);
        // delete the widget and replace it for another with the new data
        this.widgets.splice(index, 1, JSON.parse(JSON.stringify(widgetConfig)));
        // voy al elemento editado
        this.$refs.widgets[index].scrollIntoView({behavior: "smooth"});
        this.$notify({
         message: `${this.$t('notifeditwid')}`,
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
      this.oldConfig = Object.assign({}, widgetConfig);
      this.isEdition = true;

      const widgetName = widgetConfig.widgetName;
      const widgetToEdit = widgetName + "Config";

      this.enableEdition[widgetName] = true;
      this.selectedWidgetName = widgetName;
      this[widgetToEdit] = widgetConfig;

      this.scrollToTop();
    },


    cancelEdition() {
      this.$router.back()
    },

    async confirmTemplate() {
      try {
        this.isLoading=true;
        const token = this.$store.getters["auth/getToken"];
        const axiosHeaders = {
          headers: {
            "x-auth-token": token
          }
        };
        const toSend = {
          template: {
            id: this.$route.params.id,
            widgets: this.widgets
          }
        };

        const res = await this.$axios.put(`/template`, toSend, axiosHeaders);
        if (res.data.status == "success") {
          this.getDevices();
          this.$router.back();
          await this.getWidgets();
          this.$notify({
            type: "success",
            icon: "tim-icons icon-simple-check",
            message:`${this.$t('notifupdatedtemp {templateName}',{templateName:this.templateName.toUpperCase()})}`
          });
        }
      } catch (e) {
        console.log(e);
        this.$notify({
          type: "danger",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Fail to load template"
        });
      }finally{
        this.isLoading=false;
      }
    },
    scrollToTop() {
      window.scrollTo({ left: 0, top: 0, behavior: "smooth" });
    },
    async getWidgets() {
      try {
        const token = this.$store.getters["auth/getToken"];
        const axiosHeaders = {
          headers: {
            "x-auth-token": token
          }
        };

        const res = await this.$axios.get(
          `/template/${this.$route.params.id}/`,
          axiosHeaders
        );
        if (res.data.status == "success") {
          const template = res.data.data;

          this.templateName = template.name;
          this.widgets = template.widgets;
        }
      } catch (e) {
        console.log(e);
        this.$notify({
          type: "danger",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Fail to load template"
        });
      }
    },
    // para que se actualicen los widgets en las demas vistas --> cambio el devices store
    getDevices() {
      try {
        this.$store.dispatch("devices/fetchDevices");
      } catch (e) {
        this.$notify({
          type: "danger",
          icon: "tim-icons icon-alert-circle-exc",
          message: e
        });
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
  async mounted() {
    await this.getWidgets();
  }
};
</script>

<style scoped>
.option {
  cursor: pointer;
}
</style>
