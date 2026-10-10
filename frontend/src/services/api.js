import axios from "axios";

const API = axios.create({
    baseURL : import.meta.VITE_API_URL,
    withCredentials : true
})

export default API