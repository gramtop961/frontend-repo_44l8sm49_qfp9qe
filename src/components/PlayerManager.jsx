import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function PlayerManager() {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    position: '',
    age: '',
    nationality: '',
    preferred_foot: '',
    height_cm: '',
    market_value: '',
    bio: ''
  })

  const fetchPlayers = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API}/players`)
      const data = await res.json()
      setPlayers(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlayers()
  }, [])

  const onChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      age: form.age ? Number(form.age) : undefined,
      height_cm: form.height_cm ? Number(form.height_cm) : undefined,
      market_value: form.market_value ? Number(form.market_value) : undefined,
    }
    try {
      const res = await fetch(`${API}/players`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Errore creazione giocatore')
      setForm({ name: '', position: '', age: '', nationality: '', preferred_foot: '', height_cm: '', market_value: '', bio: '' })
      fetchPlayers()
    } catch (e) {
      alert(e.message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-4">
        <h3 className="text-white font-semibold mb-3">Crea profilo giocatore</h3>
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input className="bg-slate-900/60 text-white px-3 py-2 rounded" name="name" value={form.name} onChange={onChange} placeholder="Nome completo" required />
          <input className="bg-slate-900/60 text-white px-3 py-2 rounded" name="position" value={form.position} onChange={onChange} placeholder="Ruolo (es. Attaccante)" required />
          <input className="bg-slate-900/60 text-white px-3 py-2 rounded" name="nationality" value={form.nationality} onChange={onChange} placeholder="Nazionalità" />
          <input className="bg-slate-900/60 text-white px-3 py-2 rounded" name="age" value={form.age} onChange={onChange} placeholder="Età" />
          <input className="bg-slate-900/60 text-white px-3 py-2 rounded" name="height_cm" value={form.height_cm} onChange={onChange} placeholder="Altezza (cm)" />
          <input className="bg-slate-900/60 text-white px-3 py-2 rounded" name="preferred_foot" value={form.preferred_foot} onChange={onChange} placeholder="Piede preferito" />
          <input className="bg-slate-900/60 text-white px-3 py-2 rounded md:col-span-2" name="market_value" value={form.market_value} onChange={onChange} placeholder="Valore di mercato (€)" />
          <input className="bg-slate-900/60 text-white px-3 py-2 rounded md:col-span-3" name="bio" value={form.bio} onChange={onChange} placeholder="Bio" />
          <div className="md:col-span-3 flex justify-end">
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded">Salva</button>
          </div>
        </form>
      </div>

      <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold">Giocatori</h3>
          <button onClick={fetchPlayers} className="text-blue-300 hover:text-white text-sm">Aggiorna</button>
        </div>
        {loading ? (
          <p className="text-blue-200">Caricamento...</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {players.map(p => (
              <div key={p.id} className="bg-slate-900/60 rounded-lg p-3 border border-slate-700">
                <div className="flex items-center justify-between">
                  <h4 className="text-white font-semibold">{p.name}</h4>
                  <span className="text-xs text-blue-300">{p.position}</span>
                </div>
                <div className="mt-2 text-sm text-blue-200/80 space-y-1">
                  {p.nationality && <p>🇺🇳 {p.nationality}</p>}
                  {p.age && <p>🎂 {p.age} anni</p>}
                  {p.height_cm && <p>📏 {p.height_cm} cm</p>}
                  {p.preferred_foot && <p>🦶 {p.preferred_foot}</p>}
                  {p.market_value != null && <p>💶 {new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(p.market_value)}</p>}
                </div>
                {p.bio && <p className="mt-2 text-sm text-blue-200/80 line-clamp-2">{p.bio}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
