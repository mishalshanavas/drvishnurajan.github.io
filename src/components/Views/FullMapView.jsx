import React, { useState, useEffect } from 'react';
import { MapVisualizer } from '../Dashboard/MapVisualizer/MapVisualizer';
import { SystemControls } from '../Dashboard/ControlPanel/SystemControls';
import { Layers } from 'lucide-react';
import { useAssets } from '../../hooks/useAssets';

export const FullMapView = ({ initialLayer = 'all', showControls = false, onNavigate }) => {
    const { categories } = useAssets();
    const [activeLayer, setActiveLayer] = useState(initialLayer);

    // Update local state if prop changes (e.g. navigation)
    useEffect(() => {
        setActiveLayer(initialLayer);
    }, [initialLayer]);

    // Helper to get color for category
    const getCategoryStyles = (cat) => {
        switch (cat) {
            case 'all': return 'bg-blue-100 text-blue-700';
            case 'water': return 'bg-cyan-100 text-cyan-700';
            case 'energy': return 'bg-yellow-100 text-yellow-700';
            case 'controls': return 'bg-violet-100 text-violet-700';
            case 'agriculture': return 'bg-emerald-100 text-emerald-700';
            case 'health': return 'bg-rose-100 text-rose-700';
            case 'mobility': return 'bg-indigo-100 text-indigo-700';
            case 'assistive_tech': return 'bg-teal-100 text-teal-700';
            case 'incidents': return 'bg-red-100 text-red-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    // Construct dynamic layers
    const mapLayers = [
        { id: 'all', label: 'All Assets', color: getCategoryStyles('all') },
        ...(categories || []).map(cat => ({
            id: cat,
            label: cat.charAt(0).toUpperCase() + cat.slice(1),
            color: getCategoryStyles(cat)
        }))
    ];

    return (
        <div className="relative w-full h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)] bg-slate-100 rounded-2xl md:rounded-3xl overflow-hidden border border-slate-200">
            {/* Map Component */}
            <div className="absolute inset-0 z-0">
                <MapVisualizer
                    initialCategory={activeLayer}
                    showFilters={false}
                    zoomControl={true}
                    interactive={true}
                    onNavigate={onNavigate}
                />
            </div>

            {/* Map Controls Overlay */}
            <div className="absolute top-4 right-4 z-[500] flex flex-col gap-4 items-end">
                {/* Layer Switcher */}
                <div className="bg-white/90 backdrop-blur-md p-2 rounded-xl border border-slate-200 shadow-lg flex flex-col gap-2 w-40">
                    <div className="p-2 border-b border-slate-100 flex items-center gap-2">
                        <Layers size={18} className="text-slate-600" />
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Map Layers</span>
                    </div>
                    {mapLayers.map(layer => (
                        <button
                            key={layer.id}
                            onClick={() => setActiveLayer(layer.id)}
                            className={`text-xs font-semibold px-3 py-2 rounded-lg transition-colors text-left ${activeLayer === layer.id ? layer.color : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            {layer.label}
                        </button>
                    ))}
                </div>

                {/* System Controls Panel - Only show if specifically requested via prop */}
                {showControls && (
                    <div className="w-80">
                        <SystemControls />
                    </div>
                )}
            </div>
        </div>
    );
};
