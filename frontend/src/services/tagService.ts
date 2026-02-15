import { http } from "./http"

export const tagService = {
  getAll: async () => {
    const res = await http.get("/tags")
    return res.data
  },

  create: async (tag: any) => {
    const res = await http.post("/tags", tag)
    return res.data
  },

  remove: async (id: number) => {
    await http.delete(`/tags/${id}`)
  }
}
