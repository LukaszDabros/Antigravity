'use client';

import { useState, useEffect } from 'react';
import { WorkshopSettings } from '@/types';
import { fetchWorkshopSettings, addBlockedDate, removeBlockedDate, saveWorkshopSettings } from '@/lib/firebase/db';

export default function AdminCalendarManager() {
    const [settings, setSettings] = useState<WorkshopSettings>({
        id: 'workshop_settings',
        blockedDates: [],
        blockedTimeSlots: [],
        workingHours: {
            start: '08:00',
            end: '16:30',
            slotDurationMinutes: 30
        }
    });
    const [loading, setLoading] = useState(true);
    const [newBlockedDate, setNewBlockedDate] = useState('');

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const data = await fetchWorkshopSettings();
                if (data) {
                    setSettings(data);
                } else {
                    // Initialize if not exists
                    await saveWorkshopSettings(settings);
                }
            } catch (error) {
                console.error("Error loading settings:", error);
            } finally {
                setLoading(false);
            }
        };
        loadSettings();
    }, []);

    const handleAddBlockedDate = async () => {
        if (!newBlockedDate || settings.blockedDates.includes(newBlockedDate)) return;

        // Optimistic UI updates
        setSettings(prev => ({
            ...prev,
            blockedDates: [...prev.blockedDates, newBlockedDate].sort()
        }));
        setNewBlockedDate('');

        try {
            await addBlockedDate(newBlockedDate);
        } catch (error) {
            console.error("Error adding blocked date", error);
        }
    };

    const handleRemoveBlockedDate = async (dateToRemove: string) => {
        setSettings(prev => ({
            ...prev,
            blockedDates: prev.blockedDates.filter(d => d !== dateToRemove)
        }));

        try {
            await removeBlockedDate(dateToRemove);
        } catch (error) {
            console.error("Error removing blocked date", error);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight">Kalendarz</h1>
                <p className="text-zinc-400 mt-1">Blokuj wybrane dni wolne (urlopy, święta).</p>
            </div>

            {loading ? (
                <div className="text-center py-12 text-zinc-500">Wczytywanie ustawień...</div>
            ) : (
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Zarządzanie dniami wolnymi */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500 block"></span>
                            Zablokowane dni (Urlop/Zamknięte)
                        </h2>

                        <div className="flex gap-2 mb-6">
                            <input
                                type="date"
                                value={newBlockedDate}
                                onChange={(e) => setNewBlockedDate(e.target.value)}
                                className="px-4 py-2 bg-black border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 w-full"
                            />
                            <button
                                onClick={handleAddBlockedDate}
                                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg transition whitespace-nowrap"
                            >
                                Dodaj dzień
                            </button>
                        </div>

                        <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                            {settings.blockedDates.length === 0 ? (
                                <p className="text-zinc-500 text-sm">Brak zablokowanych dni w systemie.</p>
                            ) : (
                                settings.blockedDates.map(date => (
                                    <div key={date} className="flex justify-between items-center bg-black border border-zinc-800 p-3 rounded-lg group">
                                        <span className="text-white font-medium">{date}</span>
                                        <button
                                            onClick={() => handleRemoveBlockedDate(date)}
                                            className="text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            Usuń
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Informacje o konfiguracji z Firebase w przyszłości */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Godziny pracy</h2>
                        <div className="space-y-4">
                            <div className="bg-black border border-zinc-800 p-4 rounded-lg">
                                <div className="flex justify-between border-b border-zinc-800 pb-2 mb-2">
                                    <span className="text-zinc-400">Początek pracy</span>
                                    <span className="text-white font-medium">{settings.workingHours.start}</span>
                                </div>
                                <div className="flex justify-between border-b border-zinc-800 pb-2 mb-2">
                                    <span className="text-zinc-400">Koniec obsługi</span>
                                    <span className="text-white font-medium">{settings.workingHours.end}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-400">Czas jednej wizyty</span>
                                    <span className="text-white font-medium">{settings.workingHours.slotDurationMinutes} min</span>
                                </div>
                            </div>
                            <p className="text-xs text-zinc-500 leading-relaxed">
                                Powyższe parametry konfiguracji (początek i koniec pracy oraz długość pojedynczego slotu) są globalne dla warsztatu. Ustawienia te warunkują generowanie dostępnych godzin w formularzu rezerwacyjnym klienta.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
