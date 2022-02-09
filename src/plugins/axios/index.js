import axios from "axios";
import router from "@/router";

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

axiosInstance.interceptors.response.use(undefined, (error) => {
  if (error.response && error.response.status === 401) {
    router.push({ path: "login" });
  }
});

export default axiosInstance;
