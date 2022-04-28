import axiosInstance from "../../plugins/axios";
import router from "../../router";

const user = {
  namespaced: true,

  state: {
    userInfo: {},
  },

  mutations: {
    SET_USER_INFO(state, data) {
      state.userInfo = data;
    },

    LOGOUT(state){
      state.userInfo = {}
      localStorage.clear()
      router.push("/login")
    },

  },

  actions: {
    async fetchUserData(context) {
      let { data } = await axiosInstance.get("accounts/profile/info/");
      console.log(data);
      context.commit("SET_USER_INFO", data);
    },
  },

  getters: {
    getImgUrl: (state) => state.userInfo.avatar,
    getUserInfo: (state) => state.userInfo,
  },
};

export default user;
