<template>
  <div>
    <v-tabs v-model="tab" centered align-with-title>
      <v-tabs-slider color="blue"></v-tabs-slider>

      <div class="tabs-wrapper">
        <v-tab>
          <p>День</p>
        </v-tab>

        <v-tab>
          <p>Неделя</p>
        </v-tab>
      </div>

      <v-tabs-items v-model="tab">
        <v-tab-item>
          <DayRecords />
        </v-tab-item>
        <v-tab-item>
          <WeekRecords />
        </v-tab-item>
      </v-tabs-items>
    </v-tabs>

  </div>
</template>

<script>
import WeekRecords from "./WeekRecords";
import DayRecords from "./DayRecords";
export default {
  name: "mainPage",
  components: {
    DayRecords,
    WeekRecords,
  },

  data() {
    return {
      tab: 0,
      servicesList: false,
    };
  },
};
</script>

<style scoped>
.tabs-wrapper {
  display: flex;
  justify-content: center;
}
</style>
