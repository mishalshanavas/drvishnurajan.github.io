import React from 'react';
import { Power, Activity, Settings2 } from 'lucide-react';
import { useAssets } from '../../../hooks/useAssets';
import { useAuth } from '../../../context/AuthContext';

const ControlItem = ({ asset, onToggle, onClick, disabled }) => {
    // Determine ON/OFF state from status directly.
    const isOn = asset.status !== 'offline';

    return (
        <div
            onClick={() => onClick(asset)}
            className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors gap-3"
        >
            <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className={`p-2 rounded-lg shrink-0 ${isOn ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-500'}`}>
                    <Power size={18} />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-700 truncate">{asset.type}</p>
                        {asset.flowType && (
                            <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border shrink-0 ${asset.flowType === 'producer' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                asset.flowType === 'consumer' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                    'bg-purple-50 text-purple-600 border-purple-100'
                                }`}>
                                {asset.flowType}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-xs text-slate-500 truncate">{asset.details}</p>
                        <span className="text-xs bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-slate-600 font-medium shrink-0">
                            {isOn ? Math.abs(asset.val || 0) : 'Off'}
                        </span>
                    </div>
                </div>
            </div>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    if (!disabled) onToggle(asset);
                }}
                disabled={disabled}
                title={disabled ? "Admin access needed" : "Toggle Power"}
                className={`
                    relative w-12 h-6 rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shrink-0
                    ${isOn ? 'bg-green-500' : 'bg-slate-300'}
                    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
            >
                <span
                    className={`
                        absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out
                        ${isOn ? 'translate-x-6' : 'translate-x-0'}
                    `}
                />
            </button>
        </div>
    );
};

export const SystemControls = ({ onNavigate }) => {
    const { assets, updateAsset } = useAssets();
    const { isAdmin } = useAuth();

    // Filter for controllable assets.
    // Logic: Look for "category: controls" OR anything we consider controllable.
    const controllableAssets = assets.filter(a => {
        return a.category === 'controls' || (a.category === 'energy' && a.flowType !== 'sensor');
    });

    const handleToggle = async (asset) => {
        if (!isAdmin) return;
        const isCurrentlyOffline = asset.status === 'offline';
        const newStatus = isCurrentlyOffline ? 'normal' : 'offline';

        try {
            await updateAsset(asset.firebaseId || asset.id, {
                status: newStatus
            });
        } catch (error) {
            console.error("Failed to toggle asset:", error);
        }
    };

    return (
        <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-4 shadow-xl flex flex-col h-64 overflow-hidden">
            <h3 className="text-slate-600 font-semibold mb-4 text-sm uppercase tracking-wider flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Settings2 size={16} />
                    System Controls
                </div>
                {!isAdmin && (
                    <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase font-bold border border-slate-200">
                        View Only
                    </span>
                )}
            </h3>

            <div className="space-y-2 overflow-y-auto pr-2 custom-scrollbar flex-1">
                {controllableAssets.length > 0 ? (
                    controllableAssets.map(asset => (
                        <ControlItem
                            key={asset.id}
                            asset={asset}
                            onToggle={handleToggle}
                            onClick={() => onNavigate('live', { assetId: asset.id })}
                            disabled={!isAdmin}
                        />
                    ))
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm p-4 text-center">
                        <Activity size={24} className="mb-2 opacity-50" />
                        No controllable systems online.
                    </div>
                )}
            </div>
        </div>
    );
};
