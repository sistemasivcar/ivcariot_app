<template>
  <div>
    <h2></h2>
  </div>
</template>

<script>
import { Table, TableColumn } from "element-ui";
import { Select, Option } from "element-ui";

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
        alarmsRules: [],
        newRule: {
            dId: null,
            status: null,
            variableFullName: null,
            variable: null,
            value: null,
            condition: null,
            triggerTime: null
        }
        };
    },
    mounted() {},
    computed: {},
    methods: {}
};
</script>
