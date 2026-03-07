
import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Droplets, AlertCircle, CheckCircle2, Waves } from 'lucide-react';
import { DashboardCard } from '../Shared/DashboardCard';

const tankData = [
    { name: 'Tank A (Main)', level: 15 },
    { name: 'Tank B (Hostel)', level: 45 },
    { name: 'Tank C (Labs)', level: 92 },
    { name: 'Tank D (Mess)', level: 30 },
    { name: 'Tank E (Admin)', level: 78 },
];

const flowData = [
    { time: '14 Jan 2026 6:00 AM', flow: 120 },
    { time: '14 Jan 2026 9:00 AM', flow: 450 },
    { time: '14 Jan 2026 12:00 PM', flow: 380 },
    { time: '14 Jan 2026 3:00 PM', flow: 200 },
    { time: '14 Jan 2026 6:00 PM', flow: 500 },
    { time: '14 Jan 2026 9:00 PM', flow: 300 },
];

const QualityCard = ({ label, value, unit, status }) => (
    <div className="bg-white/60 border border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center gap-2 shadow-sm">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${status === 'good' ? 'bg-green-100 text-green-600' :
            status === 'warning' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
            }`}>
            {status === 'good' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
        </div>
        <span className="text-3xl font-bold text-slate-800">{value}<span className="text-sm text-slate-500 font-medium ml-1">{unit}</span></span>
        <span className="text-slate-500 text-xs font-semibold uppercase">{label}</span>
    </div>
);

export const WaterSystem = () => {
    return (
        <div className="p-6 h-full flex flex-col gap-6 overflow-y-auto">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-cyan-500 text-white rounded-2xl p-6 md:col-span-1 flex flex-col justify-between shadow-lg shadow-cyan-500/20">
                    <Droplets size={32} className="mb-4 opacity-80" />
                    <div>
                        <p className="text-cyan-100 text-sm font-medium">Total Daily Consump.</p>
                        <h3 className="text-3xl font-bold mt-1">45.2 kL</h3>
                    </div>
                </div>
                <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <QualityCard label="pH Level" value="7.2" unit="" status="good" />
                    <QualityCard label="Turbidity" value="1.8" unit="NTU" status="good" />
                    <QualityCard label="Chlorine" value="0.4" unit="mg/L" status="warning" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[400px]">
                <DashboardCard title="Tank Levels (%)">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={tankData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                            <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b' }} />
                            <Bar dataKey="level" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </DashboardCard>

                <DashboardCard title="Flow Rate (L/min)">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={flowData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                            <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b' }} />
                            <Line type="monotone" dataKey="flow" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', strokeWidth: 2 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </DashboardCard>
            </div>
        </div>
    );
};
