import PlayerManager from './components/PlayerManager'
import ClubAndMarket from './components/ClubAndMarket'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>

      <div className="relative min-h-screen p-6 md:p-10">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <img src="/flame-icon.svg" alt="logo" className="w-10 h-10" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Calciomercato Social</h1>
              <p className="text-sm text-blue-200/80">Profili per giocatori e club, con un vero mercato trasferimenti</p>
            </div>
          </div>
          <a href="/src/Test.jsx" className="text-blue-300 hover:text-white text-sm underline/50">Test backend</a>
        </header>

        <main className="grid lg:grid-cols-2 gap-8">
          <section>
            <PlayerManager />
          </section>
          <section>
            <ClubAndMarket />
          </section>
        </main>

        <footer className="mt-10 text-center text-blue-300/60 text-sm">
          Usa gli ID mostrati dopo la creazione per collegare player/club nei listing e nelle offerte.
        </footer>
      </div>
    </div>
  )
}

export default App
