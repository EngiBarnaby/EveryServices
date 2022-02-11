<template>
  <div>
    <v-dialog width="400" v-model="changeImg" @click:outside="close">
      <v-card>
        <v-card-title>Загрузить новое фото</v-card-title>
        <v-form @submit.prevent="changeAvatar">
          <v-card-text>
            <v-file-input
              v-model="image"
              truncate-length="15"
              accept="image/jpeg, image/png, image/jpg"
            ></v-file-input>
          </v-card-text>
          <v-card-actions>
            <v-btn outlined color="error" @click="close">Отмена</v-btn>
            <v-btn outlined color="info" type="submit">Загрузить</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <div class="wrapper">
      <div class="flex-wrapper">
        <div>
          <v-img :src="getImgUrl" class="img"></v-img>

          <div class="enter q-mb-xl" @click="changeImg = true">
            <div class="login__input authentication">
              <h5>Загрузить фото</h5>
            </div>
          </div>
        </div>
        <div class="ml-4">
          <v-text-field
            v-debounce:1000ms="changeName"
            v-model="last_name"
            label="Фамилия"
            dark
            style="min-width: 300px; color: white !important"
          ></v-text-field>
          <v-text-field
            v-debounce:1000ms="changeName"
            label="Имя"
            dark
            style="min-width: 300px"
            v-model="first_name"
          ></v-text-field>

          <p class="changePassword">Изменить пароль</p>
        </div>
        <div class="ml-4">
          <v-text-field
            v-debounce:1000ms="changePhone"
            label="Телефон"
            dark
            style="min-width: 300px"
            v-model="phone"
          ></v-text-field>
          <v-text-field
            v-debounce:1000ms="changeEmail"
            label="Эл. почта"
            dark
            style="min-width: 300px"
            v-model="email"
          ></v-text-field>
        </div>
      </div>
    </div>

    <v-snackbar v-model="snackbarError" timeout="3000" color="error" outlined>
      {{ snackbarTextError }}
    </v-snackbar>

    <v-snackbar v-model="snackbar" timeout="3000" color="success" outlined>
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { mapActions } from "vuex";
import axiosInstance from "../../plugins/axios";

export default {
  name: "Profile",

  data() {
    return {
      snackbar: false,
      snackbarText: "",

      snackbarError: false,
      snackbarTextError: "",

      imageUrl: "",

      image: null,
      changeImg: false,
      last_name: null,
      first_name: null,
      phone: null,
      email: null,
    };
  },

  methods: {
    ...mapActions("user", ["fetchUserData"]),

    setNewData(){
      this.last_name = this.getUserInfo.last_name
      this.first_name = this.getUserInfo.first_name
      this.phone = this.getUserInfo.phone
      this.email = this.getUserInfo.email
    },

    close() {
      this.image = null;
      this.changeImg = false;
    },

    async changeAvatar() {
      if (this.image) {
        try {
          let formData = new FormData();
          formData.append("file", this.image);
          await axiosInstance.post(
            `accounts/profile/change_avatar/`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          await this.fetchUserData()
          this.setNewData()
          this.close();
        } catch (e) {
          console.log(e);
        }
      } else {
        this.snackbarTextError = "Вы не выбрали фотографию";
        this.snackbarError = true;
      }
    },

    async changeEmail() {
      await axiosInstance.post("accounts/profile/change_email/", {
        email: this.email,
      });
      await this.fetchUserData()
      this.setNewData()
      this.snackbarText = "Email успешно изменён";
      this.snackbar = true;
    },

    async changeName() {
      await axiosInstance.post("accounts/profile/change_name/", {
        first_name: this.first_name,
        last_name: this.last_name,
      });
      await this.fetchUserData()
      this.setNewData()
      this.snackbarText = "Данныый успешно изменены";
      this.snackbar = true;
    },

    async changePhone() {
      await axiosInstance.post("accounts/profile/change_phone/", {
        phone: this.phone,
      });
      await this.fetchUserData()
      this.setNewData()
      this.snackbarText = "Телефон успешно изменён";
      this.snackbar = true;
    },
  },

  computed: {
    ...mapGetters("user", ["getUserInfo", "getImgUrl"]),
  },

  async mounted() {
    let { data } = await axiosInstance.get("accounts/profile/info/");
    this.first_name = data.first_name;
    this.last_name = data.last_name;
    this.phone = data.phone;
    this.email = data.email;
  },
};
</script>

<style scoped>

.changePassword:hover {
  cursor: pointer;
}

.changePassword  {
  color : white;
}

.authentication {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #a60dbf;
}

.enter {
  display: flex;
  justify-content: center;
  margin-top: 0px;
  margin-top: 20px;
}

.login__input {
  width: 200px;
  height: 30px;
  elevation: 0;
  background-color: white;
  border-color: #a60dbf;
  padding: 10px;
  border-radius: 30px;
}

.login__input:hover {
  cursor: pointer;
}

.flex-wrapper {
  display: flex;
  justify-content: center;
  padding-top: 50px;
  min-height: 500px;
}

.img {
  max-height: 200px;
  max-width: 200px;
  border-radius: 50%;
}

.wrapper {
  background-color: #a60dbf;
}
</style>
