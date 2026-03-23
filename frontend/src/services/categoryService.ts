import { api } from "./api"

export const categoryService = {
  getAll: async () => {
    const res = await api.get("/categories")
    return res.data
  },

  create: async (category: any) => {
    const res = await api.post("/categories", category)
    return res.data
  },

  update: async (id: number, category: any) => {
    const res = await api.put(`/categories/${id}`, category)
    return res.data
  },

  delete: async (id: number, option: string, newParentId?: number | null) => {
    await api.delete(`/categories/${id}`, {
      params: {
        option,
        newParentId
      }
    })
  }
}
