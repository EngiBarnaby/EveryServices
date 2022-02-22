<template>
  <div>
    <div>
      <v-dialog
        v-model="deleteDialog"
        width="500px"
        @click:outside="clearAndClose"
      >
        <v-card>
          <v-card-title> Вы уверены, что хотите удалить услугу? </v-card-title>

          <v-card-actions>
            <v-btn outlined @click="deleteService" color="success">Да</v-btn>
            <v-btn outlined @click="clearAndClose" color="error">Нет</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog
        v-model="editServiceDialog"
        width="500px"
        @click:outside="clearAndClose"
      >
        <v-card class="pa-4">
          <v-card-title> Добавление услугу </v-card-title>
          <v-form v-model="isValid" @submit.prevent="editService">
            <v-text-field
              outlined
              dense
              v-model="name"
              :rules="[(v) => !!v || 'Обязательное поле']"
              label="Название"
            ></v-text-field>
            <v-text-field
              outlined
              dense
              v-model="cost"
              label="Цена"
              type="number"
              :rules="[((v) => !!v || 'Обязательное поле') && ((v) => v < 1000000 && v > 0 || 'Стоимость услуги должна быть меньше 1 000 000 руб. и больше 0 руб.')]"
              min="0"
              max="1000000"
            ></v-text-field>
            <v-text-field
              outlined
              dense
              v-model="duration"
              type="time"
              label="Длительность"
              :rules="[(v) => !!v || 'Обязательное поле']"
            ></v-text-field>
            <v-file-input
              v-model="img"
              label="Фото"
              outlined
              ref="file"
              accept="image/jpeg, image/png"
              v-on:change="handleFileUpload()"
              dense
              type="file"
            ></v-file-input>
            <v-textarea
              v-model="description"
              outlined
              dense
              label="Описание"
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

      <v-dialog
        v-model="createDialog"
        width="500px"
        @click:outside="clearAndClose"
      >
        <v-card class="pa-4">
          <v-card-title> Добавление услугу </v-card-title>
          <v-form v-model="isValid" @submit.prevent="addService">
            <v-text-field
              outlined
              dense
              v-model="name"
              :rules="[(v) => !!v || 'Обязательное поле']"
              label="Название"
            ></v-text-field>
            <v-text-field
              outlined
              dense
              v-model="cost"
              label="Цена"
              type="number"
              :rules="[((v) => !!v || 'Обязательное поле') && ((v) => v < 1000000 && v > 0 || 'Стоимость услуги должна быть меньше 1 000 000 руб. и больше 0 руб.')]"
              min="0"
              max="1000000"
            ></v-text-field>
            <v-text-field
              outlined
              dense
              v-model="duration"
              type="time"
              label="Длительность"
              :rules="[(v) => !!v || 'Обязательное поле']"
            ></v-text-field>
            <v-file-input
              v-model="img"
              label="Фото"
              outlined
              ref="file"
              accept="image/jpeg, image/gif, image/png"
              v-on:change="handleFileUpload()"
              dense
              type="file"
            ></v-file-input>
            <v-textarea
              v-model="description"
              outlined
              dense
              label="Описание"
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
    </div>

    <v-container>
      <v-row justify="center" class="mt-4">
        <h1>Ваши услуги</h1>
      </v-row>

      <v-row>
        <v-col
          xs="12"
          sm="6"
          md="4"
          v-for="(service, index) in services"
          :key="index"
        >
          <v-card
            class="mx-auto card-body"
            min-height="450"
            max-width="400"
            elevation="0"
          >
            <v-img :src="service.img" height="250px"></v-img>

            <v-card-title class="d-flex pa-0">
              <span>{{ service.name }}</span>
            </v-card-title>

            <div style="display: flex; flex-direction: column">
              <v-card-subtitle class="description">
                {{ service.description }}
              </v-card-subtitle>

              <div
                class="price-and-time"
                style="display: flex; justify-content: space-between"
              >
                <h3>{{ service.cost }} &#8381;</h3>
                <h3>{{ service.duration }}</h3>
              </div>
            </div>

            <div>
              <v-btn icon @click="onEditService(service)">
                <v-icon>mdi-pencil-outline</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon @click="onDelete(service)">mdi-delete-outline</v-icon>
              </v-btn>
            </div>
          </v-card>
        </v-col>
        <v-col xs="12" sm="6" md="4">
          <div class="empty-card mx-auto" @click="createDialog = true">
            <v-icon x-large> mdi-plus </v-icon>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axiosInstance from "../../plugins/axios";
export default {
  name: "Services",

  data() {
    return {
      isValid: false,

      services: [],

      createDialog: false,
      editServiceDialog: false,
      deleteDialog: false,

      edit: false,

      id: null,
      name: null,
      cost: null,
      duration: null,
      img: null,
      description: null,
    };
  },

  methods: {
    async deleteService() {
      await axiosInstance.delete(`services/services/${this.id}/`);
      this.clearAndClose();
      this.fetchServices();
    },

    onDelete(event) {
      this.id = event.id;
      this.deleteDialog = true;
    },

    async editService() {
      try {
        let formData = new FormData();
        if (this.img) {
          formData.append("img", this.img);
        }
        formData.append("name", this.name);
        formData.append("cost", this.cost);
        formData.append("duration", this.duration);
        formData.append("description", this.description);
        await axiosInstance.put(`services/services/${this.id}/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        this.editServiceDialog = false;
        this.clearAndClose();
        this.fetchServices();
      } catch (e) {
        console.log(e);
      }
    },

    onEditService(service) {
      this.id = service.id;
      this.name = service.name;
      this.cost = service.cost;
      this.duration = service.duration;
      this.description = service.description;
      this.editServiceDialog = true;
    },

    handleFileUpload() {
      this.file = this.$refs.file.files[0];
    },

    clearAndClose() {
      this.id = null;
      this.name = null;
      this.cost = null;
      this.duration = null;
      this.img = null;
      this.description = "";
      this.createDialog = false;
      this.editServiceDialog = false;
      this.deleteDialog = false;
    },

    async addService() {
      try {
        let formData = new FormData();
        formData.append("img", this.img);
        formData.append("name", this.name);
        formData.append("cost", this.cost);
        formData.append("duration", this.duration);
        formData.append("description", this.description);
        await axiosInstance.post("services/services/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        this.clearAndClose();
        this.fetchServices();
      } catch (e) {
        console.log(e);
      }
    },

    async fetchServices() {
      try {
        let { data } = await axiosInstance.get("services/services/");
        this.services = data.results;
      } catch (e) {
        console.log(e);
      }
    },
  },

  mounted() {
    this.fetchServices();
  },
};
</script>

<style scoped>


.description {
  padding-bottom: 20px;
  margin: 0; /* Убираем внешний отступ */
  -webkit-line-clamp: 2; /* Число отображаемых строк */
  display: -webkit-box; /* Включаем флексбоксы */
  -webkit-box-orient: vertical; /* Вертикальная ориентация */
  overflow: hidden; /* Обрезаем всё за пределами блока */
}

.actions {
  position: absolute;
  bottom: 10px;
  right: 10px;
}

.price {
  position: absolute;
  bottom: 10px;
  left: 10px;
}

.empty-card {
  height: 450px;
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

.wrapper-watch {
  display: flex;
}
</style>
