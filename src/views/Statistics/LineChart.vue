<template>
  <div>
    <LineChart ref="chart" />
  </div>
</template>

<script>
import LineChart from "./LineChart";
import Vue from "vue";
import axiosInstance from "../../plugins/axios"; // vue-chartjs
export default {
  name: "LineSample",
  data() {
    return {
      dataset: {
        labels: [
          "янв",
          "фев",
          "март",
          "апр",
          "май",
          "июнь",
          "июль",
          "авг",
          "сент",
          "окт",
          "ноя",
          "дек",
        ],
        datasets: [
          {
            label: "Доход",
            backgroundColor: "transparent",
            borderColor: "#bb02d9",
            data: [40, 39, 10, 40, 39, 80, 44, 10, 40, 39, 80, 44],
          },
        ],
      },

      options: {},
    };
  },
  components: {
    LineChart,
  },

  methods : {
    logInfo(item){
      if(item.length !== 0){
        // console.log(item[0]._index, "It's work")
        this.$emit("changeMonth", item[0]._index)
      }
    }
  },

  async mounted() {
    var _this = this;
    let date = new Date();
    let { data } = await axiosInstance.get(
      `reports/profit_graph/?year=${date.getFullYear()}`
    );

    this.options = {
      legend: {
        display: false,
      },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
      onClick(e, item) {
        _this.logInfo(item);
      },
    };
      this.dataset.datasets[0].data = data;

    Vue.nextTick(() => this.$refs.chart.initDate(this.dataset, this.options));
  },
};
</script>
