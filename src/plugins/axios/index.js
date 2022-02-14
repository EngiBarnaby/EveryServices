import axios from "axios";
import router from "@/router";

const axiosInstance = axios.create({
  baseURL: "http://everyservices.itpw.ru/",
  headers: {
    // Authorization: localStorage.getItem("token")
    //   ? "Bearer " + localStorage.getItem("token")
    //   : null,
  },
});

axiosInstance.interceptors.request.use(
  function (config) {
    let token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = "Bearer " + token;
      return config;
    } else {
      return config;
    }
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(undefined, (error) => {
  if (error.response && error.response.status === 401) {
    localStorage.removeItem("token");
    router.push({ path: "login" });
  }
  return error
});

export default axiosInstance;
