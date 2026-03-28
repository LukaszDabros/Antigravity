import React, { useState, useEffect } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Navigation } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';

// Create a custom pulsing icon resembling a blue location dot
const createLiveIcon = () => {
    const htmlString = renderToStaticMarkup(
        <div className="relative flex items-center justify-center w-8 h-8">
            <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500 border-2 border-white shadow-md"></span>
        </div>
    );

    return L.divIcon({
        className: 'bg-transparent border-none',
        html: htmlString,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
    });
};

const LiveTracker = () => {
    const map = useMap();
    // Starting position (approximate point on the sample GPX)
    const [position, setPosition] = useState([49.179, 20.088]);
    const liveIcon = createLiveIcon();

    useEffect(() => {
        // In a real scenario, this would be a WebSocket or API polling (setInterval).
        // Here we simulate moving the tracker slightly every 3 seconds to demonstrate the feature.

        let moveCount = 0;
        const intervalId = setInterval(() => {
            setPosition(prev => {
                // Determine small delta to move North-East
                const moveLat = prev[0] + 0.0001;
                const moveLng = prev[1] + 0.0002;
                return [moveLat, moveLng];
            });

            moveCount++;

            // Optionally, we could make the map pan to the new position if tracking is active
            // but we'll leave it up to the user to scroll or watch.
            // if (moveCount % 5 === 0) {
            //     map.panTo([position[0], position[1]]);
            // }

        }, 3000);

        return () => clearInterval(intervalId);
    }, [map]);

    return (
        <Marker position={position} icon={liveIcon}>
            <Popup className="rounded-xl overflow-hidden shadow-xl">
                <div className="text-center p-1">
                    <p className="font-bold text-slate-800 text-sm mb-1">Moja aktualna pozycja</p>
                    <p className="text-xs text-slate-500 flex items-center justify-center">
                        <Navigation size={12} className="text-blue-500 mr-1" /> W trasie...
                    </p>
                </div>
            </Popup>
        </Marker>
    );
};

export default LiveTracker;
