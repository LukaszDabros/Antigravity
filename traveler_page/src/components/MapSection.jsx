import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import LiveTracker from './LiveTracker';

const GpxTrack = ({ url }) => {
    const map = useMap();
    const trackRef = useRef(null);
    const [libLoaded, setLibLoaded] = useState(false);

    useEffect(() => {
        // Fix for leaflet-gpx in production builds (requires global L)
        window.L = window.L || L;
        import('leaflet-gpx').then(() => {
            setLibLoaded(true);
        });
    }, []);

    useEffect(() => {
        if (!map || !url || !libLoaded) return;

        if (trackRef.current) {
            map.removeLayer(trackRef.current);
        }

        const gpxLayer = new L.GPX(url, {
            async: true,
            marker_options: {
                startIconUrl: 'https://unpkg.com/leaflet-gpx/pin-icon-start.png',
                endIconUrl: 'https://unpkg.com/leaflet-gpx/pin-icon-end.png',
                shadowUrl: 'https://unpkg.com/leaflet-gpx/pin-shadow.png',
            },
            polyline_options: {
                color: '#10b981', // emerald-500
                opacity: 0.8,
                weight: 5,
                lineCap: 'round',
            }
        }).on('loaded', function (e) {
            map.fitBounds(e.target.getBounds(), { padding: [50, 50] });
        }).addTo(map);

        trackRef.current = gpxLayer;

        return () => {
            if (trackRef.current) {
                map.removeLayer(trackRef.current);
            }
        };
    }, [map, url, libLoaded]);

    return null;
};

const MapSection = () => {
    // Center by default on Tatras if GPX hasn't loaded yet
    const defaultPosition = [49.179, 20.088];

    return (
        <section id="map" className="py-24 bg-slate-900 text-white relative">
            <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-700 via-slate-900 to-slate-900 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full mb-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between">
                    <div>
                        <h2 className="text-sm font-bold text-emerald-400 tracking-wider uppercase mb-2">Ślady GPS</h2>
                        <h3 className="text-3xl md:text-5xl font-black text-white">Interaktywna Mapa</h3>
                    </div>
                    <p className="text-slate-400 max-w-md mt-4 md:mt-0 font-medium">
                        Śledź moje górskie przejścia, rowerowe tripy i trasy z wykorzystaniem podkładów topograficznych.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="bg-slate-800 p-2 rounded-3xl shadow-2xl border border-slate-700 overflow-hidden">
                    <div className="h-[600px] w-full rounded-2xl overflow-hidden bg-slate-100 z-0">
                        <MapContainer
                            center={defaultPosition}
                            zoom={13}
                            scrollWheelZoom={false}
                            className="h-full w-full z-0"
                        >
                            {/* Topographic map tiles. Using OpenTopoMap as a reliable alternative if Mapy.cz apikey is missing. */}
                            <TileLayer
                                attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
                                url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                            />
                            <GpxTrack url="/sample-track.gpx" />
                            <LiveTracker />
                        </MapContainer>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MapSection;
