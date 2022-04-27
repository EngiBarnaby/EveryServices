<template>
  <div>
    <v-dialog width="400" v-model="changeImgDialog" @click:outside="close">
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

    <v-dialog
      width="400"
      v-model="changePasswordDialog"
      @click:outside="closeChangePasswordDialog"
    >
      <v-card>
        <v-card-title>Изменение пароля</v-card-title>
        <v-form @submit.prevent="changePassword" v-model="isValidPasswords">
          <v-card-text>
            <v-text-field
              v-model="oldPassword"
              label="Старый пароль"
              :append-icon="isInvisibleOldPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="
                () => (isInvisibleOldPassword = !isInvisibleOldPassword)
              "
              :type="isInvisibleOldPassword ? 'password' : 'text'"
            ></v-text-field>
            <v-text-field
              :rules="passwordRules"
              v-model="newPassword1"
              label="Новый пароль"
              :append-icon="isInvisibleNewPassword1 ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="
                () => (isInvisibleNewPassword1 = !isInvisibleNewPassword1)
              "
              :type="isInvisibleNewPassword1 ? 'password' : 'text'"
            ></v-text-field>
            <v-text-field
              :rules="passwordRules"
              v-model="newPassword2"
              label="Подтверждение пароля"
              :append-icon="isInvisibleNewPassword2 ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="
                () => (isInvisibleNewPassword2 = !isInvisibleNewPassword2)
              "
              :type="isInvisibleNewPassword2 ? 'password' : 'text'"
            ></v-text-field>
            <p class="red--text">{{ incorrectPassword }}</p>
          </v-card-text>
          <v-card-actions class="d-flex justify-center">
            <v-btn
              :disabled="!isValidPasswords"
              color="info"
              outlined
              type="submit"
              >Изменить пароль</v-btn
            >
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <v-dialog
      width="400"
      v-model="changePhoneDialog"
      @click:outside="closePhoneChangeDialog"
    >
      <v-card class="pa-4">
        <v-form @submit.prevent="changePhone">
          <v-card-title> Изменить номер телефона </v-card-title>
          <v-text-field hide-details v-model="newNumberPhone" label="Новый номер телефона">
          </v-text-field>

          <v-card-actions class="d-flex justify-center">
            <div v-if="approveChangePhonePin">
              <v-otp-input style="width: 50%; margin: 0 auto" v-model="pin" length="4" type="number"></v-otp-input>
              <v-btn outlined color="info" @click="changePhoneNum"
                >Подтвердить</v-btn
              >
            </div>
            <div v-else>
              <v-btn outlined color="info" @click="sendPinForChangePhone"
                >Прислать PIN</v-btn
              >
            </div>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <v-dialog width="400" v-model="changeEmailDialog">
      <v-card class="pa-4">
        <v-form @submit.prevent="sendNewEmail">
          <v-card-title> Изменить email</v-card-title>
          <v-text-field v-model="newEmail" label="Новый email"> </v-text-field>

          <v-card-actions class="d-flex justify-center">
            <div>
              <v-btn outlined color="info" type="submit"
                >Подтвердить email
              </v-btn>
            </div>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <div class="wrapper">
      <div class="flex-wrapper">
        <div>
          <v-img :src="getImgUrl" class="img"></v-img>

          <div class="enter q-mb-xl" @click="changeImgDialog = true">
            <div class="login__input authentication">
              <h5>Загрузить фото</h5>
            </div>
          </div>

          <div class="logoutText" @click="LOGOUT">
            <h5>Выйти из профиля <v-icon dark>mdi-exit-run</v-icon></h5>
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

          <p class="changePassword" @click="changePasswordDialog = true">
            Изменить пароль <v-icon dark small>mdi-pencil</v-icon>
          </p>

          <v-switch
            class="mt-10"
            dark
            hide-details
            v-model="auto_confirm"
            @change="changeAutoConfirmStatus"
            label="Автоматическое подтверждение сеанса"
          ></v-switch>
          <v-switch dark label="Включить уведомления"></v-switch>
        </div>
        <div class="ml-4">
          <v-text-field
            append-outer-icon="mdi-cog-outline"
            @click:append-outer="onChangePhone"
            label="Телефон"
            dark
            style="min-width: 350px"
            readonly
            v-model="phone"
          ></v-text-field>
          <v-text-field
            append-outer-icon="mdi-cog-outline"
            @click:append-outer="changeEmailDialog = true"
            label="Эл. почта"
            dark
            readonly
            style="min-width: 350px"
            v-model="email"
          ></v-text-field>
          <p class="changePassword" @click="changePasswordDialog = true">
            Оформить подписку <v-icon dark small>mdi-star-outline</v-icon>
          </p>
        </div>
      </div>
    </div>

    <v-snackbar v-model="snackbarError" timeout="4000" color="error" outlined>
      {{ snackbarTextError }}
    </v-snackbar>

    <v-snackbar v-model="snackbar" timeout="4000" color="success" outlined>
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import {} from "vuex";
import axiosInstance from "../../plugins/axios";

