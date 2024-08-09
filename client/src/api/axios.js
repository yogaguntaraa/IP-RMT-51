import axios from "axios";

const instance = axios.create({
  // baseURL: "http://localhost:80/",
  baseURL: "https://ip-server.yogaguntara.xyz/"
});

export default instance;