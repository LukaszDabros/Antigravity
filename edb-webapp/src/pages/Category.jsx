import { useParams, Link } from 'react-router-dom';
import { usePresentations } from '../contexts/PresentationContext';
import { FileText, ExternalLink, ChevronLeft, AlertCircle, Search, Play, Eye } from 'lucide-react';
import { useState } from 'react';
import PreviewModal from '../components/PreviewModal';

const categoryTitles = {
    'sp': 'Szkoła Podstawowa',
    'lo': 'Liceum Ogólnokształcące',
    'inne': 'Wymagania i inne materiały'
};

const categoryDescriptions = {
    'sp': 'Strefa ucznia Szkoły Podstawowej. Znajdziesz tutaj prezentacje z lekcji.',
    'lo': 'Strefa ucznia Liceum Ogólnokształcącego. Rozszerzone materiały do nauki na wyższym poziomie.',
    'inne': 'Kryteria oceny, regulaminy oraz materiały udostępniane przez zewnętrzne instytucje.'
};

export default function Category() {
    const { slug } = useParams();
    const { presentations, loading, error } = usePresentations();
    const [searchQuery, setSearchQuery] = useState('');
    const [previewItem, setPreviewItem] = useState(null);

    if (!['sp', 'lo', 'inne'].includes(slug)) {
        return (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                <h2>Nie znaleziono kategorii</h2>
                <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>Wróć na stronę główną</Link>
            </div>
        );
    }

    const categoryPresentations = presentations.filter(p =>
        p.category === slug &&
        (p.title.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="animate-fade-in">
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '1.5rem', fontWeight: '500', transition: 'color 0.2s' }} className="hover:text-white">
                <ChevronLeft size={20} /> Wróć do menu
            </Link>

            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', borderLeft: `4px solid var(--${slug === 'sp' ? 'primary' : slug === 'lo' ? 'secondary' : 'success'})`, display: 'flex', flexDirection: 'column', gap: '1.5rem', mdDirection: 'row', mdAlignItems: 'center', mdJustifyContent: 'space-between' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{categoryTitles[slug]}</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{categoryDescriptions[slug]}</p>
                </div>

                <div className="search-container" style={{ position: 'relative', maxWidth: '400px', width: '100%' }}>
                    <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Szukaj materiału..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.8rem 1rem 0.8rem 3rem',
                            background: 'var(--glass-bg)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '12px',
                            color: 'var(--text)',
                            fontSize: '1rem',
                            outline: 'none',
                            transition: 'border-color 0.2s'
                        }}
                    />
                </div>
            </div>

            {loading && (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <div style={{ width: '40px', height: '40px', border: '3px solid var(--glass-border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
                    <p style={{ color: 'var(--text-muted)' }}>Ładowanie materiałów...</p>
                </div>
            )}

            {!loading && error && (
                <div className="glass-panel" style={{ padding: '1rem 1.5rem', borderLeft: '4px solid var(--danger)', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <AlertCircle color="var(--danger)" />
                    <p style={{ color: 'var(--danger)' }}>Błąd serwera. Wyświetlam dane testowe.</p>
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}} />

            <PreviewModal
                isOpen={!!previewItem}
                onClose={() => setPreviewItem(null)}
                url={previewItem?.url || ''}
                title={previewItem?.title || ''}
            />

            {!loading && categoryPresentations.length === 0 ? (
                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <FileText size={48} style={{ opacity: 0.5, margin: '0 auto 1rem' }} />
                    <h3>Brak materiałów w tej kategorii</h3>
                    <p>Nauczyciel jeszcze nie udostępnił żadnych linków dla tego poziomu.</p>
                </div>
            ) : (
                <div className="cards-grid">
                    {categoryPresentations.map((p) => (
                        <div key={p.id} className="glass-panel animate-fade-in" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                            {p.thumbnail_url && (
                                <a href={p.url} target={p.url.startsWith('http') ? "_blank" : "_self"} rel="noopener noreferrer" style={{ display: 'block', width: '100%', aspectRatio: '16/9', overflow: 'hidden', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    <img src={p.thumbnail_url} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
                                </a>
                            )}
                            <div style={{ padding: '1.5rem', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {p.url.includes('youtube') || p.url.includes('vimeo') ? <Play size={18} color="var(--primary)" /> : <FileText size={18} color="var(--primary)" />}
                                        {p.title}
                                    </h3>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                                        Dodano: {new Date(p.created_at).toLocaleDateString('pl-PL')}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => setPreviewItem(p)}
                                        className="btn btn-primary"
                                        style={{ flexGrow: 1, gap: '0.5rem', background: 'rgba(255,255,255,0.1)', color: 'var(--text)', border: '1px solid var(--glass-border)', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                                    >
                                        <Eye size={16} /> Podgląd
                                    </button>
                                    <a href={p.url} target={p.url.startsWith('http') ? "_blank" : "_self"} rel="noopener noreferrer" className="btn btn-primary" style={{ flexGrow: 1, gap: '0.5rem', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                                        Otwórz {p.url.startsWith('http') && <ExternalLink size={16} />}
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
