<template>
  <div>
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
        <v-list-item two-line>
          <v-list-item-avatar>
            <img :src="getUserInfo.user.avatar" />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title class="white--text">{{getUserInfo.user.first_name}} {{getUserInfo.user.last_name}}</v-list-item-title>
            <v-list-item-subtitle class="white--text">Перейти к профилю</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item v-for="item in items" :key="item.title" :to="item.link">
          <v-list-item-icon>
            <v-icon class="white--text">{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="white--text">{{
              item.title
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
export default {
  name: "Sidebar",

  data() {
    return {
      items: [
        {
          title: "Мои услуги",
          icon: "mdi-clipboard-text-outline",
          link: "/service",
        },
        { title: "Мои записи", icon: "mdi-calendar-month-outline", link: "/" },
        { title: "Мои клиенты", icon: "mdi-account-outline" },
        { title: "Мои доходы", icon: "mdi-wallet-outline" },
      ],
    };
  },

  computed : {
    ...mapGetters("user", ["getUserInfo"])
  },

  mounted() {
    console.log(this.getUserInfo)
  }
};
</script>

<style scoped>
.sidebar {
  z-index: 100;
}
</style>
