<template>
  <v-app>
    <Sidebar  v-if="!isLogin"/>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import Sidebar from "./components/Sidebar";
export default {
  name: "App",
  components: {
    Sidebar,
  },

  computed : {
    isLogin(){
      if(this.$route.name === "login" || this.$route.name === "404" || this.$route.name === "password-recovery"){
        return true
      }
      else {
        return false
      }
    }
  },

  data: () => ({
    //
  }),
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}

a {
  text-decoration: none;
}

* {
  scrollbar-width: 8px;
  scrollbar-color: #F2EA1E transparent;
}

/* scroll bar */
*::-webkit-scrollbar {
  width: 8px;               /* ширина scrollbar */
}
*::-webkit-scrollbar-track {
  background: transparent;        /* цвет дорожки */
}
*::-webkit-scrollbar-thumb {
  background-color: #F2EA1E;    /* цвет плашки */
  border-radius: 20px;       /* закругления плашки */
  border: 1px solid #F2EA1E;  /* padding вокруг плашки */
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
.v-tab p{
  margin: 0 !important;
}

</style>
