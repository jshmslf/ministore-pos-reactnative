import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API = axios.create({
    baseURL: "http://192.168.100.125:5000/api",
});

API.interceptors.request.use(async (req) => {
    const token = await AsyncStorage.getItem("token");
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
});

export default API;

