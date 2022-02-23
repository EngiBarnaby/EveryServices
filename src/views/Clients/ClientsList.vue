<template>
  <div>
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

      <v-dialog
        v-model="editClientDialog"
        width="500px"
        @click:outside="clearAndClose"
      >
        <v-card class="pa-4">
          <v-card-title>Изменение информации</v-card-title>
          <v-form v-model="isValid" @submit.prevent="editClient">
            <v-text-field
              outlined
              dense
              v-model="currentClient.name"
              :rules="[(v) => !!v || 'Обязательное поле']"
              label="Имя"
            ></v-text-field>

            <v-text-field
              outlined
              dense
              v-model="currentClient.phone"
              :rules="[(v) => !!v || 'Обязательное поле']"
              label="Телефон"
            ></v-text-field>

            <v-text-field
              outlined
              dense
              v-model="currentClient.email"
              label="email"
            ></v-text-field>

            <v-textarea
              outlined
              v-model="currentClient.comment"
              label="Комментарий"
            ></v-textarea>

            <v-btn
              outlined
              color="info"
              :disabled="!isValid"
              type="submit"
              class="mr-4"
              >Изменить
            </v-btn>
            <v-btn outlined @click="clearAndClose" color="error">Отмена</v-btn>
          </v-form>
        </v-card>
      </v-dialog>

      <v-dialog
        v-model="createClientDialog"
        width="500px"
        @click:outside="clearAndClose"
      >
        <v-card class="pa-4">
          <v-card-title> Добавление клиента </v-card-title>
          <v-form v-model="isValid" @submit.prevent="createClient">
            <v-text-field
              outlined
              dense
              v-model="currentClient.name"
              :rules="[(v) => !!v || 'Обязательное поле']"
              label="Имя"
            ></v-text-field>

            <v-text-field
              outlined
              dense
              type="tel"
              v-model="currentClient.phone"
              :rules="[(v) => !!v || 'Обязательное поле']"
              label="Телефон"
            ></v-text-field>

            <v-text-field
              outlined
              dense
              type="email"
              v-model="currentClient.email"
              label="email"
            ></v-text-field>

            <v-textarea
              outlined
              v-model="currentClient.comment"
              label="Комментарий"
            ></v-textarea>

            <v-btn
              outlined
              color="info"
              :disabled="!isValid"
              type="submit"
              class="mr-4"
              >Добавить
            </v-btn>
            <v-btn outlined @click="clearAndClose" color="error">Отмена</v-btn>
          </v-form>
        </v-card>
      </v-dialog>

      <v-dialog v-model="banDialog" width="500px">
        <v-card class="pa-4">
          <v-card-title>Блокировка {{ currentClient.name }}</v-card-title>
          <v-form v-model="isValid" @submit.prevent="banClient">
            <v-textarea label="Комментарий" outlined v-model="comment">
            </v-textarea>
            <v-btn
              outlined
              color="info"
              :disabled="!isValid"
              type="submit"
              class="mr-4"
              >Заблокировать
            </v-btn>
            <v-btn outlined @click="clearAndClose" color="error">Отмена</v-btn>
          </v-form>
        </v-card>
      </v-dialog>

      <v-dialog
        v-model="historyDialog"
        @click:outside="closeHistoryDialog"
        v-if="historyDialog"
        width="700px"
      >
        <v-card class="pa-4">
          <History :client="currentClient" />
        </v-card>
      </v-dialog>
    </div>

    <v-container>
      <v-row justify="center">
        <v-text-field
          v-debounce:500ms="searchClient"
          v-model="search"
          class="searchInput"
          label="Поиск"
        ></v-text-field>
      </v-row>
      <v-row>
        <v-col
          xs="12"
          sm="6"
          md="4"
          v-for="(client, index) in clients"
          :key="index"
        >
          <v-card
            class="mx-auto card-body"
            min-height="200"
            max-width="500"
            elevation="0"
          >
            <v-card-title class="d-flex justify-space-between align-center">
              <span class="client-name">{{ client.name }}</span>
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
                    <p class="comment">Комментарий</p>
                  </v-card-title>

                  <v-card-subtitle>
                    {{ client.blacklist_comment }}
                  </v-card-subtitle>
                  <v-card-actions>
                    <v-btn outlined color="info" @click="unBan(client)"
                      >Разблокировать</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-menu>
            </div>

            <div class="actions">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    icon
                    @click="openHistoryDialog(client)"
                  >
                    <v-icon>mdi-book-multiple</v-icon>
                  </v-btn>
                </template>
                <span>История</span>
              </v-tooltip>

              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    icon
                    @click="onEditClient(client)"
                  >
                    <v-icon>mdi-pencil-outline</v-icon>
                  </v-btn>
                </template>
                <span>Изменить</span>
              </v-tooltip>

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

              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" icon>
                    <v-icon @click="onBan(client)">mdi-account-cancel</v-icon>
                  </v-btn>
                </template>
                <span>Заблокировать</span>
              </v-tooltip>
            </div>
          </v-card>
        </v-col>
        <v-col xs="12" sm="6" md="4">
          <div class="empty-card mx-auto" @click="createClientDialog = true">
            <v-icon x-large> mdi-plus </v-icon>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <v-snackbar
      v-model="snackbarHolder"
      :color="snackbarStatus"
    >
      {{ snackbarText }}
    </v-snackbar>

  </div>
