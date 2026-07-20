import axios from "axios";
import { API_URL } from "../common/url";

export function registerApi(payload) {
  return axios.post(API_URL.REGISTER, payload);
}
