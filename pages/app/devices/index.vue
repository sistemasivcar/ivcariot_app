<template>
  <div>
    <NewDevice></NewDevice>
    <ListDevices></ListDevices>
  </div>
</template>

<script>
import ListDevices from "../../../components/Devices/ListDevices.vue";
import NewDevice from "../../../components/Devices/NewDevice.vue";

export default {
  components: { NewDevice, ListDevices }
};
</script>

<script>


export default {
  middleware: "authtenticated",


};
</script>
