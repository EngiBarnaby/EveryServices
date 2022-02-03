<template>
  <v-app>
    <Sidebar />
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

</style>
