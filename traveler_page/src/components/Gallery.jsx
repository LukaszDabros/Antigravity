import React from 'react';

const photos = [
    'https://images.unsplash.com/photo-1533560904424-a0c61dc306fc?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1471506480208-91b3a4cc78be?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1496150590317-f8d952453f93?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518381803525-2415d8623da9?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507034589631-9433cc6bc453?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544181093-c712fb401bb8?q=80&w=800&auto=format&fit=crop',
];

const Gallery = () => {
    return (
        <section id="gallery" className="py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                    <div>
                        <h2 className="text-sm font-bold text-emerald-500 tracking-wider uppercase mb-2">Uchwycone Momenty</h2>
                        <h3 className="text-3xl md:text-5xl font-black text-slate-900">Galeria</h3>
                    </div>
                    <p className="text-slate-600 max-w-md mt-4 md:mt-0 font-medium">
                        Zbiór moich ulubionych zdjęć z różnych zakątków świata. Spójrz na nie by poczuć klimat tych miejsc.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
                    {photos.map((url, i) => (
                        <div
                            key={i}
                            className={`relative rounded-2xl overflow-hidden group cursor-pointer ${i === 0 || i === 3 ? 'col-span-2 md:col-span-1 row-span-2' : ''
                                }`}
                        >
                            <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none"></div>
                            <img
                                src={url}
                                alt={`Zdjęcie z podróży ${i + 1}`}
                                className={`w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ${i === 0 || i === 3 ? 'min-h-[400px]' : 'h-48 md:h-64'
                                    }`}
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Gallery;
