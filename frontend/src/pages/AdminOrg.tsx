import { useEffect, useState } from "react"
import { Button } from "../components/Ui"
import { organizationService } from "../services/organizationService"

export default function AdminOrganizations() {
    const [orgs, setOrgs] = useState<any[]>([])
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")

    const load = async () => {
        const res = await organizationService.getAll()
        setOrgs(res.data)
    }

    useEffect(() => { load() }, [])

    const add = async () => {
        await organizationService.create({
            name,
            passwordHash: password,
            role: "User"
        })
        setName("")
        setPassword("")
        load()
    }

    return (
        <div>
            <h2>Organizations</h2>

            <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
            <input value={password} type="password" onChange={e => setPassword(e.target.value)} placeholder="Password" />
            <Button onClick={add}>Add</Button>

            {orgs.map(o => (
                <div key={o.id}>{o.name}</div>
            ))}
        </div>
    )
}
