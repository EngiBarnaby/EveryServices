<template>
  <div>
    <v-dialog v-model="servicesDialog" width="1000">
      <v-card>
        <Services />
      </v-card>
    </v-dialog>

    <v-dialog v-model="clientsDialog" width="1000">
      <v-card>
        <Clients />
      </v-card>
    </v-dialog>

    <v-dialog v-model="profileDialog" width="1000" height="500px">
      <Profile />
    </v-dialog>

    <v-dialog v-model="statisticsDialog" width="1000" height="500px">
      <Statistics />
    </v-dialog>

    <v-navigation-drawer
      color="#a60dbf"
      class="sidebar"
      absolute
      stateless
      permanent
      right
      expand-on-hover
    >
      <template v-slot:prepend>
        <v-list-item
          @click="profileDialog = true"
          two-line
          style="margin: 0 auto; width: 90%"
          class="d-flex align-center justify-center mt-2"
        >
          <v-list-item-avatar>
            <img :src="getImgUrl" />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title class="white--text"
              >{{ getUserInfo.first_name }}
              {{ getUserInfo.last_name }}</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
      </template>

      <v-list dense>
        <!--        <v-list-item to="/">-->
        <!--          <v-list-item-icon>-->
        <!--            <v-icon class="white&#45;&#45;text">mdi-calendar</v-icon>-->
        <!--          </v-list-item-icon>-->

        <!--          <v-list-item-content>-->
        <!--            <v-list-item-title class="white&#45;&#45;text"-->
        <!--            >Мои записи</v-list-item-title-->
        <!--            >-->
        <!--          </v-list-item-content>-->
        <!--        </v-list-item>-->

        <v-list-item @click="servicesDialog = true">
          <v-list-item-icon>
            <v-icon class="white--text">mdi-clipboard-text-outline</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="white--text"
              >Мои услуги</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-icon>
            <v-icon class="white--text">mdi-calendar-month-outline</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="white--text"
              >Моё расписание</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="clientsDialog = true">
          <v-list-item-icon>
            <v-icon class="white--text">mdi-account-outline</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="white--text"
              >Мои клиенты</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="statisticsDialog = true">
          <v-list-item-icon>
            <v-icon class="white--text">mdi-wallet-outline</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="white--text"
              >Мои доходы</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Services from "../views/Services/Services";
import Clients from "@/views/Clients/Clients";
import Profile from "../views/Profile/Profile";
import Statistics from "../views/Statistics/Statistics";
// import LineChart from "../views/Statistics/LineChart.vue";
export default {
  name: "Sidebar",

  components: {
    Services,
    Clients,
    Profile,
    Statistics,
  },

  data() {
    return {
      servicesDialog: false,
      clientsDialog: false,
      profileDialog: false,
      statisticsDialog: false,

      imageUrl: "",
    };
  },

  computed: {
    ...mapGetters("user", ["getUserInfo", "getImgUrl"]),
  },
};
</script>

<style scoped>
.sidebar {
  z-index: 100;
}

.profile-text:hover {
  cursor: pointer;
}

.clients-window {
  background-color: white;
}
</style>
