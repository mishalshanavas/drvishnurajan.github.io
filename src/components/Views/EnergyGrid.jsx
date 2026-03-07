
import React from 'react';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Zap, Activity, Battery, Sun } from 'lucide-react';
import { DashboardCard } from '../Shared/DashboardCard';

const loadData = [
    { time: '14 Jan 2026 12:00 AM', load: 320, solar: 0 },
    { time: '14 Jan 2026 4:00 AM', load: 280, solar: 0 },
    { time: '14 Jan 2026 6:00 AM', load: 350, solar: 50 },
    { time: '14 Jan 2026 8:00 AM', load: 550, solar: 200 },
    { time: '14 Jan 2026 10:00 AM', load: 700, solar: 450 },
    { time: '14 Jan 2026 12:00 PM', load: 750, solar: 600 },
    { time: '14 Jan 2026 2:00 PM', load: 720, solar: 580 },
    { time: '14 Jan 2026 4:00 PM', load: 600, solar: 350 },
    { time: '14 Jan 2026 6:00 PM', load: 500, solar: 50 },
    { time: '14 Jan 2026 8:00 PM', load: 480, solar: 0 },
    { time: '14 Jan 2026 10:00 PM', load: 400, solar: 0 },
];

const sourceData = [
    { name: 'Grid (KSEB)', value: 45, color: '#3b82f6' },
    { name: 'Solar', value: 35, color: '#f59e0b' },
    { name: 'Diesel Gen', value: 10, color: '#ef4444' },
    { name: 'Biogas', value: 10, color: '#22c55e' },
];

const StatCard = ({ label, value, unit, icon: Icon, color }) => (
    <div className="bg-white/60 border border-slate-200 rounded-xl p-4 flex items-center gap-4 shadow-sm hover:bg-white/80 transition-colors">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
            <Icon size={24} className={`text-${color.split('-')[1]}-600`} />
        </div>
        <div>
            <p className="text-slate-500 text-xs font-semibold uppercase">{label}</p>
            <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-800">{value}</span>
                <span className="text-sm text-slate-600 font-medium">{unit}</span>
            </div>
        </div>
    </div>
);

export const EnergyGrid = () => {
    return (
        <div className="p-6 h-full flex flex-col gap-6 overflow-y-auto">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Current Load" value="482" unit="kW" icon={Zap} color="bg-blue-500" />
                <StatCard label="Solar Generation" value="125" unit="kW" icon={Sun} color="bg-yellow-500" />
                <StatCard label="Grid Frequency" value="50.02" unit="Hz" icon={Activity} color="bg-green-500" />
                <StatCard label="Battery Storage" value="85" unit="%" icon={Battery} color="bg-purple-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[400px]">
                {/* Main Load Chart */}
                <DashboardCard title="24h Load vs Generation Profile" className="lg:col-span-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={loadData}>
                            <defs>
                                <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                            <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b' }} />
                            <Legend />
                            <Area type="monotone" dataKey="load" name="Total Load" stroke="#3b82f6" fillOpacity={1} fill="url(#colorLoad)" />
                            <Area type="monotone" dataKey="solar" name="Solar Gen" stroke="#f59e0b" fillOpacity={1} fill="url(#colorSolar)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </DashboardCard>

                {/* Sources Pie Chart */}
                <DashboardCard title="Energy Source Mix">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={sourceData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {sourceData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b' }} />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </DashboardCard>
            </div>

            <DashboardCard title="Feeder Status" className="min-h-[200px]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {['Feeder 1 (Admin Block)', 'Feeder 2 (Hostels)', 'Feeder 3 (Labs)'].map((feeder, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="font-medium text-slate-700">{feeder}</span>
                            </div>
                            <span className="text-sm text-slate-500">Normal</span>
                        </div>
                    ))}
                </div>
            </DashboardCard>
        </div>
    );
};
