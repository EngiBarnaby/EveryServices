<template>
  <div>
    <date-picker
      aria-placeholder="Test"
      class="startDate"
      format="DD.MM.YYYY"
      value-type="format"
      @input="changeValue"
      v-model="date"
      :placeholder="label"
      :disabled="readonly"
    ></date-picker>
  </div>
</template>

<script>
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import "vue2-datepicker/locale/ru";

export default {
  name: "CustomDatePicker2",
  components: { DatePicker },
  props: ["value", "label", "readonly"],

  data() {
    return {
      date: "",
    };
  },

  methods: {
    changeValue() {
      this.$emit("input", this.date);
      this.$emit("change", this.date);
    },

    logInfo(){
      console.log("It's work")
    },

    clear() {
      this.date = "";
    },

    parseNewValue(date) {
      this.date = date;
    },
  },

  mounted() {
    this.date = this.value;
  },
};
</script>

<style scoped>
.startDate {
  width: 100% !important;
}
</style>
