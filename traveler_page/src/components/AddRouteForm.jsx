import React, { useState } from 'react';
import { Upload, X, MapPin, FileText, CheckCircle2 } from 'lucide-react';

const AddRouteForm = ({ isOpen, onClose }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call to upload GPX and save route
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
                onClose();
            }, 2000);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden transform transition-all">
                <div className="absolute top-4 right-4 z-10">
                    <button
                        onClick={onClose}
                        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {isSuccess ? (
                    <div className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                        <CheckCircle2 size={64} className="text-emerald-500 mb-6" />
                        <h3 className="text-3xl font-bold text-slate-900 mb-2">Trasa dodana!</h3>
                        <p className="text-slate-600">Twoja wyprawa została pomyślnie zapisana.</p>
                    </div>
                ) : (
                    <div className="p-8 md:p-10">
                        <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">Dodaj Nową Trasę</h3>
                        <p className="text-slate-600 mb-8">Uzupełnij szczegóły i wgraj ślad GPX ze swojej wyprawy rowerowej.</p>

                        <form onSubmit={handleSubmit} className="space-y-6">

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Nazwa Wyprawy</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            required
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-slate-700 bg-slate-50 focus:bg-white"
                                            placeholder="np. Szutry Kaszubskie"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Krótki opis</label>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-3 text-slate-400" size={18} />
                                        <textarea
                                            required
                                            rows="3"
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-slate-700 bg-slate-50 focus:bg-white"
                                            placeholder="Zanotuj ciekawe miejsca i warunki..."
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            {/* GPX Upload simulator */}
                            <div className="mt-8">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Plik śladu (.gpx)</label>
                                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center bg-slate-50 hover:bg-slate-100 hover:border-emerald-400 transition-all cursor-pointer group">
                                    <div className="mx-auto w-16 h-16 mb-4 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:shadow group-hover:scale-110 transition-all">
                                        <Upload size={24} className="text-emerald-500" />
                                    </div>
                                    <p className="text-sm font-medium text-slate-700 mb-1">Kliknij, aby wgrać plik GPX</p>
                                    <p className="text-xs text-slate-500">lub przeciągnij i upuść plik tutaj</p>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-3 rounded-full font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                                >
                                    Anuluj
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-8 py-3 rounded-full bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-all shadow-lg hover:shadow-emerald-500/30 flex items-center justify-center min-w-[140px]"
                                >
                                    {isSubmitting ? (
                                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        'Zapisz Trasę'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddRouteForm;
