import { Line, mixins } from "vue-chartjs";
const { reactiveProp } = mixins;

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: ["chartData","options"],

  data(){
    return {
      newOptions: {
        responsive: true,
        maintainAspectRatio: true
      },

      datacollection: {
        labels: [
          "week 1",
          "week 2",
          "week 3",
          "week 4",
          "week 5",
          "week 6",
          "week 7",
          "week 8",
          "week 9",
          "week 10",
        ],
        datasets: [
          {
            data: [86, 114, 106, 106, 107, 111, 133, 221, 783, 400, 300, 560],
            label: "Africa",
            borderColor: "#3e95cd",
            fill: false,
          },
        ],
      },
    }
  },

  methods: {
    renderChartMethod(data, options) {
      this.renderChart(data, options);
    },
  },

  mounted() {
    this.renderChart(this.datacollection, this.newOptions);
  },
};
