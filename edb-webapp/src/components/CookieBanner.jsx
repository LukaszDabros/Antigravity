import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('edb_cookie_consent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('edb_cookie_consent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(10px)',
            borderTop: '1px solid var(--glass-border)',
            padding: '1rem',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.5)'
        }}>
            <div className="container" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div style={{ flex: 1, minWidth: '280px', fontSize: '0.9rem', lineHeight: '1.4', opacity: 0.9 }}>
                    Ta strona korzysta z ciasteczek (cookies) zgodnie z <Link to="/polityka-prywatnosci" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Polityką Prywatności</Link>.
                    Służą one do prawidłowego działania serwisu oraz celów statystycznych. Dalsze korzystanie ze strony oznacza Twoją zgodę.
                </div>
                <button
                    onClick={handleAccept}
                    className="btn btn-primary"
                    style={{ whiteSpace: 'nowrap', padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}
                >
                    Rozumiem i akceptuję
                </button>
            </div>
        </div>
    );
}
