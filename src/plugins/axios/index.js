import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://everyservices.itpw.ru/",
  headers: {
    Authorization: localStorage.getItem("token")
      ? "Bearer " + localStorage.getItem("token")
      : null,
  },
});

axiosInstance.interceptors.request.use(
  function (config) {
    let token = localStorage.getItem("token");
    config.headers.Authorization = token;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default axiosInstance;
