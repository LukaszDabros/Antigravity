import Link from 'next/link';

export default function AdminSidebar() {
    return (
        <aside className="w-64 bg-zinc-900 border-r border-zinc-800 text-zinc-100 flex flex-col h-screen h-full sticky top-0">
            <div className="p-6 border-b border-zinc-800">
                <h2 className="text-xl font-bold text-yellow-500 tracking-wider">MOTO<span className="text-white">FIX</span></h2>
                <p className="text-xs text-zinc-400 mt-1 uppercase tracking-widest">Admin Panel</p>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                <Link
                    href="/admin"
                    className="block px-4 py-3 rounded-lg hover:bg-zinc-800 transition-colors text-sm font-medium"
                >
                    Wizyty
                </Link>
                <Link
                    href="/admin/calendar"
                    className="block px-4 py-3 rounded-lg hover:bg-zinc-800 transition-colors text-sm font-medium"
                >
                    Zarządzanie Kalendarzem
                </Link>
                <Link
                    href="/"
                    className="block px-4 py-3 rounded-lg hover:bg-zinc-800 transition-colors text-sm font-medium mt-8 text-zinc-400 hover:text-white"
                >
                    ← Wróć do strony głównej
                </Link>
            </nav>

            <div className="p-4 border-t border-zinc-800">
                <button className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm transition-colors">
                    Wyloguj
                </button>
            </div>
        </aside>
    );
}
