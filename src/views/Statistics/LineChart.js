import { Line } from "vue-chartjs";

export default {
  extends: Line,

  props : ["data", "options"],

  methods : {
    initDate(data, options){
      this.renderChart(data, options)
    },

    logInfo(){
      console.log("It's work");
    }

  },


};