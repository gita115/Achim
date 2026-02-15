import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'

const Login = () => {
  const [name, setName] = useState('')
  const [passwordHash, setpasswordHash] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault() 
    setError('')

    try {
      const res = await authService.login(name, passwordHash)

      localStorage.setItem('organization', res.name)
      localStorage.setItem('isAdmin', res.isAdmin ? 'true' : 'false')

      if (res.isAdmin) navigate('/admin/dashboard')
      else navigate('/')
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.message || 'שם או סיסמא שגויים')
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '50px auto' }}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={passwordHash}
            onChange={(e) => setpasswordHash(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default Login
