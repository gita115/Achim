import type { Image } from "../types/models"
import { api } from "./api"

const base = "/images"

const imageService = {
  getById: async (id: number): Promise<Image> => {
    const res = await api.get<Image>(`${base}/${id}`)
    return res.data
  },

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

  // search: async (params: {
  //   search?: string
  //   categoryId?: number
  //   tagId?: number
  // }): Promise<Image[]> => {
  //   const res = await api.get<Image[]>(base, { params })
  //   return res.data
  // },
//   search: async (params: any) => {
//   const res = await api.get(base, { params })
//   return res.data
// },
search: async (queryString: string) => {  
  const res = await api.get(`${base}?${queryString}`);
  console.log(res.data)
  return res.data;
},

getPhotographers: async (): Promise<string[]> => {
  const res = await api.get<string[]>(`${base}/photographers`)
  return res.data
},

  upload: async (formData: FormData): Promise<Image> => {
  const res = await api.post<Image>(`${base}/upload`, formData)
  return res.data
},
bulkUpload: async (formData: FormData): Promise<void> => {
  await api.post(`${base}/bulk-upload`, formData)
},
// async refreshThumbnails(logoName: string) {
//     const response = await api.post(`${base}/refresh-thumbnails?logoName=${logoName}`);
//     return response.data;
// }



}

export default imageService
