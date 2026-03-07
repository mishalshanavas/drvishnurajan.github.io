import React, { useState, useEffect } from 'react';
import { Zap, Sun, Activity, AlertTriangle, Server } from 'lucide-react';
import { useAssets } from '../../../hooks/useAssets';

const KPI = ({ label, value, unit, icon: Icon, color }) => (
    <div className="bg-white/60 backdrop-blur-md border border-slate-200 rounded-2xl p-4 flex items-center gap-4 shadow-lg flex-1 min-w-[200px] hover:bg-white/80 transition-colors cursor-default group">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} bg-opacity-20`}>
            <Icon size={24} className={color.replace('bg-', 'text-')} />
        </div>
        <div>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{label}</p>
            <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-800 tracking-tight group-hover:scale-105 transition-transform origin-left max-w-[150px] truncate">{value}</span>
                <span className="text-sm text-slate-600 font-medium shrink-0">{unit}</span>
            </div>
        </div>
    </div>
);

export const KPIStats = () => {
    const { assets } = useAssets();

    // Calculate dynamic stats
    let totalConsumption = 0;
    let totalGeneration = 0;
    let activeAlerts = 0;
    let activeDevices = 0;

    assets.forEach(asset => {
        // Active Devices: anything NOT 'offline' is considered Active/Online
        const isOnline = asset.status !== 'offline';

        if (isOnline) activeDevices++;

        // Alerts Count
        if (asset.status === 'critical' || asset.status === 'warning') {
            activeAlerts++;
        }

        // Energy Calc
        // Must be Energy category AND Online
        if (asset.category?.toLowerCase() === 'energy' && isOnline) {
            const val = asset.val;
            const absVal = Math.abs(val);

            // Flow Type Logic (Producer vs Consumer)
            if (asset.flowType === 'producer') {
                totalGeneration += absVal;
            } else if (asset.flowType === 'consumer') {
                totalConsumption += absVal;
            } else {
                // Fallback / Default Behavior based on Sign
                if (val > 0) {
                    if (asset.flowType !== 'storage') {
                        totalGeneration += val;
                    }
                } else if (val < 0) {
                    totalConsumption += absVal;
                }
            }
        }
    });

    const netLoad = totalConsumption - totalGeneration;

    return (
        <div className="flex flex-wrap gap-4 w-full">
            <KPI
                label="Consumption"
                value={totalConsumption.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                unit="kW"
                icon={Zap}
                color="bg-yellow-500"
            />
            <KPI
                label="Generation"
                value={totalGeneration.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                unit="kW"
                icon={Sun}
                color="bg-green-500"
            />
            <KPI
                label="Net Load"
                value={netLoad.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                unit="kW"
                icon={Activity}
                color="bg-blue-500"
            />
            <KPI
                label="Active alerts"
                value={activeAlerts}
                unit="Alerts"
                icon={AlertTriangle}
                color={activeAlerts > 0 ? "bg-red-500" : "bg-emerald-500"}
            />
            <KPI
                label="Active Devices"
                value={activeDevices}
                unit="Nodes"
                icon={Server}
                color="bg-purple-500"
            />
        </div>
    );
};
