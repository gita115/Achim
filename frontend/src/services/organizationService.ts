import { api } from "./api"

const base = "/organizations"

export const organizationService = {
    getAll: async () => {
        return await api.get(base)
    },

    create: async (org: {
        name: string
        passwordHash: string
        role: string
    }) => {
        return await api.post(base, org)
    },


    remove: async (id: number) => {
        return await api.delete(`${base}/${id}`)
    }
}
