import {http} from "./http"
import type { Image } from "../types/models"

const base = "/images"

export const imageService = {

  getAll: async (search?: string): Promise<Image[]> => {
    const res = await http.get<Image[]>("/images", {
      params: { search }
    })
    return res.data
  },


  getById: async (id: number): Promise<Image> => {
    const res = await http.get<Image>(`${base}/${id}`)
    return res.data
  },

  create: async (image: Image): Promise<Image> => {
    const res = await http.post<Image>(base, image)
    return res.data
  },

  update: async (id: number, image: Image): Promise<void> => {
    await http.put(`${base}/${id}`, image)
  },

  remove: async (id: number): Promise<void> => {
    await http.delete(`${base}/${id}`)
  }
}
