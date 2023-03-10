<template>
  <card type="gauge">
    <template slot="header">
      <h5 class="card-category">{{ "name" }} - {{ "varname" }}</h5>

      <h3 class="card-title">
        iotgauge
      </h3>
    </template>

    <div class="chart-area" style="height: 300px">
      <highchart style="height: 100%" :options="gaugeOptions" />
    </div>
  </card>
</template>

<script>
import('highcharts/highcharts').Options
export default {
  // props['config']
  data() {
    return {
      config: {
        selectedDevice: {
          name: "Home",
          dId: "243"
        },
        variableFullName: "Velocidad",
        variable: "ajdakdhakjs",
        solid: true
      },
      gaugeOptions: {
        credits: {
          enabled: false
        },
        chart: {
          type: "gauge",
          renderTo: "container",
          backgroundColor: "rgba(0,0,0,0)"
        },
        title: {
          text: "TITULO DEL GAUGE"
        },
        pane: {
          startAngle: -90,
          endAngle: 89.9,
          background: null,
          center: ["50%", "75%"],
          size: "110%"
        },
        yAxis: {
          min: 0,
          max: 200,
          tickPixelInterval: 72,
          tickPosition: "inside",
          tickColor:
           "#FFFFFF",
          tickLength: 20,
          tickWidth: 2,
          minorTickInterval: null,
          labels: {
            distance: 20,
            style: {
              fontSize: "14px"
            }
          },
          plotBands: [
            {
              from: 0,
              to: 120,
              color: "#55BF3B", // green
              thickness: 20
            },
            {
              from: 120,
              to: 160,
              color: "#DDDF0D", // yellow
              thickness: 20
            },
            {
              from: 160,
              to: 200,
              color: "#DF5353", // red
              thickness: 20
            }
          ]
        },

        series: [
          {
            name: "Speed",
            data: [80],
            tooltip: {
              valueSuffix: " km/h"
            },
            dataLabels: {
              format: "{y} km/h",
              borderWidth: 0,
              color:
                "#333333",
              style: {
                fontSize: "16px"
              }
            },
            dial: {
              radius: "80%",
              backgroundColor: "gray",
              baseWidth: 12,
              baseLength: "0%",
              rearLength: "0%"
            },
            pivot: {
              backgroundColor: "gray",
              radius: 6
            }
          }
        ]   
      }
    };
  },
  
};
</script>
