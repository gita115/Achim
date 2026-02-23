import type { Image } from "../types/models"
import { api } from "./api"

const base = "/images"

const imageService = {

  getAll: async (): Promise<Image[]> => {
    const res = await api.get<Image[]>(base)
    return res.data
  },

  create: async (image: Image): Promise<Image> => {
    const res = await api.post<Image>(base, image)
    return res.data
  },

  update: async (id: number, image: Image): Promise<Image> => {
    const res = await api.put<Image>(`${base}/${id}`, image)
    return res.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`${base}/${id}`)
  },

  search: async (params: {
    search?: string
    categoryId?: number
    tagId?: number
  }): Promise<Image[]> => {
    const res = await api.get<Image[]>(base, { params })
    return res.data
  },

  upload: async (formData: FormData): Promise<Image> => {
  const res = await api.post<Image>("/images/upload", formData)
  return res.data
}



}

export default imageService
