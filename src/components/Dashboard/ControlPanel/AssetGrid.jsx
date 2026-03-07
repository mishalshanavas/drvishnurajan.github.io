import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAssets } from '../../../hooks/useAssets';
import { SystemControls } from './SystemControls';



const ChartCard = ({ title, children }) => (
    <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-4 shadow-xl flex flex-col h-64">
        <h3 className="text-slate-600 font-semibold mb-4 text-sm uppercase tracking-wider">{title}</h3>
        <div className="flex-1 w-full min-h-0">
            {children}
        </div>
    </div>
);

const AlertsPanel = ({ onNavigate }) => {
    const { assets } = useAssets();
    const alerts = assets.filter(asset => asset.status === 'critical' || asset.status === 'warning');

    return (
        <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-4 shadow-xl flex flex-col h-64 overflow-hidden">
            <h3 className="text-slate-600 font-semibold mb-4 text-sm uppercase tracking-wider flex items-center justify-between">
                Active Alerts
                {alerts.length > 0 && (
                    <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full border border-red-200">{alerts.length} Active</span>
                )}
            </h3>
            <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                {alerts.length > 0 ? (
                    alerts.map(alert => {
                        // Determine the message to show. Prioritize custom incident message.
                        const msg = (alert.incidents && alert.incidents.length > 0)
                            ? alert.incidents[0]
                            : alert.details;

                        return (
                            <button
                                key={alert.id}
                                onClick={() => onNavigate && onNavigate('live', { assetId: alert.id })}
                                className={`w-full text-left flex items-start gap-3 p-3 rounded-xl border transition-all hover:shadow-md active:scale-95 ${alert.status === 'critical' ? 'bg-red-50 border-red-100' : 'bg-orange-50 border-orange-100'}`}
                            >
                                <AlertCircle size={18} className={`${alert.status === 'critical' ? 'text-red-500' : 'text-orange-500'} shrink-0 mt-0.5`} />
                                <div className="flex-1 min-w-0">
                                    <h4 className={`${alert.status === 'critical' ? 'text-red-700' : 'text-orange-700'} text-sm font-medium truncate`}>
                                        {alert.type}
                                    </h4>
                                    <div className="flex justify-between items-start mt-1 gap-2">
                                        <p className={`${alert.status === 'critical' ? 'text-red-600/90' : 'text-orange-600/90'} text-xs font-semibold leading-relaxed line-clamp-2`}>
                                            {msg}
                                        </p>
                                        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded shrink-0 ${alert.status === 'critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                                            {Math.abs(alert.val)}
                                        </span>
                                    </div>
                                </div>
                            </button>
                        )
                    })
                ) : (
                    <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-100 rounded-xl">
                        <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-green-700 text-sm font-medium">All Systems Normal</h4>
                            <p className="text-green-600/80 text-xs mt-1">No active alerts reported.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export const AssetGrid = ({ onNavigate }) => {
    const { totalLoadHistory } = useAssets();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full max-w-[1200px] ml-auto">
            <ChartCard title="Live Load Profile (kW)">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={totalLoadHistory && totalLoadHistory.length > 0 ? totalLoadHistory : []}>
                        <defs>
                            <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorGen" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                        <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} width={40} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="load"
                            name="Load (kW)"
                            stroke="#f59e0b"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorLoad)"
                            isAnimationActive={false}
                        />
                        <Area
                            type="monotone"
                            dataKey="generation"
                            name="Generation (kW)"
                            stroke="#22c55e"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorGen)"
                            isAnimationActive={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </ChartCard>

            <SystemControls onNavigate={onNavigate} />

            <AlertsPanel onNavigate={onNavigate} />
        </div>
    );
};
