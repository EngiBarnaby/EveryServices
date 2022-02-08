<template>
  <div class="datePicker">
    <v-menu
      ref="menu1"
      v-model="menu1"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      max-width="290px"
      min-width="auto"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-model="dateFormatted"
          :label="label"
          outlined
          clearable
          dense
          hide-details
          persistent-hint
          :rules="rules"
          placeholder="Дата"
          v-bind="attrs"
          @blur="date = parseDate(dateFormatted)"
          v-on="on"
        ></v-text-field>
      </template>
      <v-date-picker
        locale="ru-RU"
        :readonly="readonly"
        :label="label"
        v-model="date"
        no-title
        @input="menu1 = false"
        :first-day-of-week="1"
      ></v-date-picker>
    </v-menu>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number],
    },
    label: {
      type: String,
    },
    readonly: {
      type: Boolean,
      default: false,
    },

    required: {
      type: Boolean,
      default: false,
    },

    rules: {
      type: [Array, String],
    },
  },
  data: () => ({
    date: "",
    dateFormatted: "",
    menu1: false,
    menu2: false,
  }),

  computed: {
    computedDateFormatted() {
      return this.formatDate(this.date);
    },
  },

  watch: {
    date() {
      this.dateFormatted = this.formatDate(this.date);
      this.$emit("input", this.dateFormatted);
    },
  },

  methods: {

    setNewValue(date){
      this.date = date
    },

    changeValue() {
      this.$emit("input", this.date);
      this.$emit("change", this.date);
    },

    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${day}.${month}.${year}`;
    },
    parseDate(date) {
      if (!date) return null;

      const [day, month, year] = date.split(".");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },

    clear() {
      this.date = "";
    },
  },

  mounted() {
    this.date = this.parseDate(this.value);
  },
};
</script>

<style scoped>
.datePicker {
  background-color: white !important;
  border-radius: 10px;
}
</style>
