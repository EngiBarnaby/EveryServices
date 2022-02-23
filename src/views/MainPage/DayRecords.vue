<template>
  <div v-if="!isFetching">
    <v-dialog
      v-model="dialogEventInfo"
      width="600"
      @click:outside="closeAndClear"
    >
      <v-card class="pa-4">
        <v-card-title>Изменение записи</v-card-title>
        <v-form v-model="isValid" @submit.prevent="changeRecord">
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
            :rules="[((v) => !!v || 'Обязательное поле') && ((v) => v < 100000 && v > 0 || 'Стоимость услуги должна быть меньше 100 000 руб. и больше 0 руб.')]"
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

          <v-text-field
            outlined
            dense
            v-model="time"
            type="time"
            label="Время"
            :rules="[(v) => !!v || 'Обязательное поле']"
          ></v-text-field>

          <v-btn
            color="success"
            @click="provideRecord"
            v-if="!provided"
            class="mr-4"
            outlined
          >
            Завершить
          </v-btn>

          <v-btn
            outlined
            color="info"
            :disabled="!isValid"
            type="submit"
            class="mr-4"
            >Изменить</v-btn
          >

          <v-btn outlined color="error" @click="refuseRecord"
            >Отменить запись</v-btn
          >
        </v-form>
      </v-card>
    </v-dialog>

    <v-dialog
      width="500px"
      v-model="addRecordDialog"
      @click:outside="closeAndClear"
    >
      <v-card class="pa-4">
        <v-card-title> Добавление записи </v-card-title>
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
            :rules="[((v) => !!v || 'Обязательное поле') && ((v) => v < 100000 && v > 0 || 'Стоимость услуги должна быть меньше 100 000 руб. и больше 0 руб.')]"
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

          <v-text-field
            outlined
            dense
            v-model="time"
            type="time"
            label="Время"
            :rules="[(v) => !!v || 'Обязательное поле']"
          ></v-text-field>

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

    <v-dialog v-model="UnconfirmedRecordsDialog" width="750">
      <UnconfirmedListOfRecords />
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
                <div class="unconfirmed">
                  <v-tooltip bottom v-if="countUnconfirmedRecords">
                    <template v-slot:activator="{ on, attrs }">
                      <v-badge
                        color="red"
                        overlap
                        left
                        :content="countUnconfirmedRecords"
                      >
                        <v-btn
                          v-bind="attrs"
                          v-on="on"
                          icon
                          @click="UnconfirmedRecordsDialog = true"
                        >
                          <v-icon style="color: white">
                            mdi-exclamation-thick
                          </v-icon>
                        </v-btn>
                      </v-badge>
                    </template>
                    <span>Неподтвержденный записи</span>
                  </v-tooltip>
                  <v-tooltip bottom v-else>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        v-bind="attrs"
                        v-on="on"
                        icon
                        @click="UnconfirmedRecordsDialog = true"
                      >
                        <v-icon style="color: white">
                          mdi-exclamation-thick
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Неподтвержденный записи</span>
                  </v-tooltip>
                </div>

                <div class="add-records">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        v-bind="attrs"
                        v-on="on"
                        icon
                        @click="openAddRecordDialog"
                      >
                        <v-icon style="color: white"> mdi-plus </v-icon>
                      </v-btn>
                    </template>
                    <span>Добавить запись</span>
                  </v-tooltip>
                </div>
              </v-row>
            </template>

            <template slot="day-label-header">
              <div class="calendar-header">
                <v-sheet height="64">
                  <v-toolbar flat>
                    <div v-for="day in lastFiveDays" :key="day.date">
                      <p>{{ day.dayTitle }}</p>
                      <div class="day" @click="changeDate(day.date)">
                        {{ day.day }}
                      </div>
                    </div>

                    <v-btn fab text small color="grey darken-2" @click="prev">
                      <v-icon small> mdi-chevron-left </v-icon>
                    </v-btn>

                    <div class="current-date">
                      {{ currentDay }}
                    </div>

                    <v-btn fab text small color="grey darken-2" @click="next">
                      <v-icon small> mdi-chevron-right </v-icon>
                    </v-btn>

                    <div v-for="day in nextFiveDays" :key="day.date">
                      <p>{{ day.dayTitle }}</p>
                      <div class="day" @click="changeDate(day.date)">
                        {{ day.day }}
                      </div>
                    </div>

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
                      Услуга : {{ event.name }}. Клиент {{ event.clientName }}
                      <v-icon v-if="event.name != 'Удалена'" small
                        >mdi-help-circle</v-icon
                      >
                    </span>
                  </template>

                  <v-card
                    v-if="event.name != 'Удалена'"
                    max-width="300"
                    min-width="200"
                    elevation="0"
                  >
                    <v-card-title>
                      <p>{{ event.name }}</p>
                    </v-card-title>
                    <v-card-subtitle>
                      <div
                        style="display: flex; justify-content: space-between"
                      >
                        <p>{{ event.description }}</p>

                        <v-img class="event-img" :src="event.img"></v-img>
                      </div>
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

    <v-snackbar
      v-model="snackbarSuccess"
      timeout="4000"
      color="success"
      outlined
    >
      {{ snackbarTextSuccess }}
    </v-snackbar>

    <v-snackbar v-model="snackbarError" timeout="4000" color="error" outlined>
      {{ snackbarTextError }}
    </v-snackbar>
  </div>
