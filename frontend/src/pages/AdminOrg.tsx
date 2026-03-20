// import { useEffect, useState } from "react"
// import { Button, Card } from "../components/Ui"
// import { organizationService } from "../services/organizationService"

// export default function AdminOrganizations() {
//     const [orgs, setOrgs] = useState<any[]>([])
//     const [name, setName] = useState("")
//     const [password, setPassword] = useState("")

//     const load = async () => {
//         const res = await organizationService.getAll()
//         setOrgs(res.data)
//     }

//     useEffect(() => { load() }, [])

//     const add = async () => {
//         await organizationService.create({
//             name,
//             passwordHash: password,
//             role: "User"
//         })
//         setName("")
//         setPassword("")
//         load()
//     }
//     const deleteOrg = async (id: number) => {
//         await organizationService.remove(id)
//         load()
//       }

//     return (
//         <div>
//             <h2>Organizations</h2>

//             <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
//             <input value={password} type="password" onChange={e => setPassword(e.target.value)} placeholder="Password" />
//             <Button onClick={add}>Add</Button>

            
//             {orgs.map(o => (
//                     <Card key={o.id}>
//                       {o.name}
//                       <Button onClick={() => deleteOrg(o.id)}>Delete</Button>
//                     </Card>
//                   ))}
//         </div>
//     )
// }
import { useEffect, useState } from "react"
import { organizationService } from "../services/organizationService"
import ConfirmDialog from "../components/ConfirmDialog"
import SearchInput from "../components/SearchInput"

export default function AdminOrganizations() {
  const [orgs, setOrgs] = useState<any[]>([])
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [search, setSearch] = useState("")
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const load = async () => {
    const res = await organizationService.getAll()
    setOrgs(res.data)
  }

  useEffect(() => { load() }, [])

  const add = async () => {
    if (!name.trim() || !password.trim()) return
    await organizationService.create({
      name,
      passwordHash: password,
      role: "User"
    })
    setName("")
    setPassword("")
    load()
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    await organizationService.remove(deleteId)
    setDeleteId(null)
    load()
  }

  const filtered = orgs.filter(o =>
    o.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <section>
      <h2>Organizations</h2>

      <div style={{ display: "flex", gap: 16, marginBottom: 30 }}>
        <SearchInput value={search} onChange={setSearch} />
        <input
          placeholder="Organization name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button onClick={add}>Add</button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th style={{ width: 120 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(o => (
            <tr key={o.id}>
              <td>{o.name}</td>
              <td>{o.role}</td>
              <td>
                <div className="actions">
                  <button
                    className="danger"
                    onClick={() => setDeleteId(o.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmDialog
        open={deleteId !== null}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        message={`Are you sure you want to delete ${orgs.find(o => o.id === deleteId)?.name || "this organization"}?`}
      />
    </section>
  )
}