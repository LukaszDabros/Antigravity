import React from 'react';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';

const trips = [
    {
        id: 1,
        title: 'Bikepacking w Tatrach',
        date: 'Sierpień 2025',
        location: 'Polska, Podhale',
        image: 'https://images.unsplash.com/photo-1576405370243-d734cf281a17?q=80&w=2000&auto=format&fit=crop',
        excerpt: 'Trzydniowa pętla dookoła Tatr z pełnym ekwipunkiem na rowerze.',
    },
    {
        id: 2,
        title: 'Szutry Słowacji',
        date: 'Lipiec 2025',
        location: 'Słowacja',
        image: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=2000&auto=format&fit=crop',
        excerpt: 'Pokonywanie szutrowych przełęczy i leśnych ścieżek na gravelu.',
    },
    {
        id: 3,
        title: 'Nordkapp na Dwóch Kółkach',
        date: 'Maj 2025',
        location: 'Norwegia',
        image: 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?q=80&w=2000&auto=format&fit=crop',
        excerpt: 'Wyprawa życia na przepiękne fiordy, pokonując deszcz i wiatr Norwegii.',
    }
];

const Trips = () => {
    return (
        <section id="trips" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-sm font-bold text-emerald-500 tracking-wider uppercase mb-2">Moje Osiągnięcia</h2>
                    <h3 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">Odbyte Podróże</h3>
                    <div className="w-24 h-1 bg-emerald-500 mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {trips.map(trip => (
                        <div key={trip.id} className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100">
                            <div className="relative h-64 overflow-hidden">
                                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors z-10"></div>
                                <img
                                    src={trip.image}
                                    alt={trip.title}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                />
                                <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center shadow-sm">
                                    <Calendar size={14} className="text-emerald-500 mr-2" />
                                    <span className="text-xs font-semibold text-slate-700">{trip.date}</span>
                                </div>
                            </div>

                            <div className="p-8 flex flex-col flex-grow">
                                <div className="flex items-center text-slate-500 text-sm mb-3">
                                    <MapPin size={16} className="mr-1 text-emerald-500" />
                                    {trip.location}
                                </div>
                                <h4 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">
                                    {trip.title}
                                </h4>
                                <p className="text-slate-600 mb-6 flex-grow leading-relaxed">
                                    {trip.excerpt}
                                </p>
                                <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-100">
                                    <button className="flex items-center text-emerald-500 font-semibold group-hover:text-emerald-600 transition-colors text-sm">
                                        Zobacz relację <ArrowRight size={16} className="ml-1 transform group-hover:translate-x-1 transition-transform" />
                                    </button>
                                    <a href="#map" className="flex items-center text-slate-500 hover:text-emerald-500 font-medium text-sm transition-colors">
                                        Pokaż na mapie
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <button className="px-8 py-4 rounded-full bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20">
                        Zobacz wszystkie wpisy
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Trips;
