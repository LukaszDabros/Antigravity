import { Link } from 'react-router-dom';
import { Shield, BookOpen, FileText, ChevronRight } from 'lucide-react';

const homeCategories = [
    {
        title: 'Szkoła Podstawowa',
        description: 'Postawy pierwszej pomocy, bezpieczeństwo w cyberprzestrzeni oraz zachowanie w sytuacjach kryzysowych. Wiedza ratująca życie dla młodszych klas.',
        icon: <Shield size={32} className="mb-4" color="var(--primary)" />,
        path: '/kategoria/sp',
        badge: 'SP'
    },
    {
        title: 'Liceum Ogólnokształcące',
        description: 'Zarządzanie kryzysowe, zaawansowana pierwsza pomoc (RKO), obrona cywilna i survival. Przygotowanie do wyzwań współczesnego świata.',
        icon: <BookOpen size={32} className="mb-4" color="#fb923c" />,
        path: '/kategoria/lo',
        badge: 'LO'
    },
    {
        title: 'Wymagania i Kryteria',
        description: 'Dokumenty, kryteria oceniania, regulaminy strzelnicy i dodatkowe materiały edukacyjne (podręczniki, linki zewnętrzne).',
        icon: <FileText size={32} className="mb-4" color="var(--secondary)" />,
        path: '/kategoria/inne',
        badge: 'INNE'
    }
];

export default function Home() {
    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <section
                style={{
                    position: 'relative',
                    padding: '5.5rem 2rem',
                    textAlign: 'center',
                    marginBottom: '3rem',
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px -10px rgba(195, 26, 26, 0.3)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-lg)'
                }}
            >
                {/* Blurred Background Image */}
                <div style={{
                    position: 'absolute',
                    top: '-10px', right: '-10px', bottom: '-10px', left: '-10px',
                    backgroundImage: 'url(/hero_banner_v4.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(4px)',
                    zIndex: 0
                }} />
                {/* Gradient Overlay */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.95))',
                    zIndex: 1
                }} />

                {/* Content */}
                <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px', margin: '0 auto' }}>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1rem', color: '#fff', lineHeight: '1.2' }}>
                        Edukacja dla Bezpieczeństwa
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '1rem', fontWeight: '500' }}>
                        Obrona cywilna, pierwsza pomoc, zarządzanie w sytuacjach kryzysowych.<br />Bądź przygotowany na każde wyzwanie.
                    </p>
                </div>
            </section>

            {/* Categories Section */}
            <section>
                <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: '4px', height: '1.5rem', background: 'var(--primary)', borderRadius: '2px', display: 'inline-block' }}></span>
                    Wybierz poziom edukacji
                </h2>

                <div className="cards-grid">
                    {homeCategories.map((category, index) => (
                        <Link
                            to={category.path}
                            key={index}
                            className={`resource-card delay-${(index + 1) * 100} animate-fade-in`}
                            style={{ textDecoration: 'none' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                {category.icon}
                                <span className={`badge badge-${category.badge.toLowerCase()}`}>{category.badge}</span>
                            </div>
                            <h3>{category.title}</h3>
                            <p>{category.description}</p>
                            <div className="card-footer">
                                <span style={{ color: 'var(--primary)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    Przeglądaj <ChevronRight size={16} />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
