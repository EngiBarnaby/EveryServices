<template>
  <div>
    <v-dialog v-model="loginDialog" width="500">
      <v-card>
        <v-tabs v-model="tab" align-with-title>
          <v-tabs-slider color="blue"></v-tabs-slider>

          <v-tabs v-model="tab" centered align-with-title>
            <v-tabs-slider color="blue"></v-tabs-slider>

            <v-tab>
              <p>Логин</p>
            </v-tab>

            <v-tab>
              <p>Регистрация</p>
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <div class="pa-4">
                <v-form @submit.prevent="onLogin">
                  <v-text-field
                    v-model="loginPhoneNumber"
                    outlined
                    dense
                    label="Ваш номер *"
                    :rules="[(v) => !!v || 'Обязательное поле']"
                    required
                  >
                  </v-text-field>
                  <v-text-field
                    outlined
                    dense
                    label="Ваш пароль *"
                    :append-icon="
                      isInvisibleLoginPassword ? 'mdi-eye' : 'mdi-eye-off'
                    "
                    @click:append="
                      () =>
                        (isInvisibleLoginPassword = !isInvisibleLoginPassword)
                    "
                    :type="isInvisibleLoginPassword ? 'password' : 'text'"
                    v-model="loginPassword"
                    :rules="[(v) => !!v || 'Обязательное поле']"
                    required
                  ></v-text-field>

                  <div style="display: flex; justify-content: space-between">
                    <v-btn color="info" type="submit" outlined>Войти</v-btn>
                    <router-link to="/password-recovery">
                      <p>Забыли пароль</p>
                    </router-link>
                  </div>
                </v-form>
              </div>
            </v-tab-item>

            <v-tab-item>
              <div class="pa-4">
                <v-form @submit.prevent="onRegistration">
                  <v-text-field
                    v-model="firstName"
                    outlined
                    dense
                    label="Имя *"
                    type="text"
                    :rules="[(v) => !!v || 'Обязательное поле']"
                    required
                  >
                  </v-text-field>
                  <v-text-field
                    outlined
                    dense
                    label="Фамилия *"
                    type="text"
                    v-model="lastName"
                    :rules="[(v) => !!v || 'Обязательное поле']"
                    required
                  ></v-text-field>

                  <v-text-field
                    v-model="email"
                    outlined
                    dense
                    label="Email(необязательно)"
                    type="email"
                    required
                  >
                  </v-text-field>
                  <v-text-field
                    outlined
                    dense
                    label="Ваш номер *"
                    v-mask="'+7 ### ### ## ##'"
                    v-model="registrationPhone"
                    :rules="[(v) => !!v || 'Обязательное поле']"
                    required
                  ></v-text-field>

                  <v-text-field
                    v-model="registrationPassword"
                    outlined
                    dense
                    type="password"
                    label="Ваш пароль *"
                    :rules="passwordRules"
                    required
                  >
                  </v-text-field>
                  <v-text-field
                    outlined
                    dense
                    label="Подтверждение пароля *"
                    type="password"
                    v-model="registrationPassword2"
                    :rules="confirmPasswordRules"
                    required
                  ></v-text-field>
                  <div v-if="showPin">
                    <p>
                      `Сообщение с кодом отправлено на номер
                      {{ registrationPhone }}
                    </p>

                    <v-otp-input
                      v-model="pin"
                      length="4"
                      type="number"
                    ></v-otp-input>

                    <v-btn color="info" @click="confirmReg">
                      Потвердить телефон
                    </v-btn>
                  </div>
                  <div v-else>
                    <v-btn color="info" type="submit" outlined
                      >Регистрация</v-btn
                    >
                  </div>
                </v-form>
              </div>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </v-card>
    </v-dialog>

    <div class="wrapper">
      <v-row justify="center" class="pt-10">
        <v-col cols="6">
          <Carousel />
        </v-col>
      </v-row>
      <v-row justify="center">
        <div class="title">ES</div>
      </v-row>

      <div class="enter q-mb-xl" @click="loginDialog = true">
        <div class="login__input authentication">
          <h3>Войти</h3>
        </div>
      </div>

      <v-row justify="center" class="image-wrapper mt-4 pb-5">
        <img
          class="download__img google-img me-4"
          src="@/assets/android.png"
          width="120"
          height="35"
        />
        <img
          class="download__img ms-4"
          src="@/assets/apple.svg"
          width="120"
          height="35"
        />
      </v-row>
    </div>

    <v-snackbar
      v-model="registrationSuccess"
      timeout="3000"
      color="success"
      outlined
    >
      Вы успешно зарегистрировались
    </v-snackbar>

    <v-snackbar
      v-model="passwordNotMatch"
      timeout="3000"
      color="error"
      outlined
    >
      Пароли не совпадают
    </v-snackbar>
  </div>
</template>

<script>
import axiosInstance from "../../plugins/axios";
import Carousel from "../../components/Carousel";
export default {
  name: "Login",
  components: {
    Carousel,
  },
  data() {
    return {
      isInvisibleLoginPassword: true,

      tab: null,

      passwordNotMatch: false,
      registrationSuccess: false,

      loginDialog: false,

      loginPassword: null,
      loginPhoneNumber: null,

      showPin: false,

      registrationPhone: null,
      firstName: null,
      lastName: null,
      email: "",
      registrationPassword: null,
      registrationPassword2: null,
      pin: null,

      passwordRules: [
        (value) => !!value || "Пожулуйста, введите пароль.",
        (value) => (value && value.length >= 6) || "Минимум 6 символов",
      ],

      confirmPasswordRules: [(value) => !!value || "Введите пароль"],
    };
  },

  computed: {
    parseLoginPhone() {
      return this.loginPhoneNumber.slice(1).split(" ").join("");
    },

    parseRegistrationPhone() {
      return this.registrationPhone.slice(1).split(" ").join("");
    },
  },

  methods: {
    clear() {
      this.registrationPhone = null;
      this.firstName = null;
      this.lastName = null;
      this.email = null;
      this.registrationPassword = null;
      this.registrationPassword2 = null;
      this.pin = null;
    },

    async onLogin() {
      try {
        let { data } = await axiosInstance.post(
          "accounts/authentication/auth/",
          {
            login: this.loginPhoneNumber.toString(),
            password: this.loginPassword,
          }
        );
        localStorage.setItem("token", "Bearer " + data.token);
        this.$store.commit("user/SET_USER_INFO", data);
        this.$router.push("/");
      } catch (e) {
        console.log(e);
      }
    },

    async onRegistration() {
      if (this.registrationPassword !== this.registrationPassword2) {
        this.passwordNotMatch = true;
      } else {
        try {
          await axiosInstance.post("accounts/authentication/reg/", {
            first_name: this.firstName,
            last_name: this.last_name,
            password: this.registrationPassword,
            email: this.email,
            phone: this.parseRegistrationPhone,
          });
          this.showPin = true;
        } catch (e) {
          console.log(e);
        }
      }
    },

    async confirmReg() {
      try {
        let data = await axiosInstance.post("accounts/authentication/reg/", {
          first_name: this.firstName,
          last_name: this.last_name,
          password: this.registrationPassword,
          email: this.email,
          phone: this.parseRegistrationPhone,
          pin: this.pin,
        });
        console.log(data);
        this.registrationSuccess = true;
        this.tab = 0;
        this.clear();
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style scoped>
.tabs {
  justify-content: center !important;
}

.wrapper {
  height: 100%;
  width: 100%;
  background-color: #a60dbf;
}

.title {
  color: #f2ea1e;
  height: 186px;
  font-style: normal;
  font-weight: bold;
  font-size: 144px !important;
  line-height: 186px;
}

.enter {
  display: flex;
  justify-content: center;
  margin-top: 0px;
}

.login__input {
  width: 300px;
  height: 60px;
  elevation: 0;
  background-color: white;
  border-color: #a60dbf;
  padding: 10px;
  border-radius: 30px;
}

.authentication {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #a60dbf;
}

.authentication:hover {
  cursor: pointer;
}
</style>
