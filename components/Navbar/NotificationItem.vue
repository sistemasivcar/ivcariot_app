<template>
  <li>
    <a href="#" class="nav-item dropdown-item"
    @click="setNotifReaded()">
      <b style="color:orangered">{{ unixToDate(time) }}</b>
      <div style="margin-left:50px">
        <b>Device: </b> {{ getNameDevice(dId) }} <br />
        <b>Variable: </b> {{ varName.toUpperCase() }} <br />
        <b>With: </b> {{ value }}
        <b>Condition: </b> {{ condition }} {{ valueToMatch }}<br />
      </div>
    </a>
  </li>
</template>

<script>
export default {
  props: ["time", "varName", "condition", "valueToMatch", "dId", 'idNotif','value'],
  data() {
    return {};
  },
  methods: {
    setNotifReaded(){
        this.$emit('setNotifReaded',this.idNotif)
    },
    getNameDevice(dId) {
      const devices = this.$store.getters["devices/getDevices"];
      const device = devices.find(d => (d.dId == dId));
      return device.name;
    },
    unixToDate(ms) {
      var d = new Date(parseInt(ms)),
        yyyy = d.getFullYear(),
        mm = ("0" + (d.getMonth() + 1)).slice(-2), // Months are zero based. Add leading 0.
        dd = ("0" + d.getDate()).slice(-2), // Add leading 0.
        hh = d.getHours(),
        h = hh,
        min = ("0" + d.getMinutes()).slice(-2), // Add leading 0.
        ampm = "AM",
        time;
      if (hh > 12) {
        h = hh - 12;
        ampm = "PM";
      } else if (hh === 12) {
        h = 12;
        ampm = "PM";
      } else if (hh == 0) {
        h = 12;
      }
      // ie: 2013-02-18, 8:35 AM
      time = dd + "/" + mm + "/" + yyyy + ", " + h + ":" + min + " " + ampm;
      return time;
    }
  }
};
</script>
