import { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const PresentationContext = createContext();

export const usePresentations = () => useContext(PresentationContext);

export const PresentationProvider = ({ children }) => {
    const [presentations, setPresentations] = useState([]);
    const [studentSubmissions, setStudentSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [menuLinks, setMenuLinks] = useState([]);
    const [customPages, setCustomPages] = useState([]);

    const fetchPresentations = async () => {
        setLoading(true);
        try {
            // Dodajemy znacznik czasu (t), aby ominąć cache PWA/Service Workera
            const url = API_BASE_URL ? `${API_BASE_URL}/get_presentations.php?t=${Date.now()}` : `/api/get_presentations.php?t=${Date.now()}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error('API fetch failed');
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setPresentations(data || []);
            setError(null);
        } catch (err) {
            console.error("Error fetching data:", err);
            setPresentations([]);
            setError('Błąd połączenia z bazą.');
        } finally {
            setLoading(false);
        }
    };

    const fetchMenu = async () => {
        try {
            const url = API_BASE_URL ? `${API_BASE_URL}/get_menu.php` : '/api/get_menu.php';
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setMenuLinks(data || []);
            }
        } catch (err) { console.error(err); }
    };

    const fetchCustomPages = async () => {
        try {
            const url = API_BASE_URL ? `${API_BASE_URL}/get_custom_pages.php` : '/api/get_custom_pages.php';
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setCustomPages(data || []);
            }
        } catch (err) { console.error(err); }
    };

    const addMenuLink = async (label, url, password, parent_id = null) => {
        try {
            const apiUrl = API_BASE_URL ? `${API_BASE_URL}/add_menu_link.php` : '/api/add_menu_link.php';
            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ label_b64: btoa(unescape(encodeURIComponent(label))), url_b64: btoa(unescape(encodeURIComponent(url))), password, parent_id })
            });
            if (!res.ok) {
                if (res.status === 401) throw new Error('Brak autoryzacji. Zaloguj się ponownie.');
                if (res.status === 413) throw new Error('Przekroczono maksymalny rozmiar danych.');
                throw new Error('Błąd dodawania menu');
            }
            await fetchMenu();
            return { success: true };
        } catch (err) { return { success: false, error: err.message }; }
    };

    const updateMenuLink = async (id, label, url, password, parent_id = null) => {
        try {
            const apiUrl = API_BASE_URL ? `${API_BASE_URL}/update_menu_link.php` : '/api/update_menu_link.php';
            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, label_b64: btoa(unescape(encodeURIComponent(label))), url_b64: btoa(unescape(encodeURIComponent(url))), password, parent_id })
            });
            if (!res.ok) {
                if (res.status === 401) throw new Error('Brak autoryzacji. Zaloguj się ponownie.');
                if (res.status === 413) throw new Error('Przekroczono maksymalny rozmiar danych.');
                throw new Error('Błąd aktualizacji menu');
            }
            await fetchMenu();
            return { success: true };
        } catch (err) { return { success: false, error: err.message }; }
    };

    const deleteMenuLink = async (id, password) => {
        try {
            const apiUrl = API_BASE_URL ? `${API_BASE_URL}/delete_menu_link.php` : '/api/delete_menu_link.php';
            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, password })
            });
            if (!res.ok) {
                if (res.status === 401) throw new Error('Brak autoryzacji. Zaloguj się ponownie.');
                throw new Error('Błąd usuwania menu');
            }
            await fetchMenu();
            return { success: true };
        } catch (err) { return { success: false, error: err.message }; }
    };

    const fetchStudentSubmissions = async (adminPassword) => {
        try {
            const url = API_BASE_URL ? `${API_BASE_URL}/get_student_files.php` : '/api/get_student_files.php';
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: adminPassword })
            });
            if (!res.ok) {
                if (res.status === 401) throw new Error('Brak autoryzacji. Zaloguj się ponownie.');
                throw new Error('Nie udało się pobrać zgłoszeń');
            }
            const data = await res.json();
            setStudentSubmissions(data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const updateMenuOrder = async (ids, password) => {
        try {
            const apiUrl = API_BASE_URL ? `${API_BASE_URL}/update_menu_order.php` : '/api/update_menu_order.php';
            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids, password })
            });
            if (!res.ok) {
                if (res.status === 401) throw new Error('Brak autoryzacji. Zaloguj się ponownie.');
            }
            const data = await res.json();
            if (data.success) {
                await fetchMenu();
                return { success: true };
            }
            return { success: false, error: data.error };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    const addCustomPage = async (title, slug, content, password) => {
        try {
            const apiUrl = API_BASE_URL ? `${API_BASE_URL}/add_custom_page.php` : '/api/add_custom_page.php';
            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title_b64: btoa(unescape(encodeURIComponent(title))), slug, content_b64: btoa(unescape(encodeURIComponent(content))), password })
            });
            if (!res.ok) {
                if (res.status === 401) throw new Error('Brak autoryzacji. Zaloguj się ponownie.');
                if (res.status === 413) throw new Error('Przekroczono maksymalny rozmiar danych. Możliwe, że treść jest zbyt duża.');
                const text = await res.text();
                try {
                    const data = JSON.parse(text);
                    throw new Error(data.error || 'Błąd dodawania strony');
                } catch (e) {
                    throw new Error('Serwer zwrócił nieoczekiwany błąd podczas aktualizacji. Możliwe, że plik jest zbyt duży.');
                }
            }
            await fetchCustomPages();
            return { success: true };
        } catch (err) { return { success: false, error: err.message }; }
    };

    const updateCustomPage = async (id, title, slug, content, password) => {
        try {
            const apiUrl = API_BASE_URL ? `${API_BASE_URL}/update_custom_page.php` : '/api/update_custom_page.php';
            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, title_b64: btoa(unescape(encodeURIComponent(title))), slug, content_b64: btoa(unescape(encodeURIComponent(content))), password })
            });
            if (!res.ok) {
                if (res.status === 401) throw new Error('Brak autoryzacji. Zaloguj się ponownie.');
                if (res.status === 413) throw new Error('Przekroczono maksymalny rozmiar danych. Możliwe, że treść jest zbyt duża.');
                const text = await res.text();
                try {
                    const data = JSON.parse(text);
                    throw new Error(data.error || 'Błąd aktualizacji strony');
                } catch (e) {
                    throw new Error('Serwer zwrócił nieoczekiwany błąd podczas aktualizacji. Możliwe, że plik jest zbyt duży.');
                }
            }
            await fetchCustomPages();
            return { success: true };
        } catch (err) { return { success: false, error: err.message }; }
    };

    const uploadPageImage = async (file, password) => {
        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('password', password);

            const apiUrl = API_BASE_URL ? `${API_BASE_URL}/upload_page_image.php` : '/api/upload_page_image.php';
            const res = await fetch(apiUrl, {
                method: 'POST',
                body: formData
            });

            if (!res.ok) {
                if (res.status === 401) throw new Error('Brak autoryzacji. Zaloguj się ponownie.');
                if (res.status === 413) throw new Error('Przekroczono maksymalny rozmiar danych. Plik jest zbyt duży.');
                const text = await res.text();
                try {
                    const data = JSON.parse(text);
                    throw new Error(data.error || 'Błąd wgrania obrazu');
                } catch (e) {
                    throw new Error('Serwer odrzucił plik. Możliwe przekroczenie limitu wielkości.');
                }
            }
            const data = await res.json();

            return { success: true, url: data.url };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };



    const deleteCustomPage = async (id, password) => {
        try {
            const apiUrl = API_BASE_URL ? `${API_BASE_URL}/delete_custom_page.php` : '/api/delete_custom_page.php';
            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, password })
            });
            if (!res.ok) {
                if (res.status === 401) throw new Error('Brak autoryzacji. Zaloguj się ponownie.');
                throw new Error('Błąd usuwania strony');
            }
            await fetchCustomPages();
            return { success: true };
        } catch (err) { return { success: false, error: err.message }; }
    };

    useEffect(() => {
        fetchPresentations();
        fetchMenu();
        fetchCustomPages();
    }, []);

    const addPresentation = async (title, url, category, password, thumbnail_url = null, thumbnail_file = null, presentation_file = null) => {
        try {
            const formData = new FormData();
            formData.append('title_b64', btoa(unescape(encodeURIComponent(title))));
            formData.append('url_b64', btoa(unescape(encodeURIComponent(url))));
            formData.append('category', category);
            formData.append('password', password);
            if (thumbnail_url) formData.append('thumbnail_url_b64', btoa(unescape(encodeURIComponent(thumbnail_url))));
            if (thumbnail_file) formData.append('thumbnail_file', thumbnail_file);
            if (presentation_file) formData.append('presentation_file', presentation_file);

            const apiUrl = API_BASE_URL ? `${API_BASE_URL}/add_presentation.php` : '/api/add_presentation.php';
            const res = await fetch(apiUrl, {
                method: 'POST',
                body: formData
            });
            if (!res.ok) {
                if (res.status === 413) throw new Error('Wgrywany plik jest zbyt duży (limit 50MB). Zmniejsz go lub udostępnij jako link.');
                const text = await res.text();
                try {
                    const data = JSON.parse(text);
                    throw new Error(data.error || 'Błąd serwera');
                } catch (e) {
                    throw new Error('Serwer zwrócił nieoczekiwany błąd. Możliwe, że plik jest zbyt duży.');
                }
            }
            await fetchPresentations();
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    const submitStudentFile = async (formData) => {
        try {
            const apiUrl = API_BASE_URL ? `${API_BASE_URL}/submit_student_file.php` : '/api/submit_student_file.php';
            const res = await fetch(apiUrl, {
                method: 'POST',
                body: formData // multipart/form-data
            });
            if (!res.ok) {
                if (res.status === 413) throw new Error('Plik zgłoszenia jest zbyt duży (limit 50MB).');
                const text = await res.text();
                try {
                    const data = JSON.parse(text);
                    throw new Error(data.error || 'Błąd przesyłania');
                } catch (e) {
                    throw new Error('Błąd serwera podczas przesyłania. Możliwe przekroczenie limitu wielkości pliku.');
                }
            }
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    const deleteStudentSubmission = async (id, password) => {
        try {
            const apiUrl = API_BASE_URL ? `${API_BASE_URL}/delete_student_file.php` : '/api/delete_student_file.php';
            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, password })
            });
            if (!res.ok) {
                if (res.status === 401) throw new Error('Brak autoryzacji. Zaloguj się ponownie.');
                throw new Error('Błąd usuwania');
            }
            await fetchStudentSubmissions(password);
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    const updatePresentation = async (id, title, url, category, password, thumbnail_url = null, thumbnail_file = null, presentation_file = null) => {
        try {
            const formData = new FormData();
            formData.append('id', id);
            formData.append('title_b64', btoa(unescape(encodeURIComponent(title))));
            formData.append('url_b64', btoa(unescape(encodeURIComponent(url))));
            formData.append('category', category);
            formData.append('password', password);
            if (thumbnail_url) formData.append('thumbnail_url_b64', btoa(unescape(encodeURIComponent(thumbnail_url))));
            if (thumbnail_file) formData.append('thumbnail_file', thumbnail_file);
            if (presentation_file) formData.append('presentation_file', presentation_file);

            const apiUrl = API_BASE_URL ? `${API_BASE_URL}/update_presentation.php` : '/api/update_presentation.php';
            const res = await fetch(apiUrl, {
                method: 'POST',
                body: formData
            });
            if (!res.ok) {
                if (res.status === 413) throw new Error('Wgrywany plik jest zbyt duży (limit 50MB). Zmniejsz go lub udostępnij jako link.');
                const text = await res.text();
                try {
                    const data = JSON.parse(text);
                    throw new Error(data.error || 'Błąd aktualizacji');
                } catch (e) {
                    throw new Error('Serwer zwrócił nieoczekiwany błąd podczas aktualizacji. Możliwe, że plik jest zbyt duży.');
                }
            }
            await fetchPresentations();
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    const updatePresentationOrder = async (orderedIds, password) => {
        try {
            const apiUrl = API_BASE_URL ? `${API_BASE_URL}/update_presentation_order.php` : '/api/update_presentation_order.php';
            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderedIds, password })
            });
            if (!res.ok) {
                if (res.status === 401) throw new Error('Brak autoryzacji. Zaloguj się ponownie.');
                throw new Error('Błąd zmiany kolejności');
            }
            await fetchPresentations();
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    const deletePresentation = async (id, password) => {
        try {
            const apiUrl = API_BASE_URL ? `${API_BASE_URL}/delete_presentation.php` : '/api/delete_presentation.php';
            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id, password })
            });

            if (!res.ok) {
                if (res.status === 401) throw new Error('Brak autoryzacji. Zaloguj się ponownie.');
                throw new Error('Nieprawidłowe hasło lub błąd serwera');
            }

            await fetchPresentations();
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    return (
        <PresentationContext.Provider value={{
            presentations,
            studentSubmissions,
            menuLinks,
            customPages,
            loading,
            error,
            addPresentation,
            deletePresentation,
            updatePresentation,
            submitStudentFile,
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
            updatePresentationOrder,
            fetchCustomPages,
            refresh: fetchPresentations
        }}>
            {children}
        </PresentationContext.Provider>
    );
};
