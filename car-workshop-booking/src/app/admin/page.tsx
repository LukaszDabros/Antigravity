'use client';

import { useState, useEffect } from 'react';
import { Appointment } from '@/types';
import { fetchAppointments, updateAppointmentStatus } from '@/lib/firebase/db';

export default function AdminDashboard() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAppointments = async () => {
            try {
                const data = await fetchAppointments();
                setAppointments(data);
            } catch (error) {
                console.error("Error fetching appointments:", error);
            } finally {
                setLoading(false);
            }
        };
        loadAppointments();
    }, []);

    const handleStatusChange = async (id: string, newStatus: Appointment['status']) => {
        try {
            // Optimistic Update
            setAppointments(prev =>
                prev.map(app => app.id === id ? { ...app, status: newStatus } : app)
            );
            await updateAppointmentStatus(id, newStatus);
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const pendingCount = appointments.filter(a => a.status === 'pending').length;

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Zgłoszenia</h1>
                    <p className="text-zinc-400 mt-1">Zarządzaj wizytami klientów warsztatu.</p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-6 py-3 flex flex-col items-center">
                    <span className="text-3xl font-bold text-yellow-500">{pendingCount}</span>
                    <span className="text-xs text-zinc-400 uppercase tracking-widest mt-1">Oczekujące</span>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12 text-zinc-500">Ładowanie zgłoszeń...</div>
            ) : (
                <div className="grid gap-4">
                    {appointments.map((appointment) => (
                        <div key={appointment.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col md:flex-row gap-6 hover:border-zinc-700 transition-colors">

                            {/* Meta & Status */}
                            <div className="flex-none w-full md:w-48 flex flex-col justify-between border-b md:border-b-0 md:border-r border-zinc-800 pb-4 md:pb-0 md:pr-4">
                                <div>
                                    <p className="text-lg font-bold text-white">{appointment.date}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-2xl font-light text-yellow-500">{appointment.time}</span>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    {appointment.status === 'pending' && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-yellow-500 border border-yellow-500/20">
                                            Oczekująca
                                        </span>
                                    )}
                                    {appointment.status === 'confirmed' && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-900/30 text-emerald-400 border border-emerald-800">
                                            Zaakceptowana
                                        </span>
                                    )}
                                    {appointment.status === 'rejected' && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/30 text-red-400 border border-red-800">
                                            Odrzucona
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-zinc-500 uppercase tracking-wider">Klient</p>
                                    <p className="text-base text-white font-medium">{appointment.clientName}</p>
                                    <p className="text-sm text-zinc-400 mt-1">{appointment.phone}</p>
                                </div>

                                <div>
                                    <p className="text-xs text-zinc-500 uppercase tracking-wider">Pojazd</p>
                                    <p className="text-base text-white">{appointment.carModel}</p>
                                </div>

                                <div className="md:col-span-2 mt-2">
                                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Opis Usterki</p>
                                    <p className="text-sm text-zinc-300 bg-black/50 p-3 rounded border border-zinc-800/50">
                                        {appointment.issueDescription}
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex-none flex flex-row md:flex-col justify-end gap-2 pt-4 md:pt-0 border-t md:border-t-0 border-zinc-800 mt-2 md:mt-0">
                                {appointment.status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                                            className="flex-1 md:flex-none px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded transition"
                                        >
                                            Akceptuj
                                        </button>
                                        <button
                                            onClick={() => handleStatusChange(appointment.id, 'rejected')}
                                            className="flex-1 md:flex-none px-4 py-2 bg-zinc-800 hover:bg-red-900/80 hover:text-red-300 text-zinc-300 transition rounded"
                                        >
                                            Odrzuć
                                        </button>
                                    </>
                                )}
                                {appointment.status === 'confirmed' && (
                                    <button
                                        onClick={() => handleStatusChange(appointment.id, 'rejected')}
                                        className="px-4 py-2 text-sm text-zinc-500 hover:text-red-400 transition"
                                    >
                                        Anuluj wizytę
                                    </button>
                                )}
                            </div>

                        </div>
                    ))}

                    {appointments.length === 0 && (
                        <div className="text-center py-12 bg-zinc-900 border border-zinc-800 rounded-xl mt-4">
                            <p className="text-zinc-500">Brak zgłoszeń w systemie.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
