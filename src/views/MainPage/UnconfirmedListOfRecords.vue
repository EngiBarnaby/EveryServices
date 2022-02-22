<template>
  <div v-if="!isFetching">
    <v-dialog width="400" v-model="cancelRecordDialog" @click:outside="closeCancelRecordDialog">
      <v-card class="pa-4">
        <v-catd-title><h2>Отмена заявки</h2></v-catd-title>
        <v-textarea
          v-model="cancellation_reason"
          label="Причина отмены(необязательно)"
          outlined
        >
        </v-textarea>
        <v-card-actions>
          <v-btn color="info" outlined @click="cancelRecord">Отменить заявку</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div class="wrapper pa-4">
      <v-row justify="center" class="mb-4">
        <h2>Неподтвержденный записи</h2>
      </v-row>

      <div v-for="(record, index) in unconfirmedRecords" :key="index">
        <div class="record">
          <div class="record-info">
            <div class="client">
              Имя: {{ getClientsName(record.client)}}. Тел.:
              {{ getClientsPhone(record.client) }}
            </div>

            <div class="service">
              Услуга: {{ getServiceName(record.service) }}. Длительность:
              {{ getServiceDuration(record.service) }}
            </div>

            <div class="date">Время: {{ record.recording_time }}</div>
          </div>

          <div class="records-btn">
            <div>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    v-bind="attrs"
                    @click="onCancelRecord(record)"
                    v-on="on"
                    class="disapprove-btn"
                  >
                    mdi-close-circle
                  </v-icon>
                </template>
                <span>Отменить</span>
              </v-tooltip>
            </div>
            <div>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    v-bind="attrs"
                    v-on="on"
                    @click="confirmRecord(record)"
                    class="approve-btn"
                  >
                    mdi-checkbox-marked-circle
                  </v-icon>
                </template>
                <span>Потвердить</span>
              </v-tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axiosInstance from "@/plugins/axios";
export default {
  name: "UnconfirmedListOfRecords",

  data() {
    return {
      isFetching: true,

      cancelRecordDialog : false,

      unconfirmedRecords: [],
      services: [],
      clients: [],

      currentRecord : {},
      cancellation_reason: "",
    };
  },

  methods: {

    closeCancelRecordDialog(){
      this.currentRecord = {}
      this.cancellation_reason = ""
      this.cancelRecordDialog = false
    },

    onCancelRecord(record){
      this.currentRecord = record
      this.cancelRecordDialog = true
    },

    async fetchRecords() {
      let { data } = await axiosInstance.get(`records/?confirmed=0&paging=0&canceled=0`);
      this.unconfirmedRecords = data.results;
    },


    async cancelRecord() {
      await axiosInstance.post(`records/cancel/${this.currentRecord.id}/`, {
        cancellation_reason: this.cancellation_reason,
      });
      this.closeCancelRecordDialog()
      await this.fetchRecords();
    },

    async confirmRecord(record) {
      await axiosInstance.post(`records/confirm/${record.id}/`);
      await this.fetchRecords();
    },

    getClientsPhone(id){
      let client = this.clients.filter((el) => el.id === id)[0]
      return client.phone ? client.phone : ""
    },

    getClientsName(id){
      let client = this.clients.filter((el) => el.id === id)[0]
      return client.name ? client.name : ""
    },

    getServiceName(id) {
      let service = this.services.filter((el) => el.id === id)[0]
      return service.name ? service.name : ""
    },

    getServiceDuration(id) {
      let service = this.services.filter((el) => el.id === id)[0]
      return service.duration ? service.duration : ""
    },

  },

  async mounted() {
    await this.fetchRecords();

    let services = await axiosInstance.get("services/services/?paging=0");
    this.services = services.data.results;

    let clients = await axiosInstance.get("clients/contacts/?paging=0");
    this.clients = clients.data.results;

    this.isFetching = false;
  },
};
</script>

<style scoped>
.records-btn {
  display: flex;
}

.approve-btn:hover {
  cursor: pointer;
}

.disapprove-btn {
  color: #f86363;
  font-size: 50px;
}
.approve-btn {
  color: #4efc4e;
  font-size: 50px;
}

.record {
  display: flex;
  padding: 10px;
  border: 2px solid #a60dbf;
  margin-bottom: 10px;
  border-radius: 10px;
  justify-content: space-between;
  align-items: center;
}

.wrapper {
  background-color: white;
}
</style>
