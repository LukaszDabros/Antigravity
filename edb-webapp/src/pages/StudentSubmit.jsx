import { useState } from 'react';
import { usePresentations } from '../contexts/PresentationContext';
import { Upload, CheckCircle2, AlertCircle, Link as LinkIcon, User } from 'lucide-react';

export default function StudentSubmit() {
    const { submitStudentFile } = usePresentations();
    const [formData, setFormData] = useState({ name: '', url: '', school: 'prezentki', file: null });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage({ text: '', type: '' });

        const data = new FormData();
        data.append('student_name', formData.name);
        data.append('school_type', formData.school);

        if (formData.file) {
            data.append('file', formData.file);
        } else {
            data.append('url', formData.url);
        }

        const result = await submitStudentFile(data);

        setIsSubmitting(false);

        if (result.success) {
            setMessage({ text: 'Gotowe! Twoja praca została przesłana.', type: 'success' });
            setFormData({ name: '', url: '', school: 'prezentki', file: null });
        } else {
            setMessage({ text: result.error || 'Wystąpił błąd podczas wysyłania.', type: 'danger' });
        }
    };

    return (
        <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh', padding: '1rem' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(249, 115, 22, 0.1)', color: 'var(--primary)', marginBottom: '1rem' }}>
                        <Upload size={32} />
                    </div>
                    <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Prześlij swoją pracę</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Maksymalny rozmiar pliku to 50MB.</p>
                </div>

                {message.text && (
                    <div style={{ padding: '1rem', marginBottom: '1.5rem', borderRadius: 'var(--radius-md)', background: `rgba(${message.type === 'success' ? '16, 185, 129' : '239, 68, 68'}, 0.1)`, color: `var(--${message.type === 'success' ? 'success' : 'danger'})`, border: `1px solid var(--${message.type === 'success' ? 'success' : 'danger'})`, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                        <span style={{ fontSize: '0.9rem' }}>{message.text}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Imię i Nazwisko</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Jan Kowalski"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Wybierz Szkołę</label>
                        <select
                            className="form-control"
                            value={formData.school}
                            onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                        >
                            <option value="prezentki">Prezentki</option>
                            <option value="nazaret">Nazaret</option>
                        </select>
                    </div>

                    <div className="form-group" style={{ border: '1px dashed rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px' }}>
                        <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Załącz Plik (Prezentacja, PDF)</label>
                        <input
                            type="file"
                            onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                            style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}
                        />
                    </div>

                    <div style={{ textAlign: 'center', margin: '0.5rem 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>— LUB —</div>

                    <div className="form-group">
                        <label className="form-label">Link do prezentacji (jeśli plik jest za duży)</label>
                        <input
                            type="url"
                            className="form-control"
                            placeholder="https://..."
                            value={formData.url}
                            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }} disabled={isSubmitting}>
                        {isSubmitting ? 'Przesyłanie...' : 'Wyślij pracę'}
                    </button>
                </form>
            </div>
        </div>
    );
}
