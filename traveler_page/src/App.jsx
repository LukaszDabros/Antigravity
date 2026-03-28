import Navigation from './components/Navigation'
import Hero from './components/Hero'
import Trips from './components/Trips'
import Plans from './components/Plans'
import Gallery from './components/Gallery'
import MapSection from './components/MapSection'
import AddRouteForm from './components/AddRouteForm'
import AdminLogin from './components/AdminLogin'
import { useState } from 'react'

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="w-full min-h-screen bg-slate-50 selection:bg-emerald-200 selection:text-emerald-900 font-sans">
      <Navigation />

      <main>
        <Hero />

        {/* About section placeholder */}
        <section id="about" className="py-24 bg-white text-center px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-sm font-bold text-emerald-500 tracking-wider uppercase mb-2">Cześć!</h2>
            <h3 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">Kim jestem?</h3>
            <p className="text-lg text-slate-600 leading-relaxed font-light">
              Jestem pasjonatem podróży i outdooru. Odkrywam świat w swoim własnym tempie, nagrywając filmy i dokumentując trasy. Znajdziesz tutaj inspiracje do własnych aktywności górskich i wyjazdów w najodleglejsze zakątki globu.
            </p>
          </div>
        </section>

        <Trips />

        <Plans />

        <MapSection />

        <Gallery />
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-semibold text-slate-300 text-xl mb-4">Wędrowiec<span className="text-emerald-500">.</span></p>
          <p>© {new Date().getFullYear()} Wszelkie prawa zastrzeżone.</p>
        </div>
      </footer>

      {/* Floating Action Button - widoczny tylko dla administratora */}
      {isAuthenticated && (
        <button
          onClick={() => setIsFormOpen(true)}
          className="fixed bottom-8 right-8 z-40 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-lg shadow-emerald-500/30 transition-transform hover:scale-110 flex items-center justify-center group"
        >
          <span className="absolute right-full mr-4 bg-slate-900 text-white px-3 py-1 rounded-lg text-sm font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Dodaj Trasę
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </button>
      )}

      {/* Komponent ukrytego logowania */}
      <AdminLogin
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />

      <AddRouteForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
    </div>
  )
}

export default App
