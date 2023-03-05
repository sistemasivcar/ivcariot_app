<template>
  <div class="row">
    <card v-if="templates.length > 0">
      <div slot="header">
        <h4 class="card-title pull-left">{{ $t("listTitle") }}</h4>

        <BaseDropdown
          title-tag="a"
          class="nav-item pull-right"
          :menuOnRight="true"
        >
          <template slot="title">
            <i class="tim-icons icon-bullet-list-67"></i>
          </template>
          <li @click="$emit('create-template')">
            <a class="text-dark ml-2"
              >Nueva Privada<i class="fa fa-plus ml-2 text-success"></i
            ></a>
          </li>
          <div class="dropdown-divider"></div>
          <li
            @click="usePublicTemplates()"
            v-if="!$store.state.auth.auth.userData.config.usePublicTemplates"
          >
            <a class="text-dark ml-2"
              >Importar Públicas<i class="fa fa-download ml-2 text-warning"></i>
            </a>
          </li>
          <li @click="noUsePublicTemplates()" v-else>
            <a class="text-dark ml-2"
              >Quitar Públicas<i class="fa fa-download ml-2 text-warning"></i>
            </a>
          </li>
        </BaseDropdown>
      </div>

      <div class="row">
        <el-table :data="templates">
          <el-table-column min-width="50" label="#" align="center">
            <div class="photo" slot-scope="{ row, $index }">
              {{ $index + 1 }}
            </div>
          </el-table-column>

          <el-table-column prop="name" label="Name"></el-table-column>

          <el-table-column label="Description"
            ><div slot-scope="{ row }" class="">
              {{ row.description }}
            </div></el-table-column
          >

          <el-table-column header-align="right" label="Widgets">
            <div slot-scope="{ row }" class="text-right">
              {{ row.widgets.length }}
            </div>
            ></el-table-column
          >

          <el-table-column header-align="right" label="Actions">
            <div slot-scope="{ row, $index }" class="text-right table-actions" v-if="row.userId === $store.state.auth.auth.userData._id">
              <el-tooltip
              v-if="!row.isPublic"
                content="Hacer Pública"
                effect="light"
                :open-delay="300"
                placement="top"
              >
                <base-button
                  @click="publicTemplate(row)"
                  type="success"
                  icon
                  size="sm"
                  class="btn-link"
                >
                  <i class="tim-icons icon-world"></i>
                </base-button>
              </el-tooltip>

              <el-tooltip
                v-if="row.isPublic"
                content="Hacer Privada"
                effect="light"
                :open-delay="300"
                placement="top"
              >
                <base-button
                  @click="privateTemplate(row)"
                  type="success"
                  icon
                  size="sm"
                  class="btn-link"
                >
                  <i class="tim-icons icon-key-25"></i>
                </base-button>
              </el-tooltip>

              <el-tooltip
                :content="$t('tooledit')"
                effect="light"
                :open-delay="300"
                placement="top"
              >
                <base-button
                  @click="goEditTemplate(row, $index)"
                  type="warning"
                  icon
                  size="sm"
                  class="btn-link"
                >
                  <i class="tim-icons icon-settings "></i>
                </base-button>
              </el-tooltip>

              <el-tooltip
                :content="$t('tooldelete')"
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
                ><i class="tim-icons icon-simple-remove "></i>
                </base-button>
                
              </el-tooltip>
            </div>
            <p class="pull-right" v-else>PÚBLICA</p>
          </el-table-column>
        </el-table>
      </div>
    </card>

    <modal :show="templateToDelete != null" v-if="templateToDelete">
      <template slot="header">
        <h5 class="modal-title" id="exampleModalLabel">Atention!</h5>
      </template>
      <div v-if="!templateInUse">
        {{
          $t("templates.list.deletemodal {templateToDelete}", {
            templateToDelete: templateToDelete.name.toUpperCase()
          })
        }}
      </div>
      <div v-else>
        {{
          $t("templates.list.tempinuse {templateToDelete}", {
            templateToDelete: templateToDelete.name.toUpperCase()
          })
        }}
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
      </template>
    </modal>
  </div>
</template>

<script lang="js">
import { Table, TableColumn } from "element-ui";
import Card from "../Cards/Card.vue";
import BaseButton from "../BaseButton.vue";
import BaseDropdown from '../BaseDropdown.vue'
export default {
    props:['templates'],
    components: {
      Card,
      BaseButton,
      [Table.name]: Table,
      [TableColumn.name]: TableColumn,
      BaseDropdown
    },
    data() {
        return {
            templateToDelete: null,
            indexToDelete: null,
            templateInUse: false,
        }
    },
    computed:{

    },
    methods: {
      async publicTemplate(row){
        try {
        const token = this.$store.getters["auth/getToken"];
        const axiosHeaders = {
          headers: {
            "x-auth-token": token
          }
        };
        const toSend = {
          template: {
            isPublic:true,
            id: row._id,
          }
        }
        await this.$axios.put("/template",toSend, axiosHeaders);
        this.$emit('get-templates')
        this.$notify({
          type: "success",
          icon: "tim-icons icon-check-2",
          message: "Tu plantilla ahora es PÚBLICA!"
        });
      } catch (e) {
        if (!e.response) {
          this.$notify({
            type: "danger",
            icon: "tim-icons icon-alert-circle-exc",
            message: "Network Error"
          });
          return;
        }
        this.$notify({
          type: "danger",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Algo salió mal!"
        });
      }

      },
      async privateTemplate(row){
        try {
        const token = this.$store.getters["auth/getToken"];
        const axiosHeaders = {
          headers: {
            "x-auth-token": token
          }
        };
        const toSend = {
          template: {
            isPublic:false,
            id: row._id,
          }
        }
        await this.$axios.put("/template",toSend, axiosHeaders);
        this.$emit('get-templates')
        this.$notify({
          type: "success",
          icon: "tim-icons icon-check-2",
          message: "Tu plantilla ahora es PRIVADA!"
        });
      } catch (e) {
        if (!e.response) {
          this.$notify({
            type: "danger",
            icon: "tim-icons icon-alert-circle-exc",
            message: "Network Error"
          });
          return;
        }
        this.$notify({
          type: "danger",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Algo salió mal!"
        });
      }
      },
      async noUsePublicTemplates(){
        try {
        this.$store.commit('auth/usePublicTemplates',false);
        const userUpdated = this.$store.state.auth.auth.userData;
        await this.$store.dispatch("auth/updateProfile",userUpdated);
        this.$notify({
            type: "success",
            icon: "tim-icons icon-check-2",
            message: `Plantillas Quitadas! Para actualizar los cambios deberás volverte a loguear`
          });

        this.$store.dispatch("auth/fetchUserData");

      }catch(e){

        }
      },
      async usePublicTemplates() {
      try {
        this.$store.commit('auth/usePublicTemplates',true);
        const userUpdated = this.$store.state.auth.auth.userData;
        await this.$store.dispatch("auth/updateProfile",userUpdated);
        this.$notify({
            type: "success",
            icon: "tim-icons icon-check-2",
            message: `Plantillas Importadas! Para verlas deberás volverte a loguear`
          });
        this.$store.dispatch("auth/fetchUserData");


      }catch(e){

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
      goEditTemplate(template) {
        const locale = this.$store.getters['locale/getLocale'];
        // si es "en" o "" (es)
        locale ? this.$router.push(`/${locale}/app/templates/${template._id}`)
          : this.$router.push(`${locale}/app/templates/${template._id}`);

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

    },
    created(){
      this.$store.dispatch("auth/fetchUserData");

    },
}
</script>
