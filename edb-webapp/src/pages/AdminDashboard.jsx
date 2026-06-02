import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePresentations } from '../contexts/PresentationContext';
import { LogOut, Plus, Trash2, Link as LinkIcon, AlertCircle, CheckCircle2, Inbox, List, ExternalLink, Image, Download, Menu as MenuIcon, Edit2, XCircle, ChevronUp, ChevronDown, Crop, AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import { lazy, Suspense } from 'react';
import Cropper from 'react-easy-crop';
import Editor from 'react-simple-wysiwyg';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const {
        presentations,
        studentSubmissions,
        menuLinks,
        customPages,
        addPresentation,
        deletePresentation,
        updatePresentation,
        refresh,
        fetchStudentSubmissions,
        deleteStudentSubmission,
        addMenuLink,
        updateMenuLink,
        deleteMenuLink,
        updateMenuOrder,
        addCustomPage,
        updateCustomPage,
        deleteCustomPage,
        uploadPageImage,
        updatePresentationOrder
    } = usePresentations();

    const [activeTab, setActiveTab] = useState('materials'); // materials, submissions, menu, pages
    const [editMode, setEditMode] = useState(null); // ID of material being edited
    const [formData, setFormData] = useState({ title: '', url: '', category: 'sp', thumbnail_url: '' });
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [useFileUpload, setUseFileUpload] = useState(false);
    const [presFile, setPresFile] = useState(null);
    const [usePresFileUpload, setUsePresFileUpload] = useState(false);
    const [menuData, setMenuData] = useState({ id: null, label: '', url: '', parent_id: '' });
    const [pageData, setPageData] = useState({ id: null, title: '', slug: '', content: '' });
    const [isEditingPage, setIsEditingPage] = useState(false);
    const [isEditingMenu, setIsEditingMenu] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    // Crop State
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [cropImage, setCropImage] = useState(null); // URL of image to crop
    const [isCropping, setIsCropping] = useState(false);

    const [materialFilter, setMaterialFilter] = useState('all'); // all, sp, lo, inne

    const adminPass = sessionStorage.getItem('admin_pass');

    useEffect(() => {
        if (!adminPass) {
            navigate('/admin');
        } else {
            fetchStudentSubmissions(adminPass);
        }
    }, [adminPass, navigate]);

    const handleLogout = () => {
        sessionStorage.removeItem('admin_pass');
        navigate('/');
    };

    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        // Client-side file size validation
        if (presFile && presFile.size > 50 * 1024 * 1024) {
            setMessage({ text: 'Błąd: Plik prezentacji przekracza 50MB. Proszę go skompresować lub użyć linku zewnętrznego.', type: 'danger' });
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        if (thumbnailFile && thumbnailFile.size > 5 * 1024 * 1024) {
            setMessage({ text: 'Błąd: Miniatura jest zbyt duża (limit 5MB).', type: 'danger' });
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setIsSubmitting(true);

        let result;
        if (editMode) {
            result = await updatePresentation(editMode, formData.title, formData.url, formData.category, adminPass, formData.thumbnail_url, thumbnailFile, presFile);
        } else {
            result = await addPresentation(formData.title, formData.url, formData.category, adminPass, formData.thumbnail_url, thumbnailFile, presFile);
        }

        setIsSubmitting(false);

        if (result.success) {
            setMessage({ text: editMode ? 'Pomyślnie zaktualizowano!' : 'Pomyślnie dodano!', type: 'success' });
            setFormData({ title: '', url: '', category: 'sp', thumbnail_url: '' });
            setThumbnailFile(null);
            setUseFileUpload(false);
            setPresFile(null);
            setUsePresFileUpload(false);
            setEditMode(null);
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } else {
            setMessage({ text: result.error || 'Błąd', type: 'danger' });
            if (result.error?.includes('Unauthorized')) {
                setTimeout(handleLogout, 2000);
            }
        }
    };

    const startEdit = (p) => {
        setEditMode(p.id);
        setFormData({
            title: p.title,
            url: p.url,
            category: p.category,
            thumbnail_url: p.thumbnail_url || ''
        });
        setThumbnailFile(null);
        setUseFileUpload(false);
        setPresFile(null);
        setUsePresFileUpload(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditMode(null);
        setFormData({ title: '', url: '', category: 'sp', thumbnail_url: '' });
        setThumbnailFile(null);
        setUseFileUpload(false);
        setPresFile(null);
        setUsePresFileUpload(false);
    };

    const handleMove = async (filteredIndex, direction) => {
        const filtered = presentations.filter(p => materialFilter === 'all' || p.category === materialFilter);
        const targetFilteredIndex = filteredIndex + direction;

        if (targetFilteredIndex < 0 || targetFilteredIndex >= filtered.length) return;

        const item1 = filtered[filteredIndex];
        const item2 = filtered[targetFilteredIndex];

        const newPresentations = [...presentations];
        const gIdx1 = newPresentations.findIndex(p => p.id === item1.id);
        const gIdx2 = newPresentations.findIndex(p => p.id === item2.id);

        if (gIdx1 === -1 || gIdx2 === -1) return;

        // Swap positions in the global list
        [newPresentations[gIdx1], newPresentations[gIdx2]] = [newPresentations[gIdx2], newPresentations[gIdx1]];

        const orderedIds = newPresentations.map(p => p.id);
        const result = await updatePresentationOrder(orderedIds, adminPass);
        if (!result.success) {
            setMessage({ text: 'Błąd synchronizacji kolejności.', type: 'danger' });
        }
    };

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const getCroppedImg = async (imageSrc, pixelCrop) => {
        const image = new window.Image();
        image.src = imageSrc;
        await new Promise((resolve) => { image.onload = resolve; });

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        );

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                resolve(blob);
            }, 'image/jpeg');
        });
    };

    const handleCropSave = async () => {
        try {
            const croppedBlob = await getCroppedImg(cropImage, croppedAreaPixels);
            const file = new File([croppedBlob], "thumbnail.jpg", { type: "image/jpeg" });
            setThumbnailFile(file);
            setIsCropping(false);
            setCropImage(null);
        } catch (e) {
            console.error(e);
        }
    };

    const handleThumbnailSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setCropImage(reader.result);
                setIsCropping(true);
            });
            reader.readAsDataURL(file);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Czy na pewno chcesz usunąć ten link? Ta operacja jest nieodwracalna.')) {
            const result = await deletePresentation(id, adminPass);
            if (result.success) {
                setMessage({ text: 'Usunięto pomyślnie.', type: 'success' });
                setTimeout(() => setMessage({ text: '', type: '' }), 3000);
            }
        }
    };

    const handleDeleteSubmission = async (id) => {
        if (window.confirm('Usunąć to zgłoszenie?')) {
            await deleteStudentSubmission(id, adminPass);
        }
    };

    const handleAddMenu = async (e) => {
        e.preventDefault();
        const res = await addMenuLink(menuData.label, menuData.url, adminPass);
        if (res.success) {
            setMenuData({ label: '', url: '' });
            setMessage({ text: 'Link dodany do menu!', type: 'success' });
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        }
    };

    const handleDeleteMenuLink = async (id) => {
        if (window.confirm('Czy na pewno chcesz usunąć ten link z menu?')) {
            const result = await deleteMenuLink(id, adminPass);
            if (result.success) {
                setMessage({ text: 'Link usunięty z menu.', type: 'success' });
                setTimeout(() => setMessage({ text: '', type: '' }), 3000);
            }
        }
    };

    const handleMoveMenu = async (index, direction) => {
        const newLinks = [...menuLinks];
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= newLinks.length) return;

        [newLinks[index], newLinks[targetIndex]] = [newLinks[targetIndex], newLinks[index]];
        const orderedIds = newLinks.map(l => l.id);
        const result = await updateMenuOrder(orderedIds, adminPass);
        if (!result.success) {
            setMessage({ text: 'Błąd synchronizacji menu.', type: 'danger' });
        }
    };

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Panel Zarządzania</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => { refresh(); fetchStudentSubmissions(adminPass); }} className="btn btn-outline">Odśwież</button>
                    <button onClick={handleLogout} className="btn btn-danger">
                        <LogOut size={18} /> Wyloguj
                    </button>
                </div>
            </div>

            {message.text && (
                <div className="glass-panel" style={{ padding: '1rem', marginBottom: '2rem', borderLeft: `4px solid var(--${message.type === 'success' ? 'success' : 'danger'})`, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {message.type === 'success' ? <CheckCircle2 color="var(--success)" /> : <AlertCircle color="var(--danger)" />}
                    <p>{message.text}</p>
                </div>
            )}

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                <button
                    className={`btn ${activeTab === 'materials' ? 'btn-primary' : 'btn-outline'} `}
                    onClick={() => { setActiveTab('materials'); cancelEdit(); }}
                >
                    <List size={18} /> Materiały
                </button>
                <button
                    className={`btn ${activeTab === 'submissions' ? 'btn-primary' : 'btn-outline'} `}
                    onClick={() => setActiveTab('submissions')}
                >
                    <Inbox size={18} /> Zgłoszenia {studentSubmissions.length > 0 && <span>({studentSubmissions.length})</span>}
                </button>
                <button
                    className={`btn ${activeTab === 'menu' ? 'btn-primary' : 'btn-outline'} `}
                    onClick={() => setActiveTab('menu')}
                >
                    <MenuIcon size={18} /> Menu
                </button>
                <button
                    className={`btn ${activeTab === 'pages' ? 'btn-primary' : 'btn-outline'} `}
                    onClick={() => setActiveTab('pages')}
                >
                    <Plus size={18} /> Strony
                </button>
            </div>

            {activeTab === 'materials' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem', alignItems: 'start' }}>
                    {/* Form Column */}
                    <div className="glass-panel" style={{ padding: '2rem', border: editMode ? '2px solid var(--primary)' : '1px solid var(--glass-border)' }}>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            {editMode ? 'Edytuj Materiał' : 'Dodaj Materiał'}
                            {editMode && <XCircle size={20} style={{ cursor: 'pointer', opacity: 0.6 }} onClick={cancelEdit} />}
                        </h2>
                        <form onSubmit={handleCreateOrUpdate}>
                            <div className="form-group">
                                <label className="form-label">Tytuł</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="np. Pierwsza Pomoc - Resuscytacja"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    Link (URL) lub Plik
                                    <span style={{ fontSize: '0.7rem', cursor: 'pointer', color: 'var(--primary)', textDecoration: 'underline' }} onClick={() => setUsePresFileUpload(!usePresFileUpload)}>
                                        {usePresFileUpload ? 'Użyj linku zamiast pliku' : 'Wgraj plik z dysku'}
                                    </span>
                                </label>
                                {usePresFileUpload ? (
                                    <div className="form-control" style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <input
                                            type="file"
                                            onChange={(e) => setPresFile(e.target.files[0])}
                                            style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}
                                        />
                                        {presFile && (
                                            <div style={{ fontSize: '0.75rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                Wybrano: {presFile.name}
                                                <button type="button" onClick={() => setPresFile(null)} className="btn btn-outline danger" style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}>Usuń</button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <input
                                        type="url"
                                        className="form-control"
                                        placeholder="https://..."
                                        value={formData.url}
                                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                        required={!usePresFileUpload}
                                    />
                                )}
                            </div>
                            <div className="form-group">
                                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    Miniatura
                                    <span style={{ fontSize: '0.7rem', cursor: 'pointer', color: 'var(--primary)', textDecoration: 'underline' }} onClick={() => setUseFileUpload(!useFileUpload)}>
                                        {useFileUpload ? 'Użyj linku zamiast pliku' : 'Wgraj plik z dysku'}
                                    </span>
                                </label>

                                {useFileUpload ? (
                                    <div className="form-control" style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleThumbnailSelect}
                                            style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}
                                        />
                                        {thumbnailFile && (
                                            <div style={{ fontSize: '0.75rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <div style={{ width: '40px', height: '22.5px', background: '#333', borderRadius: '4px', overflow: 'hidden' }}>
                                                    <img src={URL.createObjectURL(thumbnailFile)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>
                                                Wyprzycinano: {thumbnailFile.name}
                                                <button type="button" onClick={() => { setCropImage(URL.createObjectURL(thumbnailFile)); setIsCropping(true); }} className="btn btn-outline" style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}>Docinaj</button>
                                                <button type="button" onClick={() => setThumbnailFile(null)} className="btn btn-outline" style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem', color: 'red' }}>Usuń</button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div style={{ position: 'relative' }}>
                                        <Image size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                                        <input
                                            type="url"
                                            className="form-control"
                                            style={{ paddingLeft: '2.5rem' }}
                                            placeholder="Opcjonalnie: https://..."
                                            value={formData.thumbnail_url}
                                            onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                                        />
                                    </div>
                                )}

                                {(formData.thumbnail_url || thumbnailFile) && (
                                    <div style={{ marginTop: '1rem', width: '100%', height: '100px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                                        <img
                                            src={thumbnailFile ? URL.createObjectURL(thumbnailFile) : formData.thumbnail_url}
                                            alt="Podgląd"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Kategoria</label>
                                <select
                                    className="form-control"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="sp">SP</option>
                                    <option value="lo">LO</option>
                                    <option value="inne">Inne</option>
                                </select>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isSubmitting}>
                                {isSubmitting ? 'Zapisywanie...' : (editMode ? 'Zapisz zmiany' : 'Opublikuj')}
                            </button>
                            {editMode && (
                                <button type="button" onClick={cancelEdit} className="btn btn-outline" style={{ width: '100%', marginTop: '0.5rem' }}>Anuluj</button>
                            )}
                        </form>
                    </div>

                    {/* List Column */}
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Lista ({presentations.length})</h2>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {['all', 'sp', 'lo', 'inne'].map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setMaterialFilter(cat)}
                                        className={`btn btn-outline`}
                                        style={{
                                            padding: '0.3rem 0.8rem',
                                            fontSize: '0.75rem',
                                            background: materialFilter === cat ? 'var(--primary)' : 'transparent',
                                            borderColor: materialFilter === cat ? 'var(--primary)' : 'var(--glass-border)'
                                        }}
                                    >
                                        {cat.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '600px', overflowY: 'auto' }}>
                            {(() => {
                                const filtered = presentations.filter(p => materialFilter === 'all' || p.category === materialFilter);
                                return filtered.map((p, idx) => (
                                    <div key={p.id} style={{ display: 'flex', gap: '1rem', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                            <button onClick={() => handleMove(idx, -1)} disabled={idx === 0} className="btn btn-outline" style={{ padding: '0.2rem', opacity: idx === 0 ? 0.2 : 0.6 }}>
                                                <ChevronUp size={14} />
                                            </button>
                                            <button onClick={() => handleMove(idx, 1)} disabled={idx === filtered.length - 1} className="btn btn-outline" style={{ padding: '0.2rem', opacity: idx === filtered.length - 1 ? 0.2 : 0.6 }}>
                                                <ChevronDown size={14} />
                                            </button>
                                        </div>
                                        <div style={{ flexGrow: 1 }}>
                                            <h3 style={{ fontSize: '1rem', margin: 0 }}>{p.title}</h3>
                                            <span className={`badge badge - ${p.category} `} style={{ fontSize: '0.6rem' }}>{p.category.toUpperCase()}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button onClick={() => startEdit(p)} className="btn btn-outline" style={{ padding: '0.4rem' }} title="Edytuj">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(p.id)} className="btn btn-danger" style={{ padding: '0.4rem' }} title="Usuń">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            })()}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'submissions' && (
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Przesłane Prace ({studentSubmissions.length})</h2>
                    <div className="cards-grid" style={{ marginTop: '0' }}>
                        {studentSubmissions.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)' }}>Brak nowych zgłoszeń.</p>
                        ) : (
                            studentSubmissions.map((sub) => (
                                <div key={sub.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>{sub.student_name}</h3>
                                            <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: sub.school_type === 'nazaret' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(249, 115, 22, 0.2)', color: sub.school_type === 'nazaret' ? '#818cf8' : '#fb923c' }}>
                                                {sub.school_type.toUpperCase()}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            {sub.file_path ? (
                                                <a href={`/ ${sub.file_path} `} download className="btn btn-primary" style={{ fontSize: '0.8rem', flexGrow: 1, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                    <Download size={14} /> Pobierz Plik
                                                </a>
                                            ) : (
                                                <a href={sub.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ fontSize: '0.8rem', flexGrow: 1, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                    <ExternalLink size={14} /> Link zewnętrzny
                                                </a>
                                            )}
                                            <button onClick={() => handleDeleteSubmission(sub.id)} className="btn btn-danger" style={{ padding: '0.4rem' }}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'menu' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem', alignItems: 'start' }}>
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>{isEditingMenu ? 'Edytuj Link' : 'Dodaj Link do Menu'}</h2>
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            let result;
                            if (isEditingMenu) {
                                result = await updateMenuLink(menuData.id, menuData.label, menuData.url, adminPass, menuData.parent_id);
                            } else {
                                result = await addMenuLink(menuData.label, menuData.url, adminPass, menuData.parent_id);
                            }
                            if (result.success) {
                                setMenuData({ id: null, label: '', url: '', parent_id: '' });
                                setIsEditingMenu(false);
                                setMessage({ text: 'Menu zaktualizowane!', type: 'success' });
                            } else {
                                setMessage({ text: result.error, type: 'danger' });
                            }
                        }}>
                            <div className="form-group">
                                <label className="form-label">Nazwa (np. Plan Lekcji)</label>
                                <input type="text" className="form-control" value={menuData.label} onChange={(e) => setMenuData({ ...menuData, label: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Adres URL (może być #/strona/slug)</label>
                                <input type="text" className="form-control" value={menuData.url} onChange={(e) => setMenuData({ ...menuData, url: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Element Nadrzędny (Opcjonalnie)</label>
                                <select className="form-control" value={menuData.parent_id || ''} onChange={(e) => setMenuData({ ...menuData, parent_id: e.target.value })}>
                                    <option value="">Brak (Główne menu)</option>
                                    <optgroup label="Sekcje Systemowe">
                                        <option value="sp">Szkoła Podstawowa (SP)</option>
                                        <option value="lo">Liceum Ogólnokształcące (LO)</option>
                                        <option value="inne">Inne / Wymagania</option>
                                    </optgroup>
                                    <optgroup label="Twoje Rozwijane Listy">
                                        {menuLinks.filter(l => !l.parent_id && !['sp', 'lo', 'inne'].includes(l.url.split('/').pop()) && l.id !== menuData.id).map(parent => (
                                            <option key={parent.id} value={parent.id}>{parent.label}</option>
                                        ))}
                                    </optgroup>
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button type="submit" className="btn btn-primary" style={{ flexGrow: 1 }}>{isEditingMenu ? 'Zapisz' : 'Dodaj'}</button>
                                {isEditingMenu && <button type="button" onClick={() => { setIsEditingMenu(false); setMenuData({ id: null, label: '', url: '', parent_id: '' }); }} className="btn btn-outline">Anuluj</button>}
                            </div>
                        </form>
                    </div>
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Linki w menu ({menuLinks.length})</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {menuLinks.map((link, idx) => (
                                <div key={link.id} style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.05)', padding: '0.75rem 1rem', borderRadius: '8px', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                            <button onClick={() => handleMoveMenu(idx, -1)} disabled={idx === 0} style={{ padding: 0, background: 'none', border: 'none', color: 'var(--text)', opacity: idx === 0 ? 0.2 : 0.6, cursor: idx === 0 ? 'default' : 'pointer' }}><ChevronUp size={14} /></button>
                                            <button onClick={() => handleMoveMenu(idx, 1)} disabled={idx === menuLinks.length - 1} style={{ padding: 0, background: 'none', border: 'none', color: 'var(--text)', opacity: idx === menuLinks.length - 1 ? 0.2 : 0.6, cursor: idx === menuLinks.length - 1 ? 'default' : 'pointer' }}><ChevronDown size={14} /></button>
                                        </div>
                                        <div>
                                            {link.parent_id && <span style={{ opacity: 0.5, marginRight: '0.5rem' }}>↳</span>}
                                            {link.label}
                                            <small style={{ opacity: 0.7, marginLeft: '1rem' }}>({link.url})</small>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button onClick={() => { setMenuData({ id: link.id, label: link.label, url: link.url, parent_id: link.parent_id || '' }); setIsEditingMenu(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="btn btn-outline" style={{ padding: '0.4rem' }}><Edit2 size={14} /></button>
                                        <button onClick={() => handleDeleteMenuLink(link.id, adminPass)} className="btn btn-danger" style={{ padding: '0.4rem' }}><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'pages' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>{isEditingPage ? 'Edytuj Stronę' : 'Nowa Strona'}</h2>
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            setIsGeneratingThumb(true);
                            let result;
                            try {
                                if (isEditingPage) {
                                    result = await updateCustomPage(pageData.id, pageData.title, pageData.slug, pageData.content, adminPass);
                                } else {
                                    result = await addCustomPage(pageData.title, pageData.slug, pageData.content, adminPass);
                                }
                                if (result.success) {
                                    setPageData({ id: null, title: '', slug: '', content: '' });
                                    setIsEditingPage(false);
                                    setMessage({ text: 'Strona zapisana!', type: 'success' });
                                } else {
                                    setMessage({ text: result.error, type: 'danger' });
                                }
                            } catch (err) {
                                setMessage({ text: err.message || 'Wystąpił błąd podczas zapisywania.', type: 'danger' });
                            } finally {
                                setIsGeneratingThumb(false);
                            }
                        }}>
                            <div className="form-group">
                                <label className="form-label">Tytuł Strony</label>
                                <input type="text" className="form-control" value={pageData.title} onChange={(e) => setPageData({ ...pageData, title: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Slug (część adresu URL, np. regulamin)</label>
                                <input type="text" className="form-control" value={pageData.slug} onChange={(e) => setPageData({ ...pageData, slug: e.target.value.toLowerCase().replace(/ /g, '-') })} required />
                                <small style={{ opacity: 0.6 }}>Adres: #/strona/{pageData.slug}</small>
                            </div>
                            <div className="form-group">
                                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <span>Treść Strony (z obrazkami i formatowaniem)</span>
                                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                                            <button type="button" onMouseDown={(e) => { e.preventDefault(); document.execCommand('justifyLeft'); }} style={{ padding: '0.3rem 0.6rem', cursor: 'pointer', background: 'none', border: 'none', color: 'var(--text)', borderRight: '1px solid var(--glass-border)' }} title="Wyrównaj do lewej"><AlignLeft size={14} /></button>
                                            <button type="button" onMouseDown={(e) => { e.preventDefault(); document.execCommand('justifyCenter'); }} style={{ padding: '0.3rem 0.6rem', cursor: 'pointer', background: 'none', border: 'none', color: 'var(--text)', borderRight: '1px solid var(--glass-border)' }} title="Wyśrodkuj"><AlignCenter size={14} /></button>
                                            <button type="button" onMouseDown={(e) => { e.preventDefault(); document.execCommand('justifyRight'); }} style={{ padding: '0.3rem 0.6rem', cursor: 'pointer', background: 'none', border: 'none', color: 'var(--text)', borderRight: '1px solid var(--glass-border)' }} title="Wyrównaj do prawej"><AlignRight size={14} /></button>
                                            <button type="button" onMouseDown={(e) => { e.preventDefault(); document.execCommand('justifyFull'); }} style={{ padding: '0.3rem 0.6rem', cursor: 'pointer', background: 'none', border: 'none', color: 'var(--text)' }} title="Wyjustuj"><AlignJustify size={14} /></button>
                                        </div>
                                        <label className="btn btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.05)', margin: 0 }}>
                                            <Image size={14} /> Dodaj Obraz
                                            <input
                                                type="file"
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                onChange={async (e) => {
                                                    const file = e.target.files[0];
                                                    if (!file) return;

                                                    setMessage({ text: 'Wgrywanie obrazka...', type: 'success' });
                                                    const result = await uploadPageImage(file, adminPass);

                                                    if (result.success) {
                                                        setPageData(prev => ({
                                                            ...prev,
                                                            content: prev.content + `< br /><img src="${result.url}" style="max-width:100%; height:auto; border-radius:8px;" /><br/>`
                                                        }));
                                                        setMessage({ text: 'Obraz dodany do edytora na dole strony!', type: 'success' });
                                                    } else {
                                                        setMessage({ text: result.error, type: 'danger' });
                                                    }
                                                    e.target.value = null; // reset
                                                }}
                                            />
                                        </label>
                                    </div>
                                </label>
                                <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--glass-border)', color: '#000', minHeight: '300px' }}>
                                    <Editor
                                        value={pageData.content}
                                        onChange={(e) => setPageData({ ...pageData, content: e.target.value })}
                                        style={{ height: '400px', backgroundColor: '#fff', color: '#000' }}
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button type="submit" className="btn btn-primary" style={{ flexGrow: 1 }}>Zapisz Stronę</button>
                                {isEditingPage && <button type="button" onClick={() => { setIsEditingPage(false); setPageData({ id: null, title: '', slug: '', content: '' }); }} className="btn btn-outline">Anuluj</button>}
                            </div>
                        </form>
                    </div>
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Twoje Strony ({customPages.length})</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {customPages.map(page => (
                                <div key={page.id} style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', alignItems: 'center' }}>
                                    <div>
                                        <strong>{page.title}</strong>
                                        <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>#/strona/{page.slug}</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button onClick={() => { setPageData(page); setIsEditingPage(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="btn btn-outline" style={{ padding: '0.4rem' }}><Edit2 size={16} /></button>
                                        <button onClick={async () => { if (confirm('Usunąć tę stronę?')) await deleteCustomPage(page.id, adminPass); }} className="btn btn-danger" style={{ padding: '0.4rem' }}><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {/* Cropping Modal */}
            {isCropping && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.9)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                    <div style={{ position: 'relative', width: '100%', maxWidth: '800px', height: '500px', background: '#111', borderRadius: '12px', overflow: 'hidden' }}>
                        <Cropper
                            image={cropImage}
                            crop={crop}
                            zoom={zoom}
                            aspect={16 / 9}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                        />
                    </div>
                    <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', width: '100%', maxWidth: '800px', alignItems: 'center' }}>
                        <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ fontSize: '0.9rem' }}>Zoom:</span>
                            <input
                                type="range"
                                min={1}
                                max={3}
                                step={0.1}
                                value={zoom}
                                onChange={(e) => setZoom(e.target.value)}
                                style={{ flexGrow: 1 }}
                            />
                        </div>
                        <button onClick={() => setIsCropping(false)} className="btn btn-outline">Anuluj</button>
                        <button onClick={handleCropSave} className="btn btn-primary">Zastosuj Przycięcie</button>
                    </div>
                </div>
            )}
        </div>
    );
}
