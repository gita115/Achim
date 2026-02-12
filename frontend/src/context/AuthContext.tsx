import { createContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

interface AuthState {
  user: any | null
  token: string | null
}

interface AuthContextType extends AuthState {
  login: (user: any) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')
    if (stored && storedToken) {
      setUser(JSON.parse(stored))
      setToken(storedToken)
    }
  }, [])

  const login = (userData: any) => {
    setUser(userData)
    setToken('fake-jwt')
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', 'fake-jwt')
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.clear()
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
