<template>
  <div>
    <NewAlarm></NewAlarm>
    <ListAlarms></ListAlarms>
  </div>
</template>

<script>
import ListAlarms from "../../../components/Alarms/ListAlarms.vue";
import NewAlarm from "../../../components/Alarms/NewAlarm.vue";

export default {
  middleware: "authtenticated",
  components: { ListAlarms, NewAlarm },
  computed: {}
};
</script>
