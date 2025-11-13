import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_END_POINT_DELETE_IMAGE,
  timeout: 1000,
});
const api = axios.create({
  baseUrl: " http://localhost:6380"
})
export default api;
export async function deleteFileAPI(value) {
  // console.log("value::", value)
  return await apiClient.post(`/storages/delete-file`, value);
}