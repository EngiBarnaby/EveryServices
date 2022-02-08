<template>
  <div>
    <DatePicker ref="date_picker" />
    <v-btn @click="test">Test</v-btn>
  </div>
</template>

<script>
import DatePicker from "../components/inputs/DatePicker2";
export default {
  name: "Test",
  components: { DatePicker },

  methods: {
    test() {
      this.$refs.date_picker.logInfo();
    },
  },
};
</script>

<style scoped></style>