</template>

<script>
import axiosInstance from "../../plugins/axios";
import History from "@/views/Clients/History";
export default {
  name: "ClientsList",
  components: {
    History,
  },

  data() {
    return {
      tab: 0,
      isValid: false,
      search: "",

      clients: [],

      currentClient: {},
      comment: "",

      history: {},

      banDialog: false,
      createClientDialog: false,
      editClientDialog: false,
      deleteClientDialog: false,
      historyDialog: false,


      snackbarText:'',
      snackbarHolder:false,
      snackbarStatus:null,
    };
  },

  methods: {
    openSnackbar(status,text){
      this.snackbarText = text
      this.snackbarStatus = status
      this.snackbarHolder = true
    },
    closeHistoryDialog() {
      this.currentClient = {};
    },

    async openHistoryDialog(client) {
      this.currentClient = client;

      this.historyDialog = true;
    },

    async searchClient() {
      let { data } = await axiosInstance.get(
        `clients/contacts/?search=${this.search}&blacklist=0`
      );
      this.clients = data.results;
    },

    async unBan(client) {
      await axiosInstance.post(`clients/contacts/bl/`, {
        client: client.id,
        blacklist: false,
      });
      await this.fetchClients();
    },

    async banClient() {
      await axiosInstance.post("clients/contacts/bl/", {
        client: this.currentClient.id,
        comment: this.comment,
        blacklist: true,
      });
      this.fetchClients();
      this.clearAndClose();
    },

    onBan(client) {
      this.currentClient = client;
      this.banDialog = true;
    },

    async createClient() {
      let { data } = await axiosInstance.post(
        "clients/contacts/",
        this.currentClient
      )
      .then((response)=>{
        console.log(response)
        if (response.status === 201){
          this.openSnackbar("success", response.data.detail)
          this.clearAndClose()
        }
        if (response.response.status === 400){
          this.openSnackbar("error", response.response.data.email)
          this.clearAndClose()
        }

      })
      this.clients.unshift(data);
      this.clearAndClose();
    },

    async editClient() {
      try {
        await axiosInstance.put(
          `clients/contacts/${this.currentClient.id}/`,
          this.currentClient
        );
        this.clearAndClose();
      } catch (e) {
        console.log(e);
      }
    },

    onEditClient(client) {
      this.currentClient = client;
      this.editClientDialog = true;
    },

    async DeleteClient() {
      await axiosInstance.delete(`clients/contacts/${this.currentClient.id}/`);
      this.clearAndClose();
      await this.fetchClients();
    },

    async onDeleteClient(client) {
      this.currentClient = client;
      this.deleteClientDialog = true;
    },

    async fetchClients() {
      try {
        let { data } = await axiosInstance.get(
          `clients/contacts/?blacklist=0&search=${this.search}`
        );
        this.clients = data.results;
      } catch (e) {
        console.log(e);
      }
    },

    clearAndClose() {
      this.currentClient = {};
      this.createClientDialog = false;
      this.deleteClientDialog = false;
      this.editClientDialog = false;
      this.banDialog = false;
    },
  },

  mounted() {
    this.fetchClients();
  },
};
</script>

<style scoped>
.comment {
  margin: 0; /* Убираем внешний отступ */
  -webkit-line-clamp: 3; /* Число отображаемых строк */
  display: -webkit-box; /* Включаем флексбоксы */
  -webkit-box-orient: vertical; /* Вертикальная ориентация */
  overflow: hidden; /* Обрезаем всё за пределами блока */
}

.searchInput {
  max-width: 300px !important;
}

.comment {
  font-size: 14px;
}

.actions {
  position: absolute;
  top: 5px;
  right: 5px;
}

.empty-card {
  min-height : 200px;
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
  width: 300px !important;
  padding: 15px !important;
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
