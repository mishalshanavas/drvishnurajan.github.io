
import React, { useState } from 'react';
import { MapVisualizer } from '../Dashboard/MapVisualizer/MapVisualizer';
import { Layers } from 'lucide-react';

export const CityMap = () => {
    const [activeLayer, setActiveLayer] = useState('all');

    return (
        <div className="relative w-full h-[calc(100vh-8rem)] bg-slate-100 rounded-3xl overflow-hidden border border-slate-200">
            {/* Map Component */}
            <div className="absolute inset-0 z-0">
                <MapVisualizer activeLayer={activeLayer} showFilters={false} zoomControl={false} />
            </div>

            {/* Map Controls Overlay */}
            <div className="absolute top-4 right-4 z-[500] bg-white/90 backdrop-blur-md p-2 rounded-xl border border-slate-200 shadow-lg flex flex-col gap-2">
                <div className="p-2 border-b border-slate-100">
                    <Layers size={20} className="text-slate-600" />
                </div>
                <button
                    onClick={() => setActiveLayer('all')}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${activeLayer === 'all' ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    All Assets
                </button>
                <button
                    onClick={() => setActiveLayer('water')}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${activeLayer === 'water' ? 'bg-cyan-100 text-cyan-700' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    Water Network
                </button>
                <button
                    onClick={() => setActiveLayer('energy')}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${activeLayer === 'energy' ? 'bg-yellow-100 text-yellow-700' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    Energy Grid
                </button>
                <button
                    onClick={() => setActiveLayer('incidents')}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${activeLayer === 'incidents' ? 'bg-red-100 text-red-700' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    Incidents
                </button>
            </div>
        </div>
    );
};
