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

  actions: {},

  getters: {
    getUserInfo: state => state.userInfo,
  },
};

export default user;
