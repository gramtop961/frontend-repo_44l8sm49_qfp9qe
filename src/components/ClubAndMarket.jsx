import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function ClubAndMarket() {
  const [clubs, setClubs] = useState([])
  const [listings, setListings] = useState([])
  const [offers, setOffers] = useState([])

  const [clubForm, setClubForm] = useState({ name: '', league: '', country: '', budget: '', stadium: '', bio: '' })
  const [listingForm, setListingForm] = useState({ player_id: '', from_club_id: '', asking_price: '' })
  const [offerForm, setOfferForm] = useState({ listing_id: '', club_id: '', offer_amount: '', message: '' })

  const fetchAll = async () => {
    const [c, l, o] = await Promise.all([
      fetch(`${API}/clubs`).then(r => r.json()),
      fetch(`${API}/listings`).then(r => r.json()),
      fetch(`${API}/offers`).then(r => r.json()),
    ])
    setClubs(c)
    setListings(l)
    setOffers(o)
  }

  useEffect(() => { fetchAll() }, [])

  const onChange = (setter) => (e) => setter(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const createClub = async (e) => {
    e.preventDefault()
    const payload = { ...clubForm, budget: clubForm.budget ? Number(clubForm.budget) : undefined }
    const res = await fetch(`${API}/clubs`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (!res.ok) return alert('Errore creazione club')
    setClubForm({ name: '', league: '', country: '', budget: '', stadium: '', bio: '' })
    fetchAll()
  }

  const createListing = async (e) => {
    e.preventDefault()
    const payload = { ...listingForm, asking_price: listingForm.asking_price ? Number(listingForm.asking_price) : undefined }
    const res = await fetch(`${API}/listings`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    const data = await res.json().catch(() => null)
    if (!res.ok) return alert(data?.detail || 'Errore creazione listing')
    setListingForm({ player_id: '', from_club_id: '', asking_price: '' })
    fetchAll()
  }

  const createOffer = async (e) => {
    e.preventDefault()
    const payload = { ...offerForm, offer_amount: offerForm.offer_amount ? Number(offerForm.offer_amount) : undefined }
    const res = await fetch(`${API}/offers`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    const data = await res.json().catch(() => null)
    if (!res.ok) return alert(data?.detail || 'Errore creazione offerta')
    setOfferForm({ listing_id: '', club_id: '', offer_amount: '', message: '' })
    fetchAll()
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-3">Crea Club</h3>
          <form onSubmit={createClub} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input className="bg-slate-900/60 text-white px-3 py-2 rounded" name="name" value={clubForm.name} onChange={onChange(setClubForm)} placeholder="Nome club" required />
            <input className="bg-slate-900/60 text-white px-3 py-2 rounded" name="league" value={clubForm.league} onChange={onChange(setClubForm)} placeholder="Lega" />
            <input className="bg-slate-900/60 text-white px-3 py-2 rounded" name="country" value={clubForm.country} onChange={onChange(setClubForm)} placeholder="Paese" />
            <input className="bg-slate-900/60 text-white px-3 py-2 rounded" name="budget" value={clubForm.budget} onChange={onChange(setClubForm)} placeholder="Budget (€)" />
            <input className="bg-slate-900/60 text-white px-3 py-2 rounded" name="stadium" value={clubForm.stadium} onChange={onChange(setClubForm)} placeholder="Stadio" />
            <input className="bg-slate-900/60 text-white px-3 py-2 rounded md:col-span-2" name="bio" value={clubForm.bio} onChange={onChange(setClubForm)} placeholder="Descrizione" />
            <div className="md:col-span-2 flex justify-end"><button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded">Salva</button></div>
          </form>
        </div>

        <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-3">Crea Listing (Calciomercato)</h3>
          <form onSubmit={createListing} className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input className="bg-slate-900/60 text-white px-3 py-2 rounded" name="player_id" value={listingForm.player_id} onChange={onChange(setListingForm)} placeholder="ID Giocatore" required />
            <input className="bg-slate-900/60 text-white px-3 py-2 rounded" name="from_club_id" value={listingForm.from_club_id} onChange={onChange(setListingForm)} placeholder="ID Club proprietario" />
            <input className="bg-slate-900/60 text-white px-3 py-2 rounded" name="asking_price" value={listingForm.asking_price} onChange={onChange(setListingForm)} placeholder="Prezzo richiesto (€)" required />
            <div className="md:col-span-3 flex justify-end"><button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded">Pubblica</button></div>
          </form>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold">Mercato Aperto</h3>
          <button onClick={fetchAll} className="text-blue-300 hover:text-white text-sm">Aggiorna</button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {listings.map(l => (
            <div key={l.id} className="bg-slate-900/60 rounded-lg p-3 border border-slate-700">
              <div className="flex items-center justify-between">
                <h4 className="text-white font-semibold">{l.player?.name}</h4>
                <span className="text-xs text-blue-300">€ {new Intl.NumberFormat('it-IT').format(l.asking_price)}</span>
              </div>
              <p className="text-sm text-blue-200/80">Da: {l.from_club?.name || '—'}</p>
              <div className="mt-2 text-xs text-blue-300">Listing ID: {l.id}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-4">
        <h3 className="text-white font-semibold mb-3">Fai un'Offerta</h3>
        <form onSubmit={createOffer} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input className="bg-slate-900/60 text-white px-3 py-2 rounded" name="listing_id" value={offerForm.listing_id} onChange={onChange(setOfferForm)} placeholder="ID Listing" required />
          <input className="bg-slate-900/60 text-white px-3 py-2 rounded" name="club_id" value={offerForm.club_id} onChange={onChange(setOfferForm)} placeholder="ID Club" required />
          <input className="bg-slate-900/60 text-white px-3 py-2 rounded" name="offer_amount" value={offerForm.offer_amount} onChange={onChange(setOfferForm)} placeholder="Offerta (€)" required />
          <input className="bg-slate-900/60 text-white px-3 py-2 rounded" name="message" value={offerForm.message} onChange={onChange(setOfferForm)} placeholder="Messaggio" />
          <div className="md:col-span-4 flex justify-end"><button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded">Invia</button></div>
        </form>

        <div className="mt-6">
          <h4 className="text-white font-semibold mb-2">Offerte recenti</h4>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {offers.map(o => (
              <div key={o.id} className="bg-slate-900/60 rounded-lg p-3 border border-slate-700">
                <div className="flex items-center justify-between">
                  <h5 className="text-white">Club: {o.club?.name}</h5>
                  <span className="text-xs text-blue-300">€ {new Intl.NumberFormat('it-IT').format(o.offer_amount)}</span>
                </div>
                <p className="text-sm text-blue-200/80">Listing: {o.listing?.id}</p>
                {o.message && <p className="text-xs text-blue-300 mt-1">"{o.message}"</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
