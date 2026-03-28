import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { PresentationProvider, usePresentations } from './contexts/PresentationContext';
import { Shield, BookOpen, User, Menu, X, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

import Home from './pages/Home';
import Category from './pages/Category';
import StudentSubmit from './pages/StudentSubmit';
import AdminAuth from './pages/AdminAuth';
import AdminDashboard from './pages/AdminDashboard';
import PageView from './pages/PageView';
import CookieBanner from './components/CookieBanner';
import PrivacyPolicy from './pages/PrivacyPolicy';

const Navbar = () => {
  const { menuLinks } = usePresentations();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLightMode, setIsLightMode] = useState(() => localStorage.getItem('theme') === 'light');


  const isActive = (path) => location.pathname === path ? 'active' : '';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isLightMode) {
      document.body.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark');
    }
  }, [isLightMode]);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`} style={{ position: 'sticky', top: '1rem', zIndex: 50, marginBottom: '2rem' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" className="nav-logo logo" onClick={() => setIsOpen(false)}>
          <Shield size={28} color="var(--primary)" />
          <span>EdB Portal</span>
        </Link>

        {/* Actions (Toggle & Mobile) */}
        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
          <button
            className="theme-toggle"
            onClick={() => setIsLightMode(!isLightMode)}
            style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'transform 0.3s ease' }}
            title={isLightMode ? "Przełącz na tryb nocny" : "Przełącz na tryb jasny"}
          >
            {isLightMode ? <Moon size={22} /> : <Sun size={22} />}
          </button>

          <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div className={`nav-links ${isOpen ? 'active' : ''}`}>
          <Link to="/" className={`nav-link ${isActive('/')}`} onClick={() => setIsOpen(false)}>Główna</Link>

          {/* Hierarchical Menu */}
          {menuLinks.filter(l => !l.parent_id).sort((a, b) => a.order_priority - b.order_priority).map(parent => {
            const children = menuLinks.filter(c => String(c.parent_id) === String(parent.id)).sort((a, b) => a.order_priority - b.order_priority);

            if (children.length > 0) {
              return (
                <div key={parent.id} className="nav-item-dropdown">
                  <span className="nav-link dropdown-toggle">{parent.label}</span>
                  <div className="dropdown-menu">
                    {children.map(child => (
                      <a key={child.id} href={child.url} className="dropdown-item" target={child.url.startsWith('http') ? "_blank" : "_self"} rel="noopener noreferrer" onClick={() => setIsOpen(false)}>
                        {child.label}
                      </a>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <a key={parent.id} href={parent.url} className="nav-link" target={parent.url.startsWith('http') ? "_blank" : "_self"} rel="noopener noreferrer" onClick={() => setIsOpen(false)}>
                {parent.label}
              </a>
            );
          })}

          {/* System Categories with Submenus */}
          {[
            { tag: 'sp', label: 'SP', path: '/kategoria/sp' },
            { tag: 'lo', label: 'LO', path: '/kategoria/lo' },
            { tag: 'inne', label: 'Inne', path: '/kategoria/inne' }
          ].map(sysCat => {
            let children = menuLinks.filter(c => String(c.parent_id) === sysCat.tag).sort((a, b) => a.order_priority - b.order_priority);

            // Inject Privacy Policy to 'Inne' submenu
            if (sysCat.tag === 'inne') {
              children = [...children, { id: 'sys-privacy', label: 'Polityka Prywatności', url: '#/polityka-prywatnosci' }];
            }

            if (children.length > 0) {
              return (
                <div key={sysCat.tag} className="nav-item-dropdown">
                  <span className={`nav-link dropdown-toggle ${isActive(sysCat.path)}`}>
                    <Link to={sysCat.path} onClick={() => setIsOpen(false)} style={{ color: 'inherit', textDecoration: 'none' }}>{sysCat.label}</Link>
                  </span>
                  <div className="dropdown-menu">
                    {children.map(child => (
                      <a key={child.id} href={child.url} className="dropdown-item" target={child.url.startsWith('http') ? "_blank" : "_self"} rel="noopener noreferrer" onClick={() => setIsOpen(false)}>
                        {child.label}
                      </a>
                    ))}
                  </div>
                </div>
              );
            }
            return (
              <Link key={sysCat.tag} to={sysCat.path} className={`nav-link ${isActive(sysCat.path)}`} onClick={() => setIsOpen(false)}>{sysCat.label}</Link>
            );
          })}

          <Link to="/wyślij-plik" className={`nav-link ${isActive('/wyślij-plik')}`} onClick={() => setIsOpen(false)}>Wyślij</Link>

          <Link to="/admin" className={`btn btn-outline ${isActive('/admin')}`} style={{ padding: '0.4rem 0.8rem', marginTop: isOpen ? '0.5rem' : '0' }} onClick={() => setIsOpen(false)}>
            <User size={18} /> Admin
          </Link>
        </div>
      </div>
    </nav>
  );
};

const Footer = () => (
  <footer style={{ marginTop: '5rem', padding: '3rem 0', textAlign: 'center', borderTop: '1px solid var(--glass-border)' }}>
    <div className="container">
      <Link to="/" className="logo" style={{ justifyContent: 'center', marginBottom: '1rem' }}>
        <Shield size={24} color="var(--primary)" />
        <span style={{ fontSize: '1.2rem' }}>EdB Portal</span>
      </Link>
      <p style={{ color: 'var(--text-muted)' }}>Materiały edukacyjne: Edukacja dla Bezpieczeństwa</p>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '1rem' }}>© {new Date().getFullYear()} Łukasz Dąbroś - Wszelkie prawa zastrzeżone.</p>
    </div>
  </footer>
);

function App() {
  return (
    <PresentationProvider>
      <HashRouter>
        <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', padding: '1rem' }}>
          <Navbar />
          <main className="container" style={{ flexGrow: 1, padding: '0', width: '100%' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/kategoria/:slug" element={<Category />} />
              <Route path="/wyślij-plik" element={<StudentSubmit />} />
              <Route path="/admin" element={<AdminAuth />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/strona/:slug" element={<PageView />} />
              <Route path="/polityka-prywatnosci" element={<PrivacyPolicy />} />
            </Routes>
          </main>

          <CookieBanner />
          <Footer />
        </div>
      </HashRouter>
    </PresentationProvider>
  );
}

export default App;
