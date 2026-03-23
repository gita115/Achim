
// import React, { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { authService } from '../services/authService'

// const Login = () => {
//   const [name, setName] = useState('')
//   const [passwordHash, setpasswordHash] = useState('')
//   const [error, setError] = useState('')
//   const navigate = useNavigate()
//   const [show, setShow] = useState(false)


//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError('')

//     try {
//       const res = await authService.login(name, passwordHash)

//       localStorage.setItem('organization', res.name)
//       localStorage.setItem('isAdmin', res.isAdmin ? 'true' : 'false')

//       if (res.isAdmin) navigate('/admin/dashboard')
//       else navigate('/')
//     } catch (err: any) {
//       console.error(err)
//       setError(err.response?.data?.message || 'שם או סיסמא שגויים')
//     }
//   }

//   return (
//     <div style={{ maxWidth: 400, margin: '50px auto' }}>
//       <h2>Login</h2>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       <form onSubmit={handleLogin}>
//         <div>
//           <label>Name</label>
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label>Password</label>




//           <input
//             type={show ? "text" : "password"}
//             value={passwordHash}
//             onChange={(e) => setpasswordHash(e.target.value)}
//             required
//           />

//           <button type="button" onClick={() => setShow(!show)}>
//             {show ? "🙈" : "👁"}
//           </button>
//         </div>
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   )
// }

// export default Login
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { authService } from "../services/authService"

export default function Login() {
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [show, setShow] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      const res = await authService.login(name, password)
      localStorage.setItem("organization", res.name)
      localStorage.setItem("isAdmin", res.isAdmin ? "true" : "false")
if (res.isAdmin) navigate('/admin/dashboard')
       else navigate('/')    } catch (err: any) {
      setError(err.response?.data?.message || "שם או סיסמא שגויים")
    }
  }

  return (
    <div className="login-container">
      <h1>Welcome Back</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label>Username</label>
          <input value={name} onChange={e=>setName(e.target.value)} required/>
        </div>
        <div className="form-group">
          <label>Password</label>
          <div className="password-wrapper">
            <input type={show ? "text":"password"} value={password} onChange={e=>setPassword(e.target.value)} required/>
            <button type="button" onClick={()=>setShow(!show)}>{show?"🙈":"👁"}</button>
          </div>
        </div>
        <button type="submit" className="primary-btn">Login</button>
      </form>
    </div>
  )
}
