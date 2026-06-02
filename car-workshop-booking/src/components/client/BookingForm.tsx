'use client';

import { useState, useEffect } from 'react';
import { getAvailableTimeSlots } from '@/lib/calendar/timeSlots';
import { format, addDays } from 'date-fns';
import { fetchBookedSlotsForDate, fetchWorkshopSettings, createAppointment } from '@/lib/firebase/db';

export default function BookingForm() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        clientName: '',
        phone: '',
        carModel: '',
        issueDescription: '',
        date: '',
        time: ''
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

    const [bookedSlots, setBookedSlots] = useState<string[]>([]);
    const [blockedDates, setBlockedDates] = useState<string[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);

    // Initial load for Workshop Settings (blocked dates)
    useEffect(() => {
        async function loadSettings() {
            try {
                const settings = await fetchWorkshopSettings();
                if (settings) {
                    setBlockedDates(settings.blockedDates);
                }
            } catch (error) {
                console.error("Firebase is offline or not configured yet.", error);
                // Fallback do pustej tablicy (już jest domyślnie, ale blokujemy crash aplikacji)
            }
        }
        loadSettings();
    }, []);

    // Load available slots when Date changes
    useEffect(() => {
        async function loadSlots() {
            if (!formData.date) return;
            setLoadingSlots(true);
            try {
                const slots = await fetchBookedSlotsForDate(formData.date);
                setBookedSlots(slots);
            } catch (error) {
                console.error("Failed to load slots", error);
            } finally {
                setLoadingSlots(false);
            }
        }
        loadSlots();
    }, [formData.date]);

    const availableSlots = formData.date
        ? getAvailableTimeSlots(formData.date, bookedSlots, blockedDates)
        : [];

    // Wygeneruj 14 kolejnych dni dla kalendarza
    const upcomingDays = Array.from({ length: 14 }).map((_, i) => {
        const d = addDays(new Date(), i);
        return format(d, 'yyyy-MM-dd');
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleDateSelect = (dateStr: string) => {
        setFormData(prev => ({ ...prev, date: dateStr, time: '' })); // Kasujemy czas przy zmianie daty
    };

    const handleTimeSelect = (timeStr: string) => {
        setFormData(prev => ({ ...prev, time: timeStr }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        try {
            await createAppointment({
                clientName: formData.clientName,
                phone: formData.phone,
                carModel: formData.carModel,
                issueDescription: formData.issueDescription,
                date: formData.date,
                time: formData.time
            });
            setStatus('success');
        } catch (error) {
            console.error("Error creating appointment:", error);
            setStatus('idle');
            alert("Wystąpił błąd podczas rezerwacji. Spróbuj powonie.");
        }
    };

    if (status === 'success') {
        return (
            <div className="max-w-xl mx-auto p-12 bg-zinc-900 border border-zinc-800 rounded-2xl text-center">
                <div className="w-20 h-20 bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-800">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Wizyta Zgłoszona!</h2>
                <p className="text-zinc-400 text-lg">
                    Oczekujemy na potwierdzenie przez mechanika. Powiadomimy Cię wkrótce o akceptacji terminu.
                </p>
                <button
                    onClick={() => { setStatus('idle'); setStep(1); setFormData({ clientName: '', phone: '', carModel: '', issueDescription: '', date: '', time: '' }); }}
                    className="mt-8 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition"
                >
                    Wróć na stronę główną
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex bg-black border-b border-zinc-800">
                <div className={`flex-1 p-4 text-center font-medium border-b-2 ${step >= 1 ? 'border-yellow-500 text-yellow-500' : 'border-transparent text-zinc-500'}`}>
                    1. Wybierz termin
                </div>
                <div className={`flex-1 p-4 text-center font-medium border-b-2 ${step >= 2 ? 'border-yellow-500 text-yellow-500' : 'border-transparent text-zinc-500'}`}>
                    2. Twoje dane
                </div>
            </div>

            <div className="p-8">
                {step === 1 && (
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-6">Wybierz datę i godzinę</h2>

                        <div className="mb-8">
                            <label className="block text-sm font-medium text-zinc-400 mb-3 uppercase tracking-wider">Dostępne Dni (kolejne 14 dni)</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                                {upcomingDays.map(dateStr => (
                                    <button
                                        key={dateStr}
                                        onClick={() => handleDateSelect(dateStr)}
                                        className={`p-3 text-center rounded-lg border transition-all ${formData.date === dateStr
                                            ? 'bg-yellow-500 border-yellow-400 text-black font-bold'
                                            : 'bg-black border-zinc-800 text-zinc-300 hover:border-zinc-500'
                                            }`}
                                    >
                                        <div className="text-xs text-zinc-500">{format(new Date(dateStr), 'MMM')}</div>
                                        <div className="text-xl">{format(new Date(dateStr), 'dd')}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {formData.date && (
                            <div className="min-h-[120px]">
                                <label className="block text-sm font-medium text-zinc-400 mb-3 uppercase tracking-wider">Dostępne Godziny</label>
                                {loadingSlots ? (
                                    <div className="flex justify-center items-center py-6 text-yellow-500">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Wczytywanie...
                                    </div>
                                ) : availableSlots.length > 0 ? (
                                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                        {availableSlots.map(timeStr => (
                                            <button
                                                key={timeStr}
                                                onClick={() => handleTimeSelect(timeStr)}
                                                className={`py-3 px-2 text-center rounded-lg font-medium transition-all ${formData.time === timeStr
                                                    ? 'bg-yellow-500 text-black ring-2 ring-yellow-400 ring-offset-2 ring-offset-zinc-900'
                                                    : 'bg-black text-white hover:bg-zinc-800'
                                                    }`}
                                            >
                                                {timeStr}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-6 text-center bg-black/50 border border-red-900/30 rounded-lg text-red-400">
                                        Brak wolnych terminów w wybranym dniu lub dzień wolny od pracy. Proszę wybrać inną datę.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="mt-10 flex justify-end tracking-wider">
                            <button
                                onClick={() => setStep(2)}
                                disabled={!formData.date || !formData.time}
                                className="px-8 py-3 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 disabled:bg-zinc-700 disabled:text-zinc-500 text-black font-bold rounded-lg transition"
                            >
                                Dalej →
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <form onSubmit={handleSubmit}>
                        <h2 className="text-2xl font-bold text-white mb-6">Szczegóły zgłoszenia</h2>

                        <div className="bg-black/50 p-4 rounded-lg flex gap-4 items-center mb-8 border border-zinc-800">
                            <div className="p-3 bg-zinc-900 rounded-md border border-zinc-800">
                                <p className="text-xs text-zinc-500 uppercase tracking-wider">Wybrany Termin</p>
                                <p className="text-lg font-bold text-yellow-500">{formData.date} <span className="text-white text-base font-normal">o</span> {formData.time}</p>
                            </div>
                            <button type="button" onClick={() => setStep(1)} className="text-sm text-zinc-400 hover:text-white underline">Zmień</button>
                        </div>

                        <div className="grid gap-6">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">Imię i nazwisko</label>
                                <input
                                    required
                                    type="text"
                                    name="clientName"
                                    value={formData.clientName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
                                    placeholder="Jan Kowalski"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">Numer telefonu</label>
                                    <input
                                        required
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
                                        placeholder="123 456 789"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">Model auta</label>
                                    <input
                                        required
                                        type="text"
                                        name="carModel"
                                        value={formData.carModel}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
                                        placeholder="Wpisz markę i model (np. Audi A4)"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">Opis usterki / Zakres usług</label>
                                <textarea
                                    required
                                    name="issueDescription"
                                    value={formData.issueDescription}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors resize-none"
                                    placeholder="Opisz krótko z czym przyjeżdżasz..."
                                />
                            </div>
                        </div>

                        <div className="mt-10 flex justify-between items-center tracking-wider">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="px-6 py-3 text-zinc-400 hover:text-white transition"
                            >
                                ← Wróć
                            </button>
                            <button
                                type="submit"
                                disabled={status === 'submitting'}
                                className="px-8 py-3 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-70 text-black font-bold rounded-lg transition flex items-center gap-2"
                            >
                                {status === 'submitting' ? 'Wysyłanie...' : 'Potwierdź rezerwację'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
