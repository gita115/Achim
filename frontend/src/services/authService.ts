import { api } from './api'

interface AuthResponse {
  name: string
  isAdmin: boolean
}

export const authService = {
  login: async (name: string, passwordHash: string): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/login', { name, passwordHash })
    return res.data
  }
}
