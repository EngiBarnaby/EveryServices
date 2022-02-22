<template>
  <div class="wrapper">
    <v-card class="pa-4" max-width="300px">
      <v-card-title>Восстановление пароля</v-card-title>
      <v-card-text class="inputs-wrapper">
        <v-text-field
          dense
          label="Ваш номер телефона или email"
          v-model="login"
          :rules="[(v) => !!v || 'Обязательное поле']"
          required
        ></v-text-field>
        <v-btn
          v-if="sendPin === false && setNewPassword === false"
          class="mt-3"
          @click="getPin"
          outlined
          color="info"
          >Получить код</v-btn
        >
        <div
          v-else-if="sendPin === true && setNewPassword === false"
          style="display: flex; flex-direction: column; justify-content: center"
        >
          <p>Сообщение с кодом отправлено на {{ login }}</p>
          <v-otp-input v-model="pin" length="4" type="number"></v-otp-input>
          <v-btn color="info" @click="otcCheck" outlined>Подтвердить</v-btn>
          <v-btn color="info" class="mt-3" @click="getPin" outlined
            >Отправить новый пин</v-btn
          >
        </div>
        <div
          v-else
          style="display: flex; flex-direction: column; justify-content: center"
        >
          <v-text-field
            name="password"
            v-model="newPassword"
            label="Введите новый пароль"
            :append-icon="isVisible ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="() => (isVisible = !isVisible)"
            :type="isVisible ? 'password' : 'text'"
            :rules="[
              (value) => (value && value.length >= 6) || 'Минимум 6 символов',
            ]"
          ></v-text-field>
          <v-btn outlined @click="onSetNewPassword" color="info">Назначить новый пароль</v-btn>
        </div>
      </v-card-text>
    </v-card>

    <v-snackbar v-model="error" timeout="3000" color="error" outlined>
      {{ errorText }}
    </v-snackbar>
  </div>
</template>

<script>
import axiosInstance from "@/plugins/axios";
export default {
  name: "RefreshPassword",

  data() {
    return {
      isVisible: String,

      login: null,
      sendPin: false,
      setNewPassword: false,
      error: false,
      errorText: "",

      newPassword: null,

      pin: null,
    };
  },

  methods: {
    async getPin() {
      try {
        this.pin = null;
        await axiosInstance.post("accounts/authentication/password_recovery/", {
          login: this.login,
        });
        this.sendPin = true;
      } catch (e) {
        this.error = true;
        this.errorText = "Неверный логин";
      }
    },

    async otcCheck() {
      try {
        await axiosInstance.get(
          `accounts/authentication/otc_check/?l=${this.login}&c=${this.pin}`
        );
        this.setNewPassword = true;
      } catch (e) {
        this.error = true;
        this.errorText = "Неверный пин";
      }
    },

    async onSetNewPassword() {
      try {
        await axiosInstance.post("accounts/authentication/password_recovery/", {
          login: this.login,
          otc: this.pin,
          password: this.newPassword.toString(),
        });
        this.$router.push("/login")
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style scoped>
.wrapper {
  height: 100%;
  width: 100%;
  background-color: #a60dbf;
  display: flex;
  justify-content: center;
  align-items: center;
}

.inputs-wrapper {
  display: flex;
  justify-content: center;
  flex-direction: column;
}
</style>
