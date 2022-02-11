<template>
  <div>
    <v-dialog v-model="deleteClientDialog" width="500px">
      <v-card>
        <v-card-title> Вы уверены, что хотите удалить клиента? </v-card-title>

        <v-card-actions>
          <v-btn outlined @click="DeleteClient" color="success">Да</v-btn>
          <v-btn outlined @click="clearAndClose" color="error">Нет</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div>
      <v-container>
        <v-row justify="center">
          <v-text-field
            v-debounce:1000ms="searchClient"
            v-model="search"
            class="searchInput"
            label="Поиск"
          ></v-text-field>
        </v-row>
        <v-row>
          <v-col
            xs="12"
            sm="6"
            md="3"
            v-for="(client, index) in blacklist"
            :key="index"
          >
            <v-card
              class="mx-auto card-body"
              min-height="200"
              max-width="500"
              elevation="0"
            >
              <v-card-title class="d-flex justify-space-between align-center">
                <span>{{ client.name }}</span>
              </v-card-title>

              <v-card-subtitle>
                <v-icon> mdi-phone</v-icon>
                {{ client.phone }}
              </v-card-subtitle>
              <p class="comment">{{ client.comment }}</p>
              <div class="blacklist" v-if="client.blacklist">
                <v-menu open-on-hover top offset-x>
                  <template v-slot:activator="{ on, attrs }">
                    <span v-bind="attrs" v-on="on"
                      >В чёрном списке<v-icon style="margin-bottom: 3px" small
                        >mdi-help-circle</v-icon
                      ></span
                    >
                  </template>

                  <v-card min-height="100" min-width="250" elevation="0">
                    <v-card-title>
                      <p>Комментарий</p>
                    </v-card-title>

                    <v-card-subtitle>
                      {{ client.blacklist_comment }}
                    </v-card-subtitle>
                    <v-card-actions>
                      <v-btn outlined color="info" @click="unBan(client)"
                        >Разбанить</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-menu>
              </div>

              <div class="actions">

                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" v-on="on" icon>
                      <v-icon @click="onDeleteClient(client)"
                        >mdi-delete-outline</v-icon
                      >
                    </v-btn>
                  </template>
                  <span>Удалить</span>
                </v-tooltip>

              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
import axiosInstance from "../../plugins/axios";
export default {
  name: "BlackList",

  data() {
    return {
      search: "",
      deleteClientDialog : false,

      blacklist: [],
      currentClient : {}
    };
  },

  methods: {

    clearAndClose() {
      this.currentClient = {};
      this.deleteClientDialog = false;
    },

    async DeleteClient() {
      await axiosInstance.delete(`clients/contacts/${this.currentClient.id}/`);
      this.clearAndClose();
      await this.fetchBlackList();
    },

    async onDeleteClient(client) {
      this.currentClient = client;
      this.deleteClientDialog = true;
    },

    async unBan(client) {
      await axiosInstance.post(`clients/contacts/bl/`, {
        client: client.id,
        blacklist: false,
      });
      await this.fetchBlackList();
    },

    async searchClient() {
      let { data } = await axiosInstance.get(
        `clients/contacts/?search=${this.search}&blacklist=1`
      );
      this.blacklist = data.results;
    },

    async fetchBlackList(){
      let { data } = await axiosInstance.get(`clients/contacts/?blacklist=1&search=${this.search}`);
      this.blacklist = data.results;
    }

  },

  async mounted() {
    let { data } = await axiosInstance.get("clients/contacts/?blacklist=1");
    this.blacklist = data.results;
  },
};
</script>

<style scoped>
.searchInput {
  max-width: 300px !important;
}

.comment {
  font-size: 14px;
}

.actions {
  position: absolute;
  top: 0px;
  right: 5px;
}

.price {
  position: absolute;
  bottom: 10px;
  left: 10px;
}

.empty-card {
  height: 200px;
  /*width: 400px;*/
  border: 1px solid #7b7b7b;
  border-radius: 25px;
  display: flex;
  justify-content: center;
  align-content: center;
}

.empty-card:hover {
  cursor: pointer;
}

.card-body {
  padding: 10px !important;
  border: 2px solid #a60dbf !important;
}

.blacklist {
  background-color: red;
  display: flex;
  justify-content: center;
  border-radius: 25px;
  position: absolute;
  bottom: 10px;
  padding-left: 5px;
  padding-right: 5px;
}

.wrapper-watch {
  display: flex;
}
</style>
