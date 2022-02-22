<template>
  <div v-if="!isFetching">
    <div class="wrapper">
      <div style="display: flex; justify-content: center; color: #a60dbf;">
        <h5 class="title">Статистика доходов и посещений</h5>
      </div>
      <div>
        <h3 class="current-date">{{ currentDate }}</h3>
      </div>
      <div class="card-wrapper">
        <div class="card session-count-card">
          <v-icon class="session-icon">mdi-clock-time-four-outline</v-icon>
          <div style="z-index: 1">
            <h1
              style="
                font-size: 60px !important;
                display: flex;
                justify-content: center;
              "
            >
              {{ records.all_count }}
            </h1>
            <p>сеансов вы провели</p>
          </div>
        </div>
        <div class="card clients-card">
          <v-icon class="clients-icon">mdi-account-multiple</v-icon>
          <div style="z-index: 1">
            <h1
              style="
                font-size: 60px !important;
                display: flex;
                justify-content: center;
              "
            >
              {{ clients.per_month }}/{{ clients.all_count }}
            </h1>
            <p>новых/всего клиентов</p>
          </div>
        </div>
        <div class="card income-card">
          <v-icon class="income-icon">mdi-currency-rub</v-icon>
          <div style="z-index: 1">
            <h1
              style="
                font-size: 60px !important;
                display: flex;
                justify-content: center;
              "
            >
              {{ profit }}
            </h1>
            <p>Ваш доход</p>
          </div>
        </div>
      </div>
      <div style="display: flex; justify-content: center; color: #a60dbf; margin-top: 15px;margin-bottom: 15px;">
        <h4>Доход за текущий год</h4>
      </div>
      <div>
        <LineChart @changeMonth="logInfo" />
      </div>
    </div>
  </div>
</template>

<script>
import LineChart from "./LineChart.vue";
import axiosInstance from "../../plugins/axios";
export default {
  name: "Statistics",
  components: {
    LineChart,
  },

  methods: {
    async fetchData() {
      let date = new Date();

      let clients = await axiosInstance.get(
        `reports/clients/?year=${date.getFullYear()}&month=${
          this.currentMonth + 1
        }`
      );
      this.clients = clients.data;

      let records = await axiosInstance.get(
        `reports/records/?year=${date.getFullYear()}&month=${
          this.currentMonth + 1
        }`
      );

      this.records = records.data;

      let profit = await axiosInstance.get(
        `reports/profit_graph/?year=${date.getFullYear()}`
      );

      this.profit = profit.data[this.currentMonth];
    },

    logInfo(month) {
      this.currentMonth = month;
    },
  },

  computed: {
    currentDate() {
      let date = new Date(new Date().getFullYear(), this.currentMonth);
      return `${date.toLocaleString("ru-RU", {
        month: "long",
      })} ${date.getFullYear()}`;
    },
  },

  data() {
    return {
      isFetching: true,
      records: null,
      clients: null,
      profit: null,

      currentMonth: new Date().getMonth(),
    };
  },

  watch: {
    currentMonth() {
      this.fetchData();
    },
  },

  async mounted() {
    await this.fetchData();
    this.isFetching = false;
  },
};
</script>

<style scoped>
.current-date {
  margin-left: 40px;
  margin-bottom: 15px;
}

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
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to right, #2da771, #0cff97);
}

.clients-card {
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to right, #a60dbf, #e12dff);
}

.session-count-card {
  display: flex;
  justify-content: center;
  align-items: center;
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
  display: flex;
  justify-content: center;
}

.wrapper {
  background-color: white;
  min-height: 100%;
}
</style>
