<template>
  <div>
    <!-- WIDGET CONFIGURATOR -->
    
    <div class="row">
      <card>
        <div slot="header">
          <h4 class="card-title">Widgets</h4>
        </div>

        <div class="row">
          <!-- WIDGET SELECTOR AND FORMS -->
          <div class="col-6">
            <!-- WIDGETS SELECTOR -->
            <el-select
              v-model="selectedWidgetName"
              class="select-success"
              placeholder="Select Widget"
              style="width: 100%;"
            >
              <el-option
                class="text-dark"
                value="numberchart"
                label="Number Chart INPUT <-"
              >
              </el-option>
              <el-option
                class="text-dark"
                value="indicator"
                label="Boolean Indicator INPUT <-"
              >
              </el-option>
              <el-option
                class="text-dark"
                value="map"
                label="Map INPUT <-"
              ></el-option>
              <el-option
                class="text-dark"
                value="switch"
                label="Switch OUTPUT ->"
              ></el-option>
              <el-option
                class="text-dark"
                value="button"
                label="Button OUTPUT ->"
              ></el-option>
            </el-select>

            <br />
            <br />

            <!-- FORMS NUMBER CHART TYPE -->
            <div v-if="selectedWidgetName == 'numberchart'">
              <base-input
                v-model="ncConfig.variableFullName"
                label="Var Name"
                type="text"
              >
              </base-input>

              <base-input v-model="ncConfig.unit" label="Unit" type="text">
              </base-input>

              <base-input
                v-model.number="ncConfig.decimalPlaces"
                label="Decimal Places"
                type="number"
              >
              </base-input>

              <base-input
                v-model="ncConfig.icon"
                label="Icon"
                type="text"
              ></base-input>

              <br />

              <base-input
                v-model.number="ncConfig.chartTimeAgo"
                label="Chart Back Time (mins)"
                type="number"
              ></base-input>

              <br />

              <el-select
                v-model="ncConfig.class"
                class="select-success"
                placeholder="Select Class"
                style="width: 100%;"
              >
                <el-option
                  class="text-success"
                  value="success"
                  label="Success"
                ></el-option>
                <el-option
                  class="text-primary"
                  value="primary"
                  label="Primary"
                ></el-option>
                <el-option
                  class="text-warning"
                  value="warning"
                  label="Warning"
                ></el-option>
                <el-option
                  class="text-danger"
                  value="danger"
                  label="Danger"
                ></el-option>
              </el-select>

              <br /><br /><br />

              <el-select
                v-model="ncConfig.column"
                class="select-success"
                placeholder="Select Column Width"
                style="width: 100%;"
              >
                <el-option
                  class="text-dark"
                  value="col-3"
                  label="col-3"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-4"
                  label="col-4"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-5"
                  label="col-5"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-6"
                  label="col-6"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-7"
                  label="col-7"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-8"
                  label="col-8"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-9"
                  label="col-9"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-10"
                  label="col-10"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-11"
                  label="col-11"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-12"
                  label="col-12"
                ></el-option>
              </el-select>

              <br /><br />
            </div>

            <!-- FORM SWITCH TYPE -->
            <div v-if="selectedWidgetName == 'switch'">
              <base-input
                v-model="iotSwitchConfig.variableFullName"
                label="Var Name"
                type="text"
              >
              </base-input>

              <label for="icon">Icon</label>
              <el-select
                v-model="iotSwitchConfig.icon"
                class="select-success"
                placeholder="Select Icon"
                style="width: 100%;"
              >
                <el-option value="fa-sun" class="text-success" label="Sun">
                </el-option>

                <el-option value="fa-bath" class="text-success" label="Bath">
                </el-option>
              </el-select>

              <br />

              <label for="color">Color</label>
              <el-select
                v-model="iotSwitchConfig.class"
                class="select-success"
                placeholder="Select Class"
                style="width: 100%;"
              >
                <el-option
                  class="text-success"
                  value="success"
                  label="Success"
                ></el-option>
                <el-option
                  class="text-primary"
                  value="primary"
                  label="Primary"
                ></el-option>
                <el-option
                  class="text-warning"
                  value="warning"
                  label="Warning"
                ></el-option>
                <el-option
                  class="text-danger"
                  value="danger"
                  label="Danger"
                ></el-option>
              </el-select>

              <br /><br />
              <label for="color">Columns</label>
              <el-select
                v-model="iotSwitchConfig.column"
                class="select-success"
                placeholder="Select Column Width"
                style="width: 100%;"
              >
                <el-option
                  class="text-dark"
                  value="col-3"
                  label="col-3"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-4"
                  label="col-4"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-5"
                  label="col-5"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-6"
                  label="col-6"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-7"
                  label="col-7"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-8"
                  label="col-8"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-9"
                  label="col-9"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-10"
                  label="col-10"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-11"
                  label="col-11"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-12"
                  label="col-12"
                ></el-option>
              </el-select>
            </div>

            <!-- FORM BUTTON TYPE -->
            <div v-if="selectedWidgetName == 'button'">
              <base-input
                v-model="iotButtonConfig.variableFullName"
                label="Var Name"
                type="text"
              >
              </base-input>

              <base-input
                v-model="iotButtonConfig.message"
                label="Message to send"
                type="text"
              >
              </base-input>

              <base-input
                v-model="iotButtonConfig.text"
                label="Button Text"
                type="text"
              >
              </base-input>

              <label for="icon">Icon</label>
              <el-select
                v-model="iotButtonConfig.icon"
                class="select-success"
                placeholder="Select Icon"
                style="width: 100%;"
              >
                <el-option value="fa-sun" class="text-success" label="Sun">
                </el-option>

                <el-option value="fa-bath" class="text-success" label="Bath">
                </el-option>
              </el-select>

              <br />
              <label for="color">Color</label>
              <el-select
                v-model="iotButtonConfig.colorButton"
                class="select-success"
                placeholder="Select Class"
                style="width: 100%;"
              >
                <el-option
                  class="text-success"
                  value="success"
                  label="Success"
                ></el-option>
                <el-option
                  class="text-primary"
                  value="primary"
                  label="Primary"
                ></el-option>
                <el-option
                  class="text-warning"
                  value="warning"
                  label="Warning"
                ></el-option>
                <el-option
                  class="text-danger"
                  value="danger"
                  label="Danger"
                ></el-option>
              </el-select>

              <br />
              <label for="cols">Columns</label>
              <el-select
                v-model="iotButtonConfig.column"
                class="select-success"
                placeholder="Select Column Width"
                style="width: 100%;"
              >
                <el-option
                  class="text-dark"
                  value="col-3"
                  label="col-3"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-4"
                  label="col-4"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-5"
                  label="col-5"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-6"
                  label="col-6"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-7"
                  label="col-7"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-8"
                  label="col-8"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-9"
                  label="col-9"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-10"
                  label="col-10"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-11"
                  label="col-11"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-12"
                  label="col-12"
                ></el-option>
              </el-select>
            </div>

            <!-- FORM INDICATOR TYPE -->
            <div v-if="selectedWidgetName == 'indicator'">
              <base-input
                v-model="iotIndicatorConfig.variableFullName"
                label="Var Name"
                type="text"
              >
              </base-input>

              <label for="icon">Icon</label>
              <el-select
                v-model="iotIndicatorConfig.icon"
                class="select-success"
                placeholder="Select Icon"
                style="width: 100%;"
              >
                <el-option value="fa-sun" class="text-success" label="Sun">
                </el-option>

                <el-option value="fa-bath" class="text-success" label="Bath">
                </el-option>
              </el-select>

              <br />
              <label for="color">Color</label>
              <el-select
                v-model="iotIndicatorConfig.color"
                class="select-success"
                placeholder="Select Class"
                style="width: 100%;"
              >
                <el-option
                  class="text-success"
                  value="success"
                  label="Success"
                ></el-option>
                <el-option
                  class="text-primary"
                  value="primary"
                  label="Primary"
                ></el-option>
                <el-option
                  class="text-warning"
                  value="warning"
                  label="Warning"
                ></el-option>
                <el-option
                  class="text-danger"
                  value="danger"
                  label="Danger"
                ></el-option>
              </el-select>

              <br /><br />
              <label for="cols">Columns</label>
              <el-select
                v-model="iotIndicatorConfig.column"
                class="select-success"
                placeholder="Select Column Width"
                style="width: 100%;"
              >
                <el-option
                  class="text-dark"
                  value="col-3"
                  label="col-3"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-4"
                  label="col-4"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-5"
                  label="col-5"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-6"
                  label="col-6"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-7"
                  label="col-7"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-8"
                  label="col-8"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-9"
                  label="col-9"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-10"
                  label="col-10"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-11"
                  label="col-11"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-12"
                  label="col-12"
                ></el-option>
              </el-select>
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
    <div class="row">
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
    <div class="row">
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
            label="Template Description"
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
          <h4 class="card-title">Templates</h4>
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
                    @click="showModalDeleteTemplate(row,$index)"
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


      <modal :show="templateToDelete!= null" v-if="templateToDelete">
        <template slot="header">
          <h5 class="modal-title" id="exampleModalLabel">Atention!</h5>
        </template>
        <div>
          Are you sure you wanna DELETE "{{templateToDelete.name.toUpperCase()}}" template?
        </div>
        <template slot="footer">
          <base-button type="secondary"
          @click="closeModalTemplate()"
            >NO</base-button
          >
          <base-button type="info" @click="deleteTemplate(templateToDelete,index)">YES</base-button>
        </template>
      </modal>

    </div>

    <!-- JSONS -->
    <Json :value="widgets"></Json>
  </div>
