<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat>
          <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
            Сегодня
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="prev">
            <v-icon small> mdi-chevron-left </v-icon>
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="next">
            <v-icon small> mdi-chevron-right </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
      </v-sheet>
      <v-sheet class="calendar">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          type="day"
          category-show-all
          :categories="categories"
          :events="events"
          locale="ru"
          :event-color="getEventColor"
          @change="fetchEvents"
        ></v-calendar>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import axiosInstance from "../../plugins/axios";
export default {
  data: () => ({
    focus: "",
    events: [],
    colors: [
      "blue",
      "indigo",
      "deep-purple",
      "cyan",
      "green",
      "orange",
      "grey darken-1",
    ],
    names: [],
    categories: ["Ваш график"],
  }),

  computed: {
    parsEvents() {
      let eventsData = [];
      for (let i of this.events) {
        eventsData.push({
          id: i.id,
          name: i.title,
          start: i.start_planning,
          end: i.end_planning,
          color: "blue",
        });
      }
      return eventsData;
    },
  },

  methods: {
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = "";
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },

    async fetchData() {
      try {
        let { data } = await axiosInstance.get(`records/?date=${this.value}`);
        this.parseRecords(data.results);
      } catch (e) {
        console.log(e);
      }
    },

    parseRecords(data) {
      for (let record of data) {
        let end_time = this.parseDate(record.end_time);
        let recording_time = this.parseDate(record.recording_time);
        console.log(end_time, recording_time);
        this.events.push({
          start: recording_time,
          end: end_time,
          // color: this.colors[this.rnd(0, this.colors.length - 1)],
          color: "blue",
          timed: [],
        });
        console.log(this.events);
      }
    },

    parseDate(date) {
      let currentDate = date.split(".");
      let day = currentDate[0];
      let month = currentDate[1];
      let year = currentDate[2].split(" ")[0];
      let hour = currentDate[2].split(" ")[1].split(":")[0];
      let minute = currentDate[2].split(" ")[1].split(":")[1];
      return new Date(year, month - 1, day, hour, minute);
    },

    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
  },
  mounted() {
    this.$refs.calendar.checkChange();
    this.fetchData();
  },
};
</script>

<style scoped>
.calendar {
  height: 90vh;
}
</style>
