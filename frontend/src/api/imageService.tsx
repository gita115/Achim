import type { Image } from "../types/models"
import { http } from "./http"

export const imagesService = {
  getAll: async (): Promise<Image[]> => {
    const res = await http.get<Image[]>("/images")
    return res.data
  },

  create: async (data: Image): Promise<Image> => {
    const res = await http.post<Image>("/images", data)
    return res.data
  }
}
