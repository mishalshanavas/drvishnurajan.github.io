import React from 'react';
import { Construction, Zap, Droplets, AlertTriangle, Settings, Activity, Map as MapIcon } from 'lucide-react';

const PlaceholderView = ({ title, icon: Icon, color, message }) => (
    <div className="w-full h-full p-8 flex flex-col items-center justify-center text-center bg-slate-50/50 backdrop-blur-sm rounded-3xl border border-slate-200 shadow-sm animate-in fade-in duration-500">
        <div className={`w-24 h-24 rounded-full ${color} bg-opacity-10 flex items-center justify-center mb-6`}>
            <Icon size={48} className={color.replace('bg-', 'text-')} />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">{title}</h2>
        <p className="text-slate-500 max-w-md mx-auto text-lg">{message || "This module is currently under development or simulating live data connection."}</p>
        <button className="mt-8 px-6 py-2 bg-white border border-slate-200 text-slate-600 rounded-full font-medium hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm">
            View Documentation
        </button>
    </div>
);

export const CityMap = () => <PlaceholderView title="City Map" icon={MapIcon} color="bg-blue-500" message="Interactive 3D City Twin loading..." />;
export const LiveMonitoring = () => <PlaceholderView title="Live Monitoring" icon={Activity} color="bg-purple-500" message="Real-time sensor feed connection pending." />;
export const EnergyGrid = () => <PlaceholderView title="Energy Grid" icon={Zap} color="bg-yellow-500" message="Smart Grid topology visualization." />;
export const WaterSystem = () => <PlaceholderView title="Water System" icon={Droplets} color="bg-cyan-500" message="Water flow and quality sensors interface." />;
export const Incidents = () => <PlaceholderView title="Incident Management" icon={AlertTriangle} color="bg-red-500" message="Emergency response coordination center." />;
export const SystemConfig = () => <PlaceholderView title="System Configuration" icon={Settings} color="bg-slate-500" message="Global dashboard settings and preferences." />;
