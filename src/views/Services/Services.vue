<template>
  <div>
    <div>
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
              :rules="[(v) => !!v || 'Обязательное поле']"
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
              >Добавить</v-btn
            >
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
          md="3"
          v-for="(service, index) in services"
          :key="index"
        >
          <v-card
            class="mx-auto card"
            min-height="450"
            max-width="400"
            elevation="0"
          >
            <v-img :src="service.img" height="250px"></v-img>

            <v-card-title class="d-flex justify-space-between align-center">
              <span>{{ service.name }}</span>
              <span class="wrapper-watch"
                >{{ service.duration }}
                <v-icon>mdi-clock</v-icon>
              </span>
            </v-card-title>

            <v-card-subtitle>
              {{ service.description }}
            </v-card-subtitle>

            <h3 class="price">Цена {{ service.cost }}</h3>
          </v-card>
        </v-col>
        <v-col xs="12" sm="6" md="3">
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

      name: null,
      cost: null,
      duration: null,
      img: null,
      description: null,
    };
  },

  methods: {
    handleFileUpload() {
      this.file = this.$refs.file.files[0];
    },

    clearAndClose() {
      (this.name = null),
        (this.cost = null),
        (this.duration = null),
        (this.img = null),
        (this.description = null),
        (this.createDialog = false);
    },

    async addService() {
      let formData = new FormData();
      formData.append("img", this.img);
      formData.append("name", this.name);
      formData.append("cost", this.cost);
      formData.append("duration", this.duration);
      formData.append("description", this.description);
      await axiosInstance
        .post("services/services/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(function () {
          console.log("SUCCESS!!");
        })
        .catch(function () {
          console.log("FAILURE!!");
        });
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

.price {
  position: absolute;
  bottom : 10px;
  left : 10px;
}

.empty-card {
  height: 450px;
  width: 400px;
  border: 1px solid #7b7b7b;
  border-radius: 25px;
  display: flex;
  justify-content: center;
  align-content: center;
}

.empty-card:hover {
  cursor: pointer;
}

.card {
  padding: 10px;
  border: 2px solid #a60dbf;
}

.wrapper-watch {
  display: flex;
}
</style>
