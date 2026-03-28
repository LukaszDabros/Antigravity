import React from 'react';
import { Compass, ArrowDownCircle } from 'lucide-react';

const Hero = () => {
    return (
        <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=2600&auto=format&fit=crop")',
                }}
            >
                <div className="absolute inset-0 bg-slate-900/50 bg-gradient-to-b from-transparent to-slate-900/90"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto mt-20">
                <div className="inline-flex items-center justify-center p-2 mb-6 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                    <Compass className="w-5 h-5 text-emerald-400 mr-2" />
                    <span className="text-white text-sm font-medium tracking-wide uppercase">Bikepacking & Gravel</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6 leading-tight drop-shadow-lg">
                    Dwa kółka, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">nieznane</span> szlaki
                </h1>

                <p className="mt-4 text-xl md:text-2xl text-slate-200 font-light max-w-2xl mx-auto mb-10 drop-shadow">
                    Kolekcjonuj kilometry, nie rzeczy. Zobacz moje odbyte wyprawy rowerowe, prześledź gravelowe trasy na mapach i ruszaj w drogę.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <a href="#map" className="px-8 py-4 rounded-full bg-emerald-500 text-white font-semibold text-lg hover:bg-emerald-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-emerald-500/30 flex items-center">
                        Zobacz Mapę Tras
                    </a>
                    <a href="#trips" className="px-8 py-4 rounded-full bg-white/10 text-white border border-white/30 backdrop-blur-md font-semibold text-lg hover:bg-white/20 transition-all flex items-center">
                        Odbyte Podróże
                    </a>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
                <a href="#about" className="text-white/70 hover:text-white transition-colors">
                    <ArrowDownCircle size={32} strokeWidth={1.5} />
                </a>
            </div>
        </div>
    );
};

export default Hero;
