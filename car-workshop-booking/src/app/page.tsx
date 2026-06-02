import Link from "next/link";
import { Wrench, Clock, ShieldCheck, MapPin, Phone, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-yellow-500 selection:text-black">

      {/* ===== NAVIGATION ===== */}
      <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex-shrink-0 flex items-center gap-2">
            <span className="text-2xl font-black tracking-tighter text-yellow-500">MOTO<span className="text-white">FIX</span></span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#uslugi" className="text-sm font-medium text-zinc-300 hover:text-white transition">Usługi</a>
            <a href="#o-nas" className="text-sm font-medium text-zinc-300 hover:text-white transition">O nas</a>
            <a href="#kontakt" className="text-sm font-medium text-zinc-300 hover:text-white transition">Kontakt</a>
            <Link
              href="/rezerwacja"
              className="text-sm font-bold text-black bg-yellow-500 hover:bg-yellow-400 px-5 py-2.5 rounded-full transition-all hover:shadow-[0_0_20px_rgba(234,179,8,0.3)]"
            >
              Umów wizytę
            </Link>
          </div>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-yellow-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-sm text-zinc-300 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
            </span>
            Szybkie rezerwacje online
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            Twój Samochód w <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
              Niezawodnych Rękach
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-400 mb-10 leading-relaxed">
            Kompleksowy serwis mechaniczny, na którym możesz polegać.
            Zarezerwuj ekspertyzę w kilka sekund i przestań martwić się usterkami.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/rezerwacja"
              className="w-full sm:w-auto px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-lg rounded-xl transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(234,179,8,0.4)] flex items-center justify-center gap-2"
            >
              Zarezerwuj Termin <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#uslugi"
              className="w-full sm:w-auto px-8 py-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-medium text-lg rounded-xl transition-all flex items-center justify-center"
            >
              Nasze usługi
            </a>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 pt-10 border-t border-zinc-800/50">
            {[
              { label: 'Zadowolonych Klientów', value: '2500+' },
              { label: 'Lat Doświadczenia', value: '15' },
              { label: 'Naprawionych Aut', value: '4500+' },
              { label: 'Ocena w Google', value: '4.9/5' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-3xl md:text-4xl font-black text-white">{stat.value}</span>
                <span className="text-sm text-zinc-500 mt-1 uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES / USLUGA ===== */}
      <section id="uslugi" className="py-24 bg-zinc-950 border-y border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Dlaczego MOTO<span className="text-yellow-500">FIX</span>?</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">Dbamy o najwyższą jakość obsługi, łącząc tradycyjną wiedzę mechaniczną z nowoczesnym sprzętem diagnostycznym.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-black border border-zinc-800 p-8 rounded-3xl hover:border-yellow-500/50 transition-colors group">
              <div className="w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Wrench className="w-7 h-7 text-yellow-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Pełna Diagnostyka</h3>
              <p className="text-zinc-400 leading-relaxed">
                Nowoczesne komputery serwisowe pozwalają nam wykryć 99% ukrytych błędów układu napędowego, nawet tych niestabilnych.
              </p>
            </div>

            <div className="bg-black border border-zinc-800 p-8 rounded-3xl hover:border-yellow-500/50 transition-colors group">
              <div className="w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Clock className="w-7 h-7 text-yellow-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Szybki Czas Naprawy</h3>
              <p className="text-zinc-400 leading-relaxed">
                Dzięki dedykowanym stanowiskom i bezpośredniemu dostępowi do części u dystrybutorów, redukujemy czas serwisu do minimum.
              </p>
            </div>

            <div className="bg-black border border-zinc-800 p-8 rounded-3xl hover:border-yellow-500/50 transition-colors group">
              <div className="w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-7 h-7 text-yellow-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Gwarancja Jakości</h3>
              <p className="text-zinc-400 leading-relaxed">
                Każda przeprowadzona naprawa i użyte podzespoły są objęte rzetelną, roczną gwarancją naszego zakładu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CONTACT / CTA ===== */}
      <section id="kontakt" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Gotowy na wizytę?</h2>
              <p className="text-zinc-400 mb-8 text-lg">
                Kliknij przycisk obok, aby przejść do prostego, dwukrokowego formularza rezerwacji i w chwilę zarezerwować dogodny termin u naszego mechanika.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-4 text-zinc-300">
                  <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-yellow-500" />
                  </div>
                  <span>ul. Mechaniczna 12, 00-111 Warszawa</span>
                </div>
                <div className="flex items-center gap-4 text-zinc-300">
                  <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-yellow-500" />
                  </div>
                  <span>+48 123 456 789</span>
                </div>
              </div>
            </div>

            <div className="flex-none w-full md:w-auto">
              <Link
                href="/rezerwacja"
                className="w-full block text-center px-10 py-6 bg-yellow-500 hover:bg-yellow-400 text-black font-black text-xl rounded-2xl transition-all shadow-[0_10px_40px_rgba(234,179,8,0.2)] hover:shadow-[0_10px_60px_rgba(234,179,8,0.4)] hover:-translate-y-1"
              >
                KALENDARZ WIZYT
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-8 text-center border-t border-zinc-900 text-zinc-600 text-sm">
        <p>&copy; 2026 MOTOFIX. Wszelkie prawa zastrzeżone.</p>
        <div className="mt-4 flex justify-center gap-6">
          <Link href="/admin" className="hover:text-yellow-500 transition">Panel Pracownika</Link>
        </div>
      </footer>
    </div>
  );
}
