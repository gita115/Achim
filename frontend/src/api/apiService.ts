import { http } from "./http"

export const apiService = {
  getAll: async <T>(endpoint: string): Promise<T[]> =>
    (await http.get<T[]>(`/${endpoint}`)).data,

  getById: async <T>(endpoint: string, id: number): Promise<T> =>
    (await http.get<T>(`/${endpoint}/${id}`)).data,

  create: async <T>(endpoint: string, data: T): Promise<T> =>
    (await http.post<T>(`/${endpoint}`, data)).data
}
