import { X, Maximize2, ExternalLink } from 'lucide-react';
import { useEffect } from 'react';

export default function PreviewModal({ isOpen, onClose, url, title }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => { document.body.style.overflow = 'auto'; };
    }, [isOpen]);

    if (!isOpen) return null;

    const isVideo = url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com');
    const isPdf = url.toLowerCase().endsWith('.pdf');
    const isDoc = url.toLowerCase().endsWith('.doc') || url.toLowerCase().endsWith('.docx') || url.toLowerCase().endsWith('.ppt') || url.toLowerCase().endsWith('.pptx');

    let embedUrl = url;
    if (url.includes('youtube.com/watch?v=')) {
        embedUrl = url.replace('watch?v=', 'embed/');
    } else if (url.includes('youtu.be/')) {
        embedUrl = url.replace('youtu.be/', 'youtube.com/embed/');
    } else if (url.includes('vimeo.com/')) {
        embedUrl = url.replace('vimeo.com/', 'player.vimeo.com/video/');
    } else if (isPdf || isDoc) {
        // Use Google Docs Viewer for docs and PDFs for better cross-browser compatibility
        embedUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
    }

    return (
        <div className="preview-modal-overlay" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            backdropFilter: 'blur(8px)'
        }} onClick={onClose}>
            <div className="preview-modal-content glass-panel" style={{
                position: 'relative',
                width: '100%',
                maxWidth: '1200px',
                height: '90vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                padding: '0',
                border: '1px solid var(--glass-border)'
            }} onClick={e => e.stopPropagation()}>

                <div style={{
                    padding: '1rem 1.5rem',
                    borderBottom: '1px solid var(--glass-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--glass-bg)'
                }}>
                    <h3 style={{ fontSize: '1.2rem', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '70%' }}>
                        {title}
                    </h3>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', gap: '0.4rem' }}>
                            <ExternalLink size={16} /> Otwórz w kartce
                        </a>
                        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer' }}>
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <div style={{ flexGrow: 1, background: '#000', position: 'relative' }}>
                    <iframe
                        src={embedUrl}
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        title={title}
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
        </div>
    );
}
