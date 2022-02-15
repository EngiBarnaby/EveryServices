<template>
  <div v-if="!isFetching">
    <v-container>
      <div class="wrapper">
        <div style="display: flex; justify-content: center; color: #a60dbf">
          <h5 class="title">Статистика доходов и посещений</h5>
        </div>

        <div class="card-wrapper">
          <div class="card session-count-card">
            <v-icon class="session-icon">mdi-clock-time-four-outline</v-icon>
          </div>
          <div class="card clients-card">
            <v-icon class="clients-icon">mdi-account-multiple</v-icon>
          </div>
          <div class="card income-card">
            <v-icon class="income-icon">mdi-currency-rub</v-icon>
          </div>
        </div>
        <div>
          <LineChart />
        </div>
      </div>
    </v-container>
  </div>
</template>

<script>
import LineChart from "./LineChart.vue";
export default {
  name: "Statistics",
  components : {
    LineChart
  },

  data() {
    return {


      isFetching : true,

      records: null,
      clients: null,
    };
  },

  async mounted() {
    this.isFetching = false
  },
};
</script>

<style scoped>


.income-icon {
  position: absolute;
  top: 0px;
  left: 0px;
  font-size: 100px;
  z-index: 0;
  color: #bdbdbd;
}

.clients-icon {
  position: absolute;
  top: 0px;
  left: 0px;
  font-size: 100px;
  z-index: 0;
  color: #bdbdbd;
}

.session-icon {
  position: absolute;
  top: 0px;
  left: 0px;
  font-size: 100px;
  z-index: 0;
  color: #fab132;
}

.income-card {
  background: linear-gradient(to right, #2da771, #0cff97);
}

.clients-card {
  background: linear-gradient(to right, #a60dbf, #e12dff);
}

.session-count-card {
  background: linear-gradient(to right, #ff6b00, #ffe000);
}

.card {
  position: relative;
  width: 260px;
  height: 140px;
  border-radius: 20px;
  margin-right: 25px;
  margin-left: 25px;
}

.card-wrapper {
  margin-top: 40px;
  padding-bottom: 40px;
  display: flex;
  justify-content: center;
}

.wrapper {
  background-color: white;
  min-height: 100%;
}
</style>
