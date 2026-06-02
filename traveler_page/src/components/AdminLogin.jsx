import React, { useState, useEffect } from 'react';
import { Lock, Unlock, X } from 'lucide-react';

// Domyślne hasło, które możemy później przenieść do zmiennych środowiskowych (.env)
const ADMIN_PASSWORD = "koniu";

const AdminLogin = ({ isAuthenticated, setIsAuthenticated }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Sprawdź przy starcie komponentu czy użytkownik już jest zalogowany
    useEffect(() => {
        const savedAuth = localStorage.getItem('traveler_admin_auth');
        if (savedAuth === 'true') {
            setIsAuthenticated(true);
        }
    }, [setIsAuthenticated]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            localStorage.setItem('traveler_admin_auth', 'true');
            setIsOpen(false);
            setPassword('');
            setError('');
        } else {
            setError('Nieprawidłowe hasło!');
            setPassword('');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('traveler_admin_auth');
    };

    return (
        <>
            {/* Przycisk - Kłódka w prawym dolnym rogu (ukryta w strukturze stopki wizualnie) */}
            <button
                onClick={() => isAuthenticated ? handleLogout() : setIsOpen(true)}
                className={`fixed bottom-4 left-4 z-40 p-3 rounded-full shadow-md transition-all ${isAuthenticated
                        ? 'bg-slate-800 text-emerald-400 hover:bg-slate-700'
                        : 'bg-white text-slate-400 hover:text-slate-600 hover:bg-slate-50 opacity-50 hover:opacity-100'
                    }`}
                title={isAuthenticated ? 'Wyloguj' : 'Zaloguj jako Admin'}
            >
                {isAuthenticated ? <Unlock size={18} /> : <Lock size={18} />}
            </button>

            {/* Modal Logowania */}
            {isOpen && !isAuthenticated && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    ></div>

                    <div className="relative bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden p-8 z-10 text-center animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                        >
                            <X size={20} />
                        </button>

                        <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-700">
                            <Lock size={24} />
                        </div>

                        <h3 className="text-2xl font-black text-slate-900 mb-2">Strefa Prywatna</h3>
                        <p className="text-sm text-slate-500 mb-6">Podaj hasło, odblokować panel zarządzania trasami.</p>

                        <form onSubmit={handleSubmit}>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Hasło..."
                                autoFocus
                                className={`w-full px-4 py-3 rounded-xl border ${error ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:ring-emerald-500 focus:border-emerald-500'} focus:ring-2 transition-all outline-none text-center text-slate-700 bg-slate-50 focus:bg-white mb-4`}
                            />

                            {error && (
                                <p className="text-red-500 text-sm font-medium mb-4">{error}</p>
                            )}

                            <button
                                type="submit"
                                className="w-full py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors"
                            >
                                Odblokuj
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminLogin;
