import { http } from "./http"

export const purchaseService = {
  getAll: async () => {
    const res = await http.get("/purchases")
    return res.data
  },

  create: async (purchase: any) => {
    const res = await http.post("/purchases", purchase)
    return res.data
  }
}
