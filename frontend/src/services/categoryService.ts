import { http } from "./http"

export const categoryService = {
  getAll: async () => {
    const res = await http.get("/categories")
    return res.data
  },

  create: async (category: any) => {
    const res = await http.post("/categories", category)
    return res.data
  },

  update: async (id: number, category: any) => {
    const res = await http.put(`/categories/${id}`, category)
    return res.data
  },

  remove: async (id: number) => {
    await http.delete(`/categories/${id}`)
  }
}
