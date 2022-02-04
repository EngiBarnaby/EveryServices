<template>
  <v-row class="fill-height">
    <v-col>
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
        >
          <template slot="day-label-header">
            <div class="calendar-header">
              <v-sheet height="64">
                <v-toolbar flat>
                  <v-btn fab text small color="grey darken-2" @click="prev">
                    <v-icon small> mdi-chevron-left </v-icon>
                  </v-btn>

                  <div class="current-date">
                    {{ currentDay }}
                  </div>

                  <v-btn fab text small color="grey darken-2" @click="next">
                    <v-icon small> mdi-chevron-right </v-icon>
                  </v-btn>
                  <v-toolbar-title v-if="$refs.calendar">
                    {{ $refs.calendar.title }}
                  </v-toolbar-title>
                  <v-spacer></v-spacer>
                </v-toolbar>
              </v-sheet>
            </div>
          </template>
        </v-calendar>
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
    currentDay() {
      return this.focus.split("-")[2];
    },

    parsDay() {
      let date = this.focus.split("-");
      date = `${date[2]}.${date[1]}.${date[0]}`;
      return date;
    },

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

  watch: {
    focus() {
      console.log(this.focus);
    },
  },

  methods: {
    getEventColor(event) {
      return event.color;
    },
    prev() {
      this.$refs.calendar.prev();
      this.fetchEvents();
    },
    next() {
      this.$refs.calendar.next();
      this.fetchEvents();
    },

    async fetchEvents() {
      try {
        let { data } = await axiosInstance.get(`records/?date=${this.parsDay}`);
        this.parseRecords(data.results);
      } catch (e) {
        console.log(e);
      }
    },

    async fetchData() {
      let date = new Date();
      date = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
      try {
        let { data } = await axiosInstance.get(`records/?date=${date}`);
        this.parseRecords(data.results);
      } catch (e) {
        console.log(e);
      }
    },

    async parseRecords(data) {
      let array = [];
      for (let record of data) {
        let { data } = await axiosInstance.get(
          `services/services/${record.service}/`
        );
        let end_time = this.parseDate(record.end_time);
        let recording_time = this.parseDate(record.recording_time);
        array.push({
          name: data.name,
          start: recording_time,
          end: end_time,
          color: "blue",
          timed: [],
        });
        this.events = array;
      }
    },

    async getService(service) {
      let { data } = await axiosInstance.get(
        `services/services/${service.service}/`
      );
      return data.name;
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
    let date = new Date();
    this.focus = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;
    this.$refs.calendar.checkChange();
    this.$refs.calendar.scrollToTime("08:00");
    this.fetchData();
  },
};
</script>

<style scoped>
.calendar {
  margin-left: 100px;
  height: 90vh;
  width: 80%;
}

.calendar-header {
  display: flex;
  justify-content: center;
}

.current-date {
  display: flex;
  justify-content: center;
  align-content: center;
  color: white;
  padding: 15px;
  border-radius: 50%;
  background-color: #a60dbf;
  min-height: 50px;
  min-width: 50px;
  max-height: 50px;
  max-width: 50px;
}
</style>
