<template>
  <div>
    <v-dialog
      v-model="dialogEventInfo"
      width="500"
      @click:outside="closeAndClear"
    >
      <v-card class="pa-4">
        <v-card-title> Добавление услугу </v-card-title>
        <v-form v-model="isValid" @submit.prevent="addRecord">
          <v-autocomplete
            background-color="white"
            v-model="service_selected"
            :items="services"
            item-text="name"
            item-value="id"
            dense
            outlined
            label="Услуга"
            clearable
            no-data-text="Нет доступных данных"
          />

          <v-autocomplete
            background-color="white"
            v-model="client_selected"
            :items="clients"
            item-text="name"
            item-value="id"
            dense
            outlined
            label="Клиент"
            clearable
            no-data-text="Нет доступных данных"
          />

          <v-text-field
            outlined
            dense
            v-model="duration"
            type="time"
            label="Длительность"
            :rules="[(v) => !!v || 'Обязательное поле']"
          ></v-text-field>

          <v-text-field
            type="number"
            v-model="cost"
            outlined
            dense
            label="Цена"
          ></v-text-field>

          <DatePicker
            class="mb-4"
            color="white"
            hide-details
            v-model="date"
            dense
            label="Дата записи"
            outlined
            background-color="white"
            ref="date_picker"
          />

          <v-time-picker
            v-model="time"
            class="mt-4"
            format="24hr"
            color="#a60dbf"
          ></v-time-picker>

          <v-btn
            outlined
            color="info"
            :disabled="!isValid"
            type="submit"
            class="mr-4"
            >Добавить</v-btn
          >

          <v-btn outlined color="error" @click="closeAndClear">Отмена</v-btn>
        </v-form>
      </v-card>
    </v-dialog>

    <v-dialog width="500px" v-model="addRecordDialog">
      <v-card class="pa-4">
        <v-card-title> Добавление услугу </v-card-title>
        <v-form v-model="isValid" @submit.prevent="addRecord">
          <v-autocomplete
            background-color="white"
            v-model="service_selected"
            :items="services"
            item-text="name"
            item-value="id"
            dense
            outlined
            label="Услуга"
            clearable
            no-data-text="Нет доступных данных"
          />

          <v-autocomplete
            background-color="white"
            v-model="client_selected"
            :items="clients"
            item-text="name"
            item-value="id"
            dense
            outlined
            label="Клиент"
            clearable
            no-data-text="Нет доступных данных"
          />

          <v-text-field
            outlined
            dense
            v-model="duration"
            type="time"
            label="Длительность"
            :rules="[(v) => !!v || 'Обязательное поле']"
          ></v-text-field>

          <v-text-field
            type="number"
            v-model="cost"
            outlined
            dense
            label="Цена"
          ></v-text-field>

          <div>
            <DatePicker
              class="mb-4"
              color="white"
              hide-details
              v-model="date"
              dense
              label="Дата записи"
              outlined
              background-color="white"
            />
          </div>

          <div class="d-flex justify-center">
            <v-time-picker
              v-model="time"
              class="mt-4"
              format="24hr"
              color="#a60dbf"
            ></v-time-picker>
          </div>

          <v-btn
            outlined
            color="info"
            :disabled="!isValid"
            type="submit"
            class="mr-4"
            >Добавить</v-btn
          >

          <v-btn outlined color="error">Отмена</v-btn>
        </v-form>
      </v-card>
    </v-dialog>

    <v-row class="fill-height" justify="end">
      <v-col>
        <v-sheet class="calendar">
          <v-calendar
            ref="calendar"
            v-model="focus"
            color="primary"
            type="day"
            category-show-all
            :events="events"
            locale="ru"
            @click:event="eventClicked"
          >
            <template slot="day-header">
              <v-row justify="end">
                <div class="add-records">
                  <v-btn icon @click="openAddRecordDialog">
                    <v-icon style="color: white"> mdi-plus </v-icon>
                  </v-btn>
                </div>
              </v-row>
            </template>

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
                    <v-spacer></v-spacer>
                  </v-toolbar>
                </v-sheet>
              </div>
            </template>

            <template v-slot:event="{ event }">
              <div class="wrapper-event-title">
                <v-menu open-on-hover top offset-x>
                  <template v-slot:activator="{ on, attrs }">
                    <span v-bind="attrs" v-on="on" class="event-title">
                      Услуга : {{ event.name
                      }}<v-icon small>mdi-help-circle</v-icon>
                    </span>
                  </template>

                  <v-card max-width="200" min-width="200" elevation="0">
                    <v-img
                      class="event-img"
                      :src="event.img"
                      height="105"
                      width="85"
                    ></v-img>
                    <v-card-title>
                      <p>{{ event.name }}</p>
                    </v-card-title>
                    <v-card-subtitle>
                      <p>{{ event.description }}</p>
                    </v-card-subtitle>
                    <v-card-text>
                      <p class="cost-title">Цена :{{ event.cost }} &#8381;</p>
                      <p class="duration-title">
                        Время : {{ event.duration }}
                        <v-icon small>mdi-clock</v-icon>
                      </p>
                    </v-card-text>
                  </v-card>
                </v-menu>
              </div>
            </template>
          </v-calendar>
        </v-sheet>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import DatePicker from "../../components/inputs/DatePicker";
