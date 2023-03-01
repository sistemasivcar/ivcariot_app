
<template>
  <div>
    <!-- CREATING TEMPLATE -->
    <div class="row">
      <card>
        <template slot="header">
          <div class="row">
            <div class="col-12 col-md-6">
              <h4 class="card-title" v-if="!selectedWidgetName">
                {{$t('newTitle')}}
              </h4>
              <p class="card-category" v-if="!selectedWidgetName">
                {{$t('newsubtitle')}}
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
            <div class="col-12 col-md-6">
              <!-- <h4 class="card-title" v-if="selectedWidgetName">
                {{$t('widgprev')}}
              </h4> -->
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

        <el-tooltip :open-delay="300" :content="$t('tooladdnext')"  placement="top">
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

    <!-- SAVE TEMPLATE -->
    <div class="row" v-if="widgets.length > 0">
      <card>
        <div slot="header">
          <h4 class="card-title">{{$t('newtemp')}}</h4>
        </div>

        <div class="row">
          <base-input
            class="col-12 col-md-4"
            v-model="templateName"
            :label="$t('temname')"
            type="text"
          >
          </base-input>

          <base-input
            class="col-12 col-md-8"
            v-model="templateDescription"
            :placeholder="$t('tempdescpl')"
            :label="$t('tempdesc')"
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
              :loading="addLoadgin"
            >
              {{$t('savetemp')}}
              <i class="tim-icons icon-check-2 ml-2"></i>
            </base-button>
          </div>
        </div>
      </card>
    </div>
  </div>
</template>

<script>
import Card from "../Cards/Card.vue";
import FromIndicator from "../Widgets/Forms/FIotIndicator.vue";
import FormButton from "../Widgets/Forms/FIotButton.vue";
import FromNumberchart from "../Widgets/Forms/FGraficoRealtime.vue";
import FromSwitch from "../Widgets/Forms/FIotSwitch.vue";
import WidgetSelector from "../Widgets/WidgetSelector.vue";
import BaseInput from "../Inputs/BaseInput.vue";
import IotIndicator from "../Widgets/IotIndicator.vue";
import IotNumberchart from "../Widgets/GraficoRealtime.vue";
import IotButton from "../Widgets/IotButton.vue";
import IotSwitch from "../Widgets/IotSwitch.vue";
import BaseButton from "../BaseButton.vue";
import BaseAlert from "../BaseAlert.vue";

export default {
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
    IotSwitch,
    BaseAlert
  },
  data() {
    return {
      widgets: [],
      templateName: null,
      templateDescription: null,
      selectedWidgetName: null,
      indexToAdd: null,
      isEdition: false,
      enableEdition: {
        indicator: false,
        numberchart: false,
        button: false,
        switch: false
      },
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
        sendMethod:'change_status',
        notifOnChange:true,
        messageOn: "IVCAR Activada",
        messageOff: "IVCAR Desactivada",
        condition: ">",
        value: 0,
        variableFullName: "Estado Alarma IVCAR",
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
      oldConfig: {},
      addLoadgin:false,
    };
  },
  computed: {},
  methods: {
    getSelectedWidgetName(name) {
      this.selectedWidgetName = name;
    },
    getWidgetConfiguration(config) {
      this[`${config.widgetName}Config`] = config;
    },
    scrollToTop() {
      window.scrollTo({ left: 0, top: 0, behavior: "smooth" });
    },
    goEditTemplate(template) {
      this.$router.push({
        name: "app-templates-id",
        params: { id: template._id }
      });
    },
    addAt(index) {
      this.indexToAdd = index + 1;
      this.selectedWidgetName = "numberchart";
      this.scrollToTop();
    },

    async handleNewWidget({ widgetConfig, isCanceled, isValidForm }) {
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
        // this.$refs["widget_" + index][0]["$el"].scrollIntoView({
        //   behavior: "smooth"
        // });

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
      this.indexToAdd = null;

      const widgetName = widgetConfig.widgetName;
      const widgetToEdit = widgetName + "Config";

      this.enableEdition[widgetName] = true;
      this.selectedWidgetName = widgetName;
      this[widgetToEdit] = widgetConfig;
      
      this.scrollToTop();
      },
    
    async newTemplate() {
      try {
        this.addLoadgin=true;
        if (!this.templateName) {
          this.$notify({
            message: "Template Name is required",
            type: "warning",
            icon: "tim-icons icon-alert-circle-exc"
          });
          return;
        }
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
        this.$emit('new-template')
          this.widgets = [];
          this.templateName = null;
          this.templateDescription = null;
          this.selectedWidgetName = null;
          this.$notify({
            type: "success",
            icon: "tim-icons icon-check-2",
            // message: `Template "${toSend.template.name.toUpperCase()}" created!`
            message: `${this.$t('notifnewtemp {templateName}',{templateName: toSend.template.name.toUpperCase()})}`
            
          });
        }
      } catch (e) {
        console.log(e);
        this.$notify({
          type: "danger",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Error creating template"
        });
      }finally{
        this.addLoadgin=false;
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
  mounted() {}
};
</script>

<style scoped>
.option {
  cursor: pointer;
}
</style>
