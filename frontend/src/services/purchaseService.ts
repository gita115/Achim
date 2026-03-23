import { api } from "./api"

export const purchaseService = {
  getAll: async () => {
    const res = await api.get("/purchases")
    return res.data
  },

  create: async (purchase: any) => {
    const res = await api.post("/purchases", purchase)
    return res.data
  },

  pay: async (purchases: number[]) => {
    return await api.post("/purchases/pay", purchases)
  },
  getStats: async () => {
    const res = await api.get("/purchases/stats")
    return res.data
  }
}


