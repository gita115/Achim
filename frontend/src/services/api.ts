import axios from "axios"

export const api = axios.create({
  baseURL: "http://localhost:5000/api"
})

api.interceptors.request.use(config => {
  const org = localStorage.getItem("organization")
  if (!org) return config
  return config
})