</template>

<script>
import DatePicker from "../../components/inputs/DatePicker";
import axiosInstance from "../../plugins/axios";
import Vue from "vue";
import UnconfirmedListOfRecords from "@/views/MainPage/UnconfirmedListOfRecords";
export default {
  components: { DatePicker, UnconfirmedListOfRecords },

  data: () => ({
    isFetching: true,

    addRecordDialog: false,
    dialogEventInfo: false,
    UnconfirmedRecordsDialog: false,

    snackbarError: false,
    snackbarTextError: null,

    snackbarSuccess: false,
    snackbarTextSuccess: null,

    focus: "",
    events: [],

    isValid: false,

    clients: [],
    services: [],

    cost: null,
    duration: null,
    client_selected: null,
    service_selected: null,
    date: null,
    time: null,
    id: null,
    provided: null,

    countUnconfirmedRecords: 0,
  }),

  methods: {
    //CRUD//

    changeDate(date) {
      this.focus = date;
    },

    async changeRecord() {
      let data = null;
      let params = {
        service: this.service_selected,
        client: this.client_selected,
        cost: this.cost,
        duration: this.duration,
        recording_time: this.dateWithTime,
      };
      await axiosInstance
        .put(`records/${this.id}/`, params)
        .then((res) => {
          if (res.status === 200) {
            data = res.data;
          }

          if (res.response.status === 400) {
            this.snackbarTextError = res.response.data.detail;
            this.snackbarError = true;
          }
        })
        .catch((error) => {
          console.log(error);
        });

      this.events = this.events.filter((el) => el.id !== data.id);

      let service = await axiosInstance.get(
        `services/services/${data.service}/`
      );
      let end_time = this.parseDate(data.end_time);
      let recording_time = this.parseDate(data.recording_time);
      let startTime = this.parseTime(data.recording_time);
      let startDate = this.parseStartDate(data.recording_time);
      let clientName = this.clients.filter((el) => el.id === data.client)[0]
        .name;
      let event = {
        id: data.id,
        client: data.client,
        service: data.service,
        img: service.data.img,
        description: service.data.description,
        duration: data.duration,
        cost: data.cost,
        name: service.data.name,
        start: recording_time,
        end: end_time,
        startTime: startTime,
        startDate: startDate,
        clientName: clientName,
        color: data.color ? data.color : "#e796f5",
        timed: [],
      };

      this.events.push(event);
      this.closeAndClear();
    },

    async addRecord() {
      let data = null;
      let params = {
        service: this.service_selected,
        client: this.client_selected,
        cost: this.cost,
        duration: this.duration,
        recording_time: this.dateWithTime,
      };

      await axiosInstance
        .post("records/", params)
        .then((res) => {
          if (res.status === 201) {
            data = res.data;
          }

          if (res.response.status === 400) {
            this.snackbarTextError = res.response.data.detail;
            this.snackbarError = true;
          }
        })
        .catch((error) => {
          console.log(error);
        });

      let service = await axiosInstance.get(
        `services/services/${data.service}/`
      );

      let end_time = this.parseDate(data.end_time);
      let recording_time = this.parseDate(data.recording_time);
      let startTime = this.parseTime(data.recording_time);
      let startDate = this.parseStartDate(data.recording_time);
      let clientName = this.clients.filter((el) => el.id === data.client)[0]
        .name;
      let event = {
        id: data.id,
        client: data.client,
        service: data.service,
        img: service.data.img,
        description: service.data.description,
        duration: data.duration,
        cost: data.cost,
        name: service.data.name,
        start: recording_time,
        end: end_time,
        startTime: startTime,
        startDate: startDate,
        color: data.color ? data.color : "#e796f5",
        clientName: clientName,
        timed: [],
      };
      this.events.push(event);

      this.closeAndClear();
      this.addRecordDialog = false;
    },

    async refuseRecord() {
      await axiosInstance.delete(`records/${this.id}`);
      this.events = this.events.filter((el) => el.id !== this.id);
      // await this.fetchEvents();
      this.closeAndClear();
    },

    async fetchData() {
      let date = new Date();
      date = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
      try {
        let { data } = await axiosInstance.get(
          `records/?date=${date}&confirmed=1`
        );
        this.parseRecords(data.results);
      } catch (e) {
        console.log(e);
      }
    },

    async fetchEvents() {
      try {
        let { data } = await axiosInstance.get(`records/?date=${this.parsDay}`);
        this.parseRecords(data.results);
      } catch (e) {
        console.log(e);
      }
    },

    async provideRecord() {
      let { data } = await axiosInstance.post(`records/provide/${this.id}/`);
      this.snackbarTextSuccess = data.detail;
      this.snackbarSuccess = true;
      await this.fetchEvents();
      this.closeAndClear();
    },

    getUnconfirmedRecordsCount() {
      setInterval(() => {
        axiosInstance
          .get("records/?count&confirmed=0&canceled=0")
          .then((res) => {
            this.countUnconfirmedRecords = res.data.count;
          });
      }, 5000);
    },

    closeAndClear() {
      this.cost = null;
      this.duration = null;
      this.client_selected = null;
      this.service_selected = null;
      this.time = null;
      this.id = null;
      this.provided = null;
      this.dialogEventInfo = false;
    },

    eventClicked({ event }) {
      console.log(event);
      this.dialogEventInfo = true;
      this.provided = event.provided;
      this.cost = event.cost;
      this.duration = event.duration;
      this.client_selected = event.client;
      this.service_selected = event.service;
      this.time = event.startTime;
      this.id = event.id;
      Vue.nextTick(() => this.$refs.date_picker.setNewValue(event.startDate));
    },

    openAddRecordDialog() {
      this.addRecordDialog = true;
      Vue.nextTick(() => this.$refs.date_picker.setNewValue(this.focus));
    },

    prev() {
      this.$refs.calendar.prev();
      this.fetchEvents();
    },
    next() {
      this.$refs.calendar.next();
      this.fetchEvents();
    },

    async parseRecords(data) {
      let array = [];
      for (let record of data) {
        if (record.service) {
          let { data } = await axiosInstance.get(
            `services/services/${record.service}/`
          );
          let end_time = this.parseDate(record.end_time);
          let recording_time = this.parseDate(record.recording_time);
          let startTime = this.parseTime(record.recording_time);
          let startDate = this.parseStartDate(record.recording_time);

          let clientName = record.client
            ? this.clients.filter((el) => el.id === record.client)[0].name
            : ": Удалён";
          array.push({
            provided: record.provided,
            id: record.id,
            client: record.client,
            service: record.service,
            img: data.img,
            name: data.name,
            description: data.description,
            duration: record.duration,
            cost: record.cost,
            start: recording_time,
            end: end_time,
            startTime: startTime,
            startDate: startDate,
            color: record.color ? record.color : "#e796f5",
            clientName: clientName,
            timed: [],
          });
        } else {
          let end_time = this.parseDate(record.end_time);
          let recording_time = this.parseDate(record.recording_time);
          let startTime = this.parseTime(record.recording_time);
          let startDate = this.parseStartDate(record.recording_time);
          let clientName = record.client
            ? this.clients.filter((el) => el.id === record.client)[0].name
            : ": Клиент удалён";
          array.push({
            provided: record.provided,
            id: record.id,
            client: record.client,
            service: record.service,
            name: "Удалена",
            description: data.description,
            duration: record.duration,
            cost: record.cost,
            start: recording_time,
            end: end_time,
            startTime: startTime,
            startDate: startDate,
            color: record.color ? record.color : "#e796f5",
            clientName: clientName,
            timed: [],
          });
        }
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
    lastFiveDays() {
      let lastFiveDay = [];
      let currentDay = this.focus.split("-");

      let date = new Date(currentDay[0], +currentDay[1] - 1, currentDay[2]);

      for (let i = 0; i < 5; i++) {
        let day = new Date(date.setDate(date.getDate() - 1));
        let dateTitle = day.toLocaleDateString("ru-RU", { weekday: "long" });
        switch (dateTitle) {
          case "понедельник":
            dateTitle = "пн";
            break;
          case "вторник":
            dateTitle = "вт";
            break;
          case "среда":
            dateTitle = "ср";
            break;
          case "четверг":
            dateTitle = "чт";
            break;
          case "пятница":
            dateTitle = "пт";
            break;
          case "суббота":
            dateTitle = "сб";
            break;
          case "воскресенье":
            dateTitle = "пн";
            break;
        }
        lastFiveDay.unshift({
          day: day.getDate(),
          dayTitle: dateTitle,
          date: `${day.getFullYear()}-${day.getMonth() + 1}-${day.getDate()}`,
        });
      }
      return lastFiveDay;
    },

    nextFiveDays() {
      let lastFiveDay = [];
      let currentDay = this.focus.split("-");

      let date = new Date(currentDay[0], +currentDay[1] - 1, currentDay[2]);

      for (let i = 0; i < 5; i++) {
        let day = new Date(date.setDate(date.getDate() + 1));
        let dateTitle = day.toLocaleDateString("ru-RU", { weekday: "long" });
        switch (dateTitle) {
          case "понедельник":
            dateTitle = "пн";
            break;
          case "вторник":
            dateTitle = "вт";
            break;
          case "среда":
            dateTitle = "ср";
            break;
          case "четверг":
            dateTitle = "чт";
            break;
          case "пятница":
            dateTitle = "пт";
            break;
          case "суббота":
            dateTitle = "сб";
            break;
          case "воскресенье":
            dateTitle = "пн";
            break;
        }
        lastFiveDay.push({
          day: day.getDate(),
          dayTitle: dateTitle,
          date: `${day.getFullYear()}-${day.getMonth() + 1}-${day.getDate()}`,
        });
      }
      return lastFiveDay;
    },

    currentDay() {
      let currentDay = this.focus.split("-")[2];
      if (currentDay[0] == 0) {
        return currentDay[1];
      } else {
        return currentDay;
      }
    },

    dateWithTime() {
      return `${this.date} ${this.time}`;
    },

    parsDay() {
      let date = this.focus.split("-");
      date = `${date[2]}.${date[1]}.${date[0]}`;
      return date;
    },
  },

  watch: {
    focus() {
      console.log(this.focus)
      this.fetchEvents();
    },
  },

  async mounted() {
    this.isFetching = false;

    axiosInstance.get("records/?count&confirmed=0&canceled=0").then((res) => {
      this.countUnconfirmedRecords = res.data.count;
    });

    this.getUnconfirmedRecordsCount();

    let date = new Date();
    this.focus = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;

    let clients = await axiosInstance.get("clients/contacts/?paging=0");
    this.clients = clients.data.results;

    let services = await axiosInstance.get("services/services/opt");
    this.services = services.data;

    await this.fetchData();

    this.$refs.calendar.scrollToTime("09:00");
  },
};
</script>

<style scoped>
.day {
  margin-bottom: 23px;
  margin-right: 5px;
  margin-left: 5px;
  display: flex;
  justify-content: center;
  align-content: center;
  color: black;
  padding: 15px;
  border-radius: 50%;
  border: 1px solid #a60dbf;
  min-height: 50px;
  min-width: 50px;
  max-height: 50px;
  max-width: 50px;
}

.v-application p {
  margin-bottom: 0px !important;
}

.unconfirmed {
  display: inline;
  margin-bottom: 20px;
  margin-right: 5px;
  background-color: #a60dbf;
  border-radius: 50%;
  color: white !important;
}

.add-records {
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
  max-height: 105px !important;
  max-width: 85px !important;
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
