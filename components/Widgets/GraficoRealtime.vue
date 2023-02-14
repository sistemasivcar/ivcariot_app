<template>
  <card type="chart">
    <template slot="header">
      <h5 class="card-category pull-right">
        {{ getTimeAgo((nowTime - time) / 1000) }} ago
      </h5>

      <h5 class="card-category">
        {{ config.selectedDevice.name }} - {{ config.variableFullName }}
      </h5>

      <h3 class="card-title">
        <i
          class="fa "
          :class="[config.icon, getIconColorClass()]"
          aria-hidden="true"
          style="font-size: 30px;"
        ></i>
        <span>{{ value.toFixed(config.decimalPlaces) }} {{ config.unit }}</span>
      </h3>
    </template>

    <div class="chart-area" style="height: 300px">
      <highchart
        style="height: 100%"
        v-if="isMounted"
        :options="chartOptions"
      />
    </div>
  </card>
</template>

<script>
export default {
  name: "rtnumberchart",
  props: ["config"],
  data() {
    return {
      receivedTime: 0,
      value: 0,
      time: Date.now(),
      nowTime: Date.now(),
      isMounted: false,

      chartOptions: {
        credits: {
          enabled: false
        },
        chart: {
          zoomType:'x',
          timezone:'America/Argentina/Buenos_Aires',
          renderTo: "container",
          defaultSeriesType: "line",
          backgroundColor: "rgba(0,0,0,0)"
        },
        title: {
          text: ""
        },
        xAxis: {
          type: "datetime",
          zoomEnabled:true,
          labels: {
            style: {
              color: "#d4d2d2"
            }
          }
        },
        
        yAxis: {
          zoomEnabled:true,
          title: {
            text: ""
          },
          labels: {
            style: {
              color: "#d4d2d2",
              font: "11px Trebuchet MS, Verdana, sans-serif"
            }
          }
        },

        plotOptions: {
          series: {
            label: {
              connectorAllowed: false
            },
            pointStart: 2010
          }
        },
        series: [
          {
            name: "",
            data: [],
            color: "#e14eca"
          }
        ],
        legend: {
          itemStyle: {
            color: "#d4d2d2"
          }
        },
        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 500
              },
              chartOptions: {
                legend: {
                  layout: "horizontal",
                  align: "center",
                  verticalAlign: "bottom"
                }
              }
            }
          ]
        }
      }
    };
  },
  watch: {
    config: {
      immediate: true,
      deep: true,
      handler() {
        setTimeout(() => {
          this.chartOptions.series[0].name =
            this.config.variableFullName + " " + this.config.unit;
          this.updateColorClass();
          window.dispatchEvent(new Event("resize"));
        }, 1000);
      }
    }
  },
  mounted() {
    this.$nuxt.$on(
      this.config.userId +
        "/" +
        this.config.selectedDevice.dId +
        "/" +
        this.config.variable +
        "/sdata",
      this.procesReceivedData
    );

    this.getNow();
    this.getChartData();
    this.updateColorClass();
  },
  beforeDestroy() {
    this.$nuxt.$on(
      this.config.userId +
        "/" +
        this.config.selectedDevice.dId +
        "/" +
        this.config.variable +
        "/sdata",
      this.procesReceivedData
    );
  },
  methods: {
    updateColorClass() {
      console.log("update" + this.config.class);

      var c = this.config.class;

      if (c == "success") {
        this.chartOptions.series[0].color = "#00f2c3";
      }
      if (c == "primary") {
        this.chartOptions.series[0].color = "#e14eca";
      }
      if (c == "warning") {
        this.chartOptions.series[0].color = "#ff8d72";
      }
      if (c == "danger") {
        this.chartOptions.series[0].color = "#fd5d93";
      }
      if (c == "info") {
        this.chartOptions.series[0].color = "rgba(40, 150, 252, 0.7)";
      }

      this.chartOptions.series[0].name =
        this.config.variableFullName + " " + this.config.unit;
    },

    getChartData() {
      if (this.config.demo) {
        this.chartOptions.series[0].data = [
          [1606659071668, 22],
          [1606659072668, 27],
          [1606659073668, 32],
          [1606659074668, 7]
        ];
        this.isMounted = true;
        return;
      }

      const axiosHeaders = {
        headers: {
          'x-auth-token': this.$store.getters['auth/getToken']
        },
        params: {
          dId: this.config.selectedDevice.dId,
          variable: this.config.variable,
          chartTimeAgo: this.config.chartTimeAgo
        }
      };

      this.$axios
        .get("data/get-data-chart", axiosHeaders)
        .then(res => {
          const data = res.data.data;
          console.log(res.data);

          data.forEach(dato => {
            var point = [];

            point.push(
              dato.time + new Date().getTimezoneOffset() * 60 * 1000 * -1
            );
            point.push(dato.value);

            this.chartOptions.series[0].data.push(point);
          });

          this.isMounted = true;

          return;
        })
        .catch(e => {
          console.log(e);
          return;
        });
    },

    getIconColorClass() {
      if (this.config.class == "success") {
        return "text-success";
      }
      if (this.config.class == "primary") {
        return "text-primary";
      }
      if (this.config.class == "warning") {
        return "text-warning";
      }
      if (this.config.class == "danger") {
        return "text-danger";
      }
      if (this.config.class == "info") {
        return "text-info";
      }
    },

    procesReceivedData(data) {
      this.time = Date.now();
      this.value = data.value;
      if(data.save){
        //pusheo al array
        const point = [Date.now()-(new Date().getTimezoneOffset() * 60 * 1000),data.value]
        this.chartOptions.series[0].data.push(point)
      }
    },

    getNow() {
      this.nowTime = Date.now();
      setTimeout(() => {
        this.getNow();
      }, 1000);
    },

    getTimeAgo(seconds) {
      if (seconds < 0) {
        seconds = 0;
      }

      if (seconds < 59) {
        return seconds.toFixed() + " secs";
      }

      if (seconds > 59 && seconds <= 3600) {
        seconds = seconds / 60;
        return seconds.toFixed() + " min";
      }

      if (seconds > 3600 && seconds <= 86400) {
        seconds = seconds / 3600;
        return seconds.toFixed() + " hour";
      }

      if (seconds > 86400) {
        seconds = seconds / 86400;
        return seconds.toFixed() + " day";
      }
    }
  }
};
</script>
<style></style>
