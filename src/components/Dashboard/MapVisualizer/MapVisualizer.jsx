import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Filter, Eye, EyeOff, Save, Settings, Activity, Search } from 'lucide-react';

// Fix for default marker icon in Leaflet + React
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

import { VILLAGE_CENTER } from '../../../data/mockData';
import { useAssets } from '../../../hooks/useAssets';

import { useAuth } from '../../../context/AuthContext';

const AssetPopup = ({ asset, onUpdate, onNavigate }) => {
    const { isAdmin } = useAuth();
    const [min, setMin] = useState(asset.thresholds?.min || 0);
    const [max, setMax] = useState(asset.thresholds?.max || 100);
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = () => {
        onUpdate(asset.firebaseId || asset.id, {
            thresholds: { ...asset.thresholds, min: parseFloat(min), max: parseFloat(max) }
        });
        setIsEditing(false);
    };

    const togglePower = () => {
        const isOffline = asset.status === 'offline';
        onUpdate(asset.firebaseId || asset.id, {
            status: isOffline ? 'normal' : 'offline'
        });
    };

    const isOn = asset.status !== 'offline';

    return (
        <div className="p-2 min-w-[200px]">
            {/* Header */}
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                <div>
                    <h3 className="font-bold text-slate-800 text-sm">{asset.type}</h3>
                    <p className="text-[10px] text-slate-500 font-mono">{asset.id}</p>
                </div>
                <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${asset.status === 'critical' ? 'bg-red-100 text-red-600' :
                    asset.status === 'warning' ? 'bg-amber-100 text-amber-600' :
                        asset.status === 'offline' ? 'bg-slate-100 text-slate-500' :
                            'bg-green-100 text-green-600'
                    }`}>
                    {asset.status}
                </div>
            </div>

            {/* Main Value & Control */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide">Current</p>
                    <p className="text-lg font-bold text-slate-700">
                        {isOn ? asset.val : 'Off'}
                    </p>
                </div>
                {isAdmin && (
                    <button
                        onClick={togglePower}
                        className={`
                        px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all active:scale-95
                        ${isOn ? 'bg-green-500 hover:bg-green-600 shadow-green-500/20 shadow-lg' : 'bg-slate-400 hover:bg-slate-500'}
                    `}
                    >
                        {isOn ? 'ACTIVE' : 'OFFLINE'}
                    </button>
                )}
            </div>

            {/* View Details Action */}
            {onNavigate && (
                <button
                    onClick={() => onNavigate('live', { assetId: asset.id })}
                    className="w-full mb-3 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 py-1.5 rounded-lg text-xs font-bold transition-colors"
                >
                    <Activity size={12} /> View Live Data
                </button>
            )}

            {/* Threshold Config */}
            {isAdmin && (
                <div className="bg-slate-50 rounded-lg p-2">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                            <Settings size={12} /> Config
                        </p>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="text-[10px] text-blue-500 hover:underline"
                        >
                            {isEditing ? 'Cancel' : 'Edit'}
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="text-[10px] text-slate-400 block mb-0.5">Min</label>
                            <input
                                type="number"
                                disabled={!isEditing}
                                value={min}
                                onChange={(e) => setMin(e.target.value)}
                                className="w-full text-xs border border-slate-200 rounded px-1.5 py-1 bg-white focus:outline-none focus:border-blue-500 transition-colors disabled:bg-slate-100"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-slate-400 block mb-0.5">Max</label>
                            <input
                                type="number"
                                disabled={!isEditing}
                                value={max}
                                onChange={(e) => setMax(e.target.value)}
                                className="w-full text-xs border border-slate-200 rounded px-1.5 py-1 bg-white focus:outline-none focus:border-blue-500 transition-colors disabled:bg-slate-100"
                            />
                        </div>
                    </div>

                    {isEditing && (
                        <button
                            onClick={handleSave}
                            className="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium py-1 rounded transition-colors flex items-center justify-center gap-1"
                        >
                            <Save size={12} /> Save
                        </button>
                    )}
                </div>
            )}

            {/* Incident Badge */}
            {asset.incidents && asset.incidents.length > 0 && (
                <div className="mt-2 text-xs text-red-600 bg-red-50 p-1.5 rounded border border-red-100">
                    <span className="font-bold">Alert:</span> {asset.incidents.join(', ')}
                </div>
            )}
        </div>
    );
};



// Helper Icon


export const MapVisualizer = ({ initialCategory = 'all', showFilters = true, zoomControl = true, interactive = true, onNavigate }) => {
    console.log("MapVisualizer rendering. initialCategory:", initialCategory);
    const context = useAssets();
    console.log("Context:", context);
    const { assets, updateAsset } = context || {};

    const safeAssets = Array.isArray(assets) ? assets : [];
    console.log("Safe assets count:", safeAssets.length);

    const [filterStatus, setFilterStatus] = useState('all'); // all, active, offline
    const [filterCategory, setFilterCategory] = useState(initialCategory); // all, energy, water...

    useEffect(() => {
        setFilterCategory(initialCategory);
    }, [initialCategory]);

    const getAssetColor = (asset) => {
        if (!asset) return '#64748b';
        if (asset.status === 'offline') return '#94a3b8'; // Slate (Offline)
        if (asset.status === 'critical') return '#ef4444'; // Red
        if (asset.status === 'warning') return '#f59e0b'; // Amber
        if (asset.category === 'water') return '#06b6d4'; // Cyan
        if (asset.category === 'energy') return '#eab308'; // Yellow
        if (asset.category === 'controls') return '#8b5cf6'; // Violet
        if (asset.category === 'agriculture') return '#10b981'; // Emerald
        if (asset.category === 'health') return '#f43f5e'; // Rose
        if (asset.category === 'mobility') return '#6366f1'; // Indigo
        if (asset.category === 'assistive_tech') return '#14b8a6'; // Teal
        return '#64748b';
    };

    const filteredAssets = safeAssets.filter(asset => {
        if (!asset) return false;
        // Status Filter
        if (filterStatus === 'active') {
            if (asset.status === 'offline') return false;
        }
        if (filterStatus === 'offline') {
            if (asset.status !== 'offline') return false;
        }

        // Category Filter
        if (filterCategory !== 'all' && asset.category !== filterCategory) return false;

        return true;
    });

    return (
        <div className="w-full h-full bg-slate-50 relative group">
            <MapContainer
                center={VILLAGE_CENTER}
                zoom={16}
                scrollWheelZoom={interactive}
                dragging={interactive}
                touchZoom={interactive}
                doubleClickZoom={interactive}
                boxZoom={interactive}
                keyboard={interactive}
                zoomControl={interactive && zoomControl}
                className={`w-full h-full outline-none ${!interactive ? 'pointer-events-none' : ''}`}
                style={{ background: '#f8fafc' }}
            >
                {/* Modern Light Mode Tiles */}
                <TileLayer
                    attribution='&copy; CARTO'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />

                {/* Assets */}
                {filteredAssets.map(asset => (
                    <CircleMarker
                        key={asset.id}
                        center={asset.coords}
                        pathOptions={{
                            color: getAssetColor(asset),
                            fillColor: getAssetColor(asset),
                            fillOpacity: asset.status !== 'offline' ? 0.6 : 0.3,
                            weight: 2,
                            className: 'pointer-events-auto' // Ensure markers are clickable even if map is not
                        }}
                        radius={asset.status !== 'offline' ? 10 : 6}
                        eventHandlers={{
                            click: () => !interactive && onNavigate && onNavigate('live', { assetId: asset.id })
                        }}
                    >
                        <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                            <div className="text-xs font-bold text-slate-700">
                                {asset.type}
                            </div>
                        </Tooltip>
                        {interactive && (
                            <Popup>
                                <AssetPopup asset={asset} onUpdate={updateAsset} onNavigate={onNavigate} />
                            </Popup>
                        )}
                    </CircleMarker>
                ))}



                {/* Overlay Scanning Effect */}
                <div className="leaflet-top leaflet-left w-full h-full pointer-events-none z-[400] overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.4)_100%)]"></div>
                </div>
            </MapContainer>

            {/* Floating Filter Bar - MOVED TO LEFT to avoid Zoom Control overlap */}
            {showFilters && (
                <div className="absolute top-4 left-14 z-[500] bg-white/90 backdrop-blur shadow-lg rounded-xl p-2 flex flex-col gap-2 border border-slate-100 transition-opacity opacity-0 group-hover:opacity-100 duration-300">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-1">
                        <Filter size={14} className="text-slate-400" />
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Filters</span>
                    </div>
                    {/* Status Toggles */}
                    <div className="flex bg-slate-100 rounded-lg p-1">
                        {['all', 'active', 'offline'].map(s => (
                            <button
                                key={s}
                                onClick={() => setFilterStatus(s)}
                                className={`flex-1 px-3 py-1 text-[10px] font-bold uppercase rounded transition-all ${filterStatus === s ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>

                    {/* Category Toggles */}
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="w-full text-xs border-none bg-slate-50 rounded-lg px-2 py-1.5 text-slate-600 font-medium focus:ring-0 cursor-pointer hover:bg-slate-100"
                    >
                        <option value="all">All Types</option>
                        {['energy', 'water', 'controls', 'agriculture', 'health', 'mobility', 'assistive_tech'].map(cat => (
                            <option key={cat} value={cat}>
                                {cat === 'assistive_tech' ? 'Assistive Technology' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Instructions Hint */}
            <div className="absolute bottom-4 left-4 z-[400] bg-white/80 backdrop-blur px-3 py-2 rounded-lg text-[10px] text-slate-500 shadow-sm border border-slate-100 pointer-events-none">
                Hover to see filters • Click nodes to control
            </div>
        </div>
    );
};
