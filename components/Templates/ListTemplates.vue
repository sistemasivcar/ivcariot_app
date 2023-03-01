<template>
  <div class="row">
    <card>
      <div slot="header">
        <h4 class="card-title">{{ $t("listTitle") }}</h4>
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
            label="Description"
            
          ><div slot-scope="{row}" class="">{{ row.description }}</div></el-table-column>

          <el-table-column
          header-align="right"
            label="Widgets">
            <div slot-scope="{row}" class="text-right">{{ row.widgets.length }}</div>
          ></el-table-column>

          <el-table-column header-align="right" label="Actions">
            <div slot-scope="{ row, $index }" class="text-right table-actions">
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
        {{ $t('templates.list.deletemodal {templateToDelete}',{templateToDelete:templateToDelete.name.toUpperCase()}) }}
      </div>
      <div v-else>
        
          {{ $t('templates.list.tempinuse {templateToDelete}',{templateToDelete:templateToDelete.name.toUpperCase()}) }}
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
        <base-button type="secondary"  @click="closeModalTemplate()"
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
export default {
    props:['templates'],

    components: {
        Card,
        BaseButton,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,



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

    },
}
</script>