import axiosInstance from "../../plugins/axios";
import Vue from "vue";
export default {
  components: { DatePicker },

  data: () => ({
    addRecordDialog: false,
    dialogEventInfo: false,

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

    isValid: false,

    clients: [],
    services: [],

    cost: null,
    duration: null,
    client_selected: null,
    service_selected: null,
    date: null,
    time: null,
  }),

  methods: {
    closeAndClear() {
      this.cost = null;
      this.duration = null;
      this.client_selected = null;
      this.service_selected = null;
      this.time = null;
      this.$refs.date_picker.clear()
      this.dialogEventInfo = false;
    },

    eventClicked({ event }) {
      this.dialogEventInfo = true;
      this.cost = event.cost;
      this.duration = event.duration;
      this.client_selected = event.client;
      this.service_selected = event.service;
      this.time = event.startTime;
      Vue.nextTick(() => this.$refs.date_picker.setNewValue(event.startDate));
    },

    async addRecord() {
      let paramas = {
        service: this.service_selected,
        client: this.client_selected,
        cost: this.cost,
        duration: this.duration,
        recording_time: this.dateWithTime,
      };

      let data = await axiosInstance.post("records/", paramas);
      console.log(data);
    },

    openAddRecordDialog() {
      this.addRecordDialog = true;
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
        let startTime = this.parseTime(record.recording_time);
        let startDate = this.parseStartDate(record.recording_time);
        array.push({
          client: record.client,
          service: record.service,
          img: data.img,
          description: data.description,
          duration: record.duration,
          cost: record.cost,
          name: data.name,
          start: recording_time,
          end: end_time,
          startTime: startTime,
          startDate: startDate,
          color: record.color ? record.color : "#e796f5",
          timed: [],
        });
      }
      this.events = array;
    },

    async getService(service) {
      let { data } = await axiosInstance.get(
        `services/services/${service.service}/`
      );
      return data.name;
    },

    parseStartDate(date) {
      let currentDate = date.split(".");
      let day = currentDate[0];
      let month = currentDate[1];
      let year = currentDate[2].split(" ")[0];
      return `${year}-${month}-${day}`;
    },

    parseTime(date) {
      let currentDate = date.split(".");
      let hour = currentDate[2].split(" ")[1].split(":")[0];
      let minute = currentDate[2].split(" ")[1].split(":")[1];
      return `${hour}:${minute}`;
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

  computed: {
    dateWithTime() {
      return `${this.date} ${this.time}`;
    },

    currentDay() {
      let currentDay = this.focus.split("-")[2];
      if (currentDay[0] == 0) {
        return currentDay[1];
      } else {
        return currentDay;
      }
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
          description: i.description,
          duration: i.duration,
          cost: i.cost,
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


  async mounted() {
    let date = new Date();
    this.focus = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;

    await this.fetchData();

    let clients = await axiosInstance.get("clients/contacts/opt");
    this.clients = clients.data;

    let services = await axiosInstance.get("services/services/opt");
    this.services = services.data;
  },
};
</script>

<style scoped>
.v-application p {
  margin-bottom: 0px !important;
}

.add-records {
  color: black;
  display: inline;
  margin-bottom: 20px;
  margin-right: 20px;
  background-color: #a60dbf;
  border-radius: 50%;
  color: white !important;
}

.v-calendar-daily {
  border: 2px solid #a60dbf;
}

.duration-title {
  font-weight: bold;
  display: flex;
}

.cost-title {
  font-weight: bold;
}

.event-img {
  margin-left: 20px;
  margin-top: 5px;
  border-radius: 15px;
}

.event-title {
  color: black;
  margin-left: 10px;
}

.wrapper-event-title {
  display: flex;
  justify-content: space-between;
  align-content: center;
}

.calendar {
  position: relative;
  margin-left: 100px;
  height: 90vh;
  width: 80%;
}

.calendar-header {
  position: relative;
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
