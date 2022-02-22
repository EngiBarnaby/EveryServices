<template>
  <div v-if="!isFetching">
    <v-row justify="center" class="mb-4">
      <h3>{{getClientsName()}}</h3>
    </v-row>
    <div v-for="(record, index) in history" :key="index">
      <div class="record">
        <div class="record-info">

          <div class="service">
            Услуга: {{ getServiceName(record.service) }}. Длительность:
            {{ getServiceDuration(record.service) }}
          </div>

          <div class="date">Время: {{ record.recording_time }}</div>

        </div>
        <div class="description">
          <div v-if="record.provided">
            <p class="green--text content">Завершена</p>
          </div>
          <div v-else>
            <p class="red--text content">Не завершена</p>
          </div>
          <div v-if="record.canceled">
            <p class="red--text content">Отменена</p>
          </div>
          <div v-if="record.cancellation_reason">
            Причина отмены: {{record.cancellation_reason}}
          </div>
        </div>
      </div>
      <v-divider></v-divider>
    </div>
  </div>
</template>

<script>
import axiosInstance from "@/plugins/axios";

export default {
  name: "history",
  props: ["client"],

  data() {
    return {
      history: [],
      isFetching: true,
      services: [],
      clients: [],
    };
  },

  methods: {


    getClientsName(){
      let client = this.clients.filter((el) => el.id === this.client.id)[0]
      return client.name ? client.name : ""
    },

    getServiceName(id) {
      if (id) {
        let service = this.services.filter((el) => el.id === id)[0];
        return service.name ? service.name : "";
      } else {
        return "";
      }
    },

    getServiceDuration(id) {
      if (id) {
        let service = this.services.filter((el) => el.id === id)[0];
        return service.duration ? service.duration : "";
      } else {
        return "";
      }
    },
  },

  async mounted() {
    console.log("It's work")
    let services = await axiosInstance.get("services/services/?paging=0");
    this.services = services.data.results;

    let clients = await axiosInstance.get("clients/contacts/?paging=0");
    this.clients = clients.data.results;

    let { data } = await axiosInstance.get(
      `records/?client=${this.client.id}&paging=0`
    );
    this.history = data.results;
    this.isFetching = false;
  },
};
</script>

<style scoped>


.content {
  display: flex;
  justify-content: end;
}

.record {
  display: flex;
  justify-content: space-between;
}
</style>
