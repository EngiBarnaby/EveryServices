<template>
  <div>
    <v-row>
      <v-col>
        <v-sheet height="64">
          <v-toolbar flat>
            <v-btn
              fab
              text
              small
              color="grey darken-2"
              @click="$refs.calendar.prev()"
            >
              <v-icon small> mdi-chevron-left </v-icon>
            </v-btn>
            <v-btn
              fab
              text
              small
              color="grey darken-2"
              @click="$refs.calendar.next()"
            >
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
            v-model="value"
            locale="ru"
            type="week"
            :events="events"
            :event-overlap-mode="mode"
            :event-overlap-threshold="30"
            :event-color="getEventColor"
            @change="getEvents"
            :weekdays="weekView"
          ></v-calendar>
        </v-sheet>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "WeekRecords",

  data() {
    return {
      value: "",
      today: "",
      weekView: this.weekdays
        ? this.weekdays.split(".")
        : [1, 2, 3, 4, 5, 6, 0],
    };
  },

  mounted() {
    let date = new Date();
    this.value = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;
    this.$refs.calendar.checkChange();
  },
};
</script>

<style scoped>
.calendar {
  height: 90vh;
}
</style>
