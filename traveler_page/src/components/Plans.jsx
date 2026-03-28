import React from 'react';
import { Target, ArrowRight, CalendarDays, Globe2 } from 'lucide-react';

const plans = [
    {
        id: 1,
        title: 'Jedwabny Szlak na Rowerze',
        timeline: 'Wiosna 2027',
        description: 'Przejazd ułamkiem historycznego Jedwabnego Szlaku z wykorzystaniem sprzętu bikepackingowego. Celem są bezkresne stepy i wysokie przełęcze Pamiru.',
        status: 'Planowanie trasy',
        image: 'https://images.unsplash.com/photo-1596769919010-3882f0ab7793?q=80&w=2000&auto=format&fit=crop'
    },
    {
        id: 2,
        title: 'Gravelowe Maroko',
        timeline: 'Jesień 2026',
        description: 'Eksploracja gór Atlas na rowerze gravelowym. Spanie na dziko i poznawanie lokalnych ścieżek z daleka od utartych szlaków turystycznych.',
        status: 'Kompletowanie sprzętu',
        image: 'https://images.unsplash.com/photo-1489493887464-892be6d15e8d?q=80&w=2000&auto=format&fit=crop'
    }
];

const Plans = () => {
    return (
        <section id="plans" className="py-24 bg-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
                    <div>
                        <h2 className="text-sm font-bold text-emerald-500 tracking-wider uppercase mb-2 flex items-center">
                            <Target size={18} className="mr-2" /> Następne cele
                        </h2>
                        <h3 className="text-3xl md:text-5xl font-black text-slate-900">Plany Wypraw</h3>
                    </div>
                    <p className="text-slate-600 max-w-md mt-4 md:mt-0 font-medium">
                        Moja lista podróżnicza rośnie. Oto projekty, do których aktualnie się przygotowuję.
                    </p>
                </div>

                <div className="space-y-8">
                    {plans.map((plan, index) => (
                        <div
                            key={plan.id}
                            className={`flex flex-col lg:flex-row bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-slate-200 group ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
                        >
                            <div className="lg:w-2/5 h-64 lg:h-auto relative overflow-hidden">
                                <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors z-10"></div>
                                <img
                                    src={plan.image}
                                    alt={plan.title}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center shadow-sm">
                                    <Globe2 size={16} className="text-emerald-500 mr-2" />
                                    <span className="text-sm font-bold text-slate-800">{plan.status}</span>
                                </div>
                            </div>

                            <div className="lg:w-3/5 p-8 lg:p-12 flex flex-col justify-center">
                                <div className="flex items-center text-emerald-600 font-semibold mb-4 bg-emerald-50 w-fit px-4 py-2 rounded-full">
                                    <CalendarDays size={18} className="mr-2" />
                                    {plan.timeline}
                                </div>

                                <h4 className="text-3xl font-black text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors">
                                    {plan.title}
                                </h4>

                                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                    {plan.description}
                                </p>

                                <div>
                                    <button className="flex items-center text-slate-900 font-bold hover:text-emerald-600 transition-colors">
                                        Dowiedz się więcej <ArrowRight size={20} className="ml-2 transform group-hover:translate-x-2 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Plans;
