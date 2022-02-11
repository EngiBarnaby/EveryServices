<template>
  <div>
    <!--      <v-row justify="center" class="mt-4">-->
    <!--        <h1>Ваши клиенты</h1>-->
    <!--      </v-row>-->

    <v-tabs v-model="tab" centered align-with-title>
      <v-tabs-slider color="blue"></v-tabs-slider>

      <div class="tabs-wrapper">
        <v-tab>
          <p>Клиенты</p>
        </v-tab>

        <v-tab>
          <p>Чёрный список</p>
        </v-tab>
      </div>

      <v-tabs-items v-model="tab">
          <v-tab-item>
            <ClientsList ref="clientList" />
          </v-tab-item>
          <v-tab-item  >
            <BlackList ref="blackList"/>
          </v-tab-item>
      </v-tabs-items>
    </v-tabs>
  </div>
</template>

<script>
import ClientsList from "./ClientsList";
import BlackList from "./BlackList";
export default {
  name: "clients",

  components: {
    BlackList,
    ClientsList,
  },

  watch : {
    tab(){
      if(this.tab === 0){
        this.$refs.clientList.fetchClients()
      }
      else if(this.tab === 1) {
        this.$refs.blackList.fetchBlackList()
      }
    }
  },

  data() {
    return {
      tab: 0,
    };
  },
};
</script>

<style>
.tabs-wrapper {
  display: flex;
  justify-content: center;
}
</style>
