import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export default function PageView() {
    const { slug } = useParams();
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPage = async () => {
            setLoading(true);
            try {
                const apiUrl = API_BASE_URL ? `${API_BASE_URL}/get_page.php?slug=${slug}` : `/api/get_page.php?slug=${slug}`;
                const res = await fetch(apiUrl);
                if (!res.ok) throw new Error('Strona nie została znaleziona');
                const data = await res.json();
                setPage(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPage();
    }, [slug]);

    if (loading) return <div className="container animate-fade-in" style={{ padding: '4rem 0', textAlign: 'center' }}>Ładowanie strony...</div>;
    if (error) return <div className="container animate-fade-in" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--danger)' }}>{error}</h2>
    </div>;

    return (
        <div className="animate-fade-in">
            <header className="glass-panel" style={{ padding: '3rem 2rem', marginBottom: '3rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>{page.title}</h1>
                <div style={{ width: '60px', height: '4px', background: 'var(--primary)', margin: '0 auto', borderRadius: '2px' }}></div>
            </header>

            <div className="container">
                <div className="glass-panel" style={{ padding: '3rem', minHeight: '400px', lineHeight: '1.8', display: 'flow-root', wordBreak: 'break-word', overflowX: 'auto' }}>
                    <div className="page-content" dangerouslySetInnerHTML={{ __html: page.content }}></div>
                </div>
            </div>
        </div>
    );
}
