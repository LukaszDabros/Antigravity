import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

import { API_BASE_URL } from '../config';

export default function AdminAuth() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Check if already logged in (using simple sessionStorage for demo)
    useEffect(() => {
        if (sessionStorage.getItem('admin_pass')) {
            navigate('/admin/dashboard');
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!password) return;

        setIsLoading(true);
        setError('');

        try {
            const url = API_BASE_URL ? `${API_BASE_URL}/login.php` : '/api/login.php';
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            if (!res.ok) {
                if (res.status === 401) {
                    throw new Error('Nieprawidłowe hasło. Spróbuj ponownie.');
                }
                throw new Error('Błąd połączenia z serwerem.');
            }

            const data = await res.json();
            if (data.success) {
                sessionStorage.setItem('admin_pass', password);
                navigate('/admin/dashboard');
            } else {
                throw new Error(data.error || 'Autoryzacja odrzucona.');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(14, 165, 233, 0.1)', color: 'var(--primary)', marginBottom: '1rem' }}>
                        <Lock size={32} />
                    </div>
                    <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Panel Administratora</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Zaloguj się, aby zarządzać bazą plików.</p>
                </div>

                <form onSubmit={handleLogin}>
                    {error && (
                        <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                            {error}
                        </div>
                    )}
                    <div className="form-group">
                        <label className="form-label" htmlFor="password">Hasło dostępu (dla 7m.pl)</label>
                        <input
                            id="password"
                            type="password"
                            className="form-control"
                            placeholder="Wprowadź hasło"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isLoading}>
                        {isLoading ? 'Logowanie...' : 'Zaloguj się'}
                    </button>
                </form>
            </div>
        </div>
    );
}
