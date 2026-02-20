import { api } from "./api"

export const tagService = {
  getAll: async () => {
    const res = await api.get("/tags")
    return res.data
  },

  create: async (tag: any) => {
    const res = await api.post("/tags", tag)
    return res.data
  },

  remove: async (id: number) => {
    await api.delete(`/tags/${id}`)
  }
}
