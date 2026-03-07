import React from 'react';
import { MapVisualizer } from './MapVisualizer/MapVisualizer';
import { KPIStats } from './KPIBoard/KPIStats';
import { AssetGrid } from './ControlPanel/AssetGrid';

export const Dashboard = ({ onNavigate }) => {
    return (
        <div className="relative h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)] w-full rounded-2xl md:rounded-3xl overflow-hidden border border-slate-200 shadow-2xl bg-slate-50/40 backdrop-blur-sm">
            {/* 1. Underlying Map/Digital Twin Layer */}
            <div className="absolute inset-0 z-0">
                <MapVisualizer
                    showFilters={false}
                    zoomControl={false}
                    onNavigate={onNavigate}
                />
            </div>
            {/* 2. Overlay UI Layer */}
            <div className="relative z-10 h-full p-4 md:p-6 flex flex-col justify-between pointer-events-none overflow-y-auto md:overflow-visible">

                {/* Top Section: KPIs */}
                <div className="pointer-events-auto mb-4 md:mb-0">
                    <KPIStats />
                </div>

                {/* Bottom Section: Controls & Detailed Stats */}
                <div className="pointer-events-auto mt-auto">
                    <AssetGrid onNavigate={onNavigate} />
                </div>
            </div>
        </div>
    );
};