export default {
  name: "Profile",

  data() {
    return {
      isValidPasswords: false,

      changeImgDialog: false,
      changePhoneDialog: false,
      changeEmailDialog: false,
      changePasswordDialog: false,

      approveChangePhonePin: false,
      pin: null,

      snackbar: false,
      snackbarText: "",

      snackbarError: false,
      snackbarTextError: "",
      incorrectPassword: null,

      imageUrl: "",

      newNumberPhone: null,

      image: null,
      last_name: null,
      first_name: null,
      phone: null,
      email: null,
      auto_confirm: false,

      oldPassword: null,
      newPassword1: null,
      newPassword2: null,

      newEmail: null,

      isInvisibleOldPassword: true,
      isInvisibleNewPassword1: true,
      isInvisibleNewPassword2: true,

      passwordRules: [
        (value) => !!value || "Пожулуйста, введите пароль.",
        (value) => (value && value.length >= 6) || "Минимум 6 символов",
      ],
    };
  },

  methods: {
    ...mapActions("user", ["fetchUserData"]),
    ...mapMutations("user", ["LOGOUT"]),

    async changeAutoConfirmStatus() {
      await axiosInstance.post("accounts/profile/change_auto_confirm/", {
        auto_confirm: this.auto_confirm,
      });
    },

    async sendNewEmail() {
      await axiosInstance
        .post("accounts/profile/change_email/", {
          email: this.newEmail,
        })
        .then((res) => {
          if (res.status === 200) {
            this.approveChangePhonePin = true;
            this.snackbarText = res.data.detail;
            this.snackbar = true;
            this.newEmail = null;
            this.changeEmailDialog = false;
          }

          if (res.response.status === 400) {
            this.snackbarTextError = res.response.data.detail;
            this.snackbarError = true;
          }
        });
    },

    closeChangePasswordDialog() {
      this.newPassword1 = null;
      this.newPassword2 = null;
      this.oldPassword = null;
      this.isInvisibleOldPassword = true;
      this.isInvisibleNewPassword1 = true;
      this.isInvisibleNewPassword2 = true;
      this.changePasswordDialog = false;
    },

    async changePassword() {
      if (this.newPassword1 !== this.newPassword2) {
        this.snackbarTextError = "Пароли не совпадают";
        this.snackbarError = true;
      } else {
        await axiosInstance
          .post("accounts/profile/change_password/", {
            new_password: this.newPassword1,
            old_password: this.oldPassword,
          })
          .then((res) => {
            if (res.status === 200) {
              this.snackbarText = res.data.detail;
              this.snackbar = true;
              this.closeChangePasswordDialog();
            }

            if (res.response.status === 403) {
              this.incorrectPassword = res.response.data.detail;
            }
          });
      }
    },

    async changePhoneNum() {
      await axiosInstance
        .post("accounts/profile/change_phone/", {
          phone: this.newNumberPhone,
          pin: this.pin,
        })
        .then((res) => {
          if (res.status === 200) {
            this.approveChangePhonePin = true;
            this.snackbarText = res.data.detail;
            this.snackbar = true;
            this.closePhoneChangeDialog();
            this.LOGOUT();
          }

          if (res.response.status === 400) {
            this.snackbarTextError = res.response.data.detail;
            this.snackbarError = true;
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },

    closePhoneChangeDialog() {
      this.newNumberPhone = null;
      this.pin = null;
      this.approveChangePhonePin = false;
      this.changePhoneDialog = false;
    },

    async sendPinForChangePhone() {
      await axiosInstance
        .post("accounts/profile/change_phone/", {
          phone: this.newNumberPhone,
        })
        .then((res) => {
          if (res.status === 200) {
            this.approveChangePhonePin = true;
            this.snackbarText = res.data.detail;
            this.snackbar = true;
          }

          if (res.response.status === 400) {
            this.snackbarTextError = res.response.data.detail;
            this.snackbarError = true;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    onChangePhone() {
      this.changePhoneDialog = true;
    },

    setNewData() {
      this.last_name = this.getUserInfo.last_name;
      this.first_name = this.getUserInfo.first_name;
      this.phone = this.getUserInfo.phone;
      this.email = this.getUserInfo.email;
    },

    close() {
      this.image = null;
      this.changeImgDialog = false;
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
          await this.fetchUserData();
          this.setNewData();
          this.close();
        } catch (e) {
          console.log(e);
        }
      } else {
        this.snackbarTextError = "Вы не выбрали фотографию";
        this.snackbarError = true;
      }
    },

    async changeName() {
      await axiosInstance.post("accounts/profile/change_name/", {
        first_name: this.first_name,
        last_name: this.last_name,
      });
      await this.fetchUserData();
      this.setNewData();
      this.snackbarText = "Данныый успешно изменены";
      this.snackbar = true;
    },

    async changePhone() {
      await axiosInstance.post("accounts/profile/change_phone/", {
        phone: this.phone,
      });
      await this.fetchUserData();
      this.setNewData();
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
    this.auto_confirm = data.auto_confirm;
  },
};
</script>

<style scoped>
.logoutText:hover {
  cursor: pointer;
}

.logoutText {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  color: white;
}

.changePhoneBtn {
  display: flex;
  justify-content: center;
}

.changePassword:hover {
  cursor: pointer;
}

.changePassword {
  color: white;
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
