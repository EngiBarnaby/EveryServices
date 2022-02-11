import axiosInstance from "../../plugins/axios";

const user = {
  namespaced: true,

  state: {
    userInfo: {},
  },

  mutations: {
    SET_USER_INFO(state, data) {
      state.userInfo = data;
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