</template>

<script>
import { Table, TableColumn } from "element-ui";
import { Select, Option } from "element-ui";
import BaseSwitch from "../../components/BaseSwitch.vue";
import IotSwitch from "../../components/Widgets/IotSwitch.vue";
import IotButton from "../../components/Widgets/IotButton.vue";
import IotIndicator from "../../components/Widgets/IotIndicator.vue";
import GraficoRealtime from "../../components/Widgets/GraficoRealtime.vue";

export default {
  middleware:'authtenticated',
  components: {
    IotSwitch,
    IotIndicator,
    IotButton,
    GraficoRealtime,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Option.name]: Option,
    [Select.name]: Select
  },
  data() {
    return {
      widgets: [],
      templates: [],
      selectedWidgetName: "",
      templateName: "",
      templateDescription: "",
      ncConfig: {
        userId: "sampleuserid",
        selectedDevice: {
          name: "Home",
          dId: "8888"
        },
        variableFullName: "temperature",
        variable: "varname",
        unit: "Watts",
        class: "success",
        column: "col-12",
        decimalPlaces: 2,
        widgetName: "numberchart",
        icon: "fa-bath",
        chartTimeAgo: 1566,
        demo: true
      },
      iotSwitchConfig: {
        userId: "userid",
        selectedDevice: {
          name: "Home",
          dId: "8888"
        },
        variableFullName: "Luz",
        variable: "varname",
        class: "danger",
        widgetName: "switch",
        icon: "fa-bath",
        column: "col-6"
      },
      iotButtonConfig: {
        userId: "userid",
        selectedDevice: {
          name: "Home",
          dId: "8888"
        },
        variableFullName: "temperature",
        text: "send",
        message: "testing123",
        variable: "varname",
        widgetName: "button",
        colorButton: "primary",
        icon: "fa-bath",
        column: "col-6"
      },
      iotIndicatorConfig: {
        userId: "userid",
        selectedDevice: {
          name: "Home",
          dId: "8888"
        },
        variableFullName: "temperature",
        variable: "varname",
        color: "success",
        widgetName: "indicator",
        icon: "fa-bath",
        column: "col-6"
      },
      value: false,
      templateToDelete:null,
      indexToDelete:null,
    };
  },
  methods: {
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
        const token = this.$store.getters['auth/getToken'];
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

    async deleteTemplate(template,index) {
      try {
        const token = this.$store.state.auth.auth.token;
        const axiosHeaders = {
          headers: {
            "x-auth-token": token
          },
          params:{
            _id:template._id
          }
        };
        const res = await this.$axios.delete("/template", axiosHeaders);
        if (res.data.status == "success") {
            this.templates.splice(index,1)
            this.$notify({
            type: "success",
            icon: "tim-icons icon-check-2",
            message: `Template "${template.name.toUpperCase()}" deleted!`
        });
        this.templateToDelete=null;

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
          this.widgets.push(JSON.parse(JSON.stringify(this.iotButtonConfig)));
          break;
        case "numberchart":
          this.ncConfig.variable = this.makeid(10);
          this.widgets.push(JSON.parse(JSON.stringify(this.ncConfig)));
          break;
        case "indicator":
          this.iotIndicatorConfig.variable = this.makeid(10);
          this.widgets.push(
            JSON.parse(JSON.stringify(this.iotIndicatorConfig))
          );
          break;
        case "switch":
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
    closeModalTemplate(){
      this.templateToDelete=null;
    },
    showModalDeleteTemplate(template, index){
      this.templateToDelete=template;
      this.indexToDelete=index;
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
    await this.getTemplates();
  }
};
</script>
