<template>
  <div>
    <DatePicker ref="date_picker" />
    <v-btn @click="test">Test</v-btn>
    <LineChart />
  </div>
</template>

<script>
import DatePicker from "../components/inputs/DatePicker2";
import LineChart from "./Statistics/LineChart.vue";
export default {
  name: "Test",
  components: { DatePicker, LineChart },

  methods: {
    test() {
      this.$refs.date_picker.logInfo();
    },
  },
};
</script>

<style scoped></style>
