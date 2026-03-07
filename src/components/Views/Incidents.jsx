
import React, { useMemo } from 'react';
import { AlertTriangle, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { DashboardCard } from '../Shared/DashboardCard';
import { useAssets } from '../../hooks/useAssets';

export const Incidents = () => {
    const { assets } = useAssets();

    const incidents = useMemo(() => {
        const active = [];

        assets.forEach(asset => {
            // Check if asset is in abnormal state
            if (asset.status === 'critical' || asset.status === 'warning') {
                // Determine message
                let message = 'Abnormal Status';
                if (asset.incidents && asset.incidents.length > 0) {
                    message = asset.incidents[0]; // Take primary incident
                } else if (asset.val) {
                    message = `Current Reading: ${asset.val}`;
                }

                active.push({
                    id: `INC-${asset.id}`,
                    type: asset.status === 'critical' ? 'Critical' : 'Warning',
                    source: `${asset.type} (${asset.id})`,
                    message: message,
                    time: asset.lastUpdated || 'Just now',
                    status: 'Pending', // Active issues are pending resolution
                    rawStatus: asset.status
                });
            }
        });

        // Add some mock resolved ones for UI demonstration if list is short (optional, but keeps UI looking full? 
        // No, user requested "how incidents are displayed... json doesnt contain fields". 
        // Better to stick to TRUTH. Only show real active incidents.
        return active;
    }, [assets]);

    const activeCount = incidents.length;
    // We don't track resolved history yet, so 0 resolved.

    return (
        <div className="p-6 h-full flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Incident Management</h2>
                    <p className="text-slate-500">Real-time alerts and issue tracking</p>
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold border border-red-200">
                        {activeCount} Active
                    </span>
                </div>
            </div>

            <DashboardCard className="overflow-hidden p-0 flex-1 min-h-0">
                <div className="overflow-auto h-full">
                    {incidents.length > 0 ? (
                        <table className="w-full text-left border-collapse relative">
                            <thead className="sticky top-0 bg-slate-50 shadow-sm z-10">
                                <tr>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Incident ID</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Severity</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Source</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Message</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Time</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {incidents.map((inc) => (
                                    <tr key={inc.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 text-sm font-medium text-slate-700">{inc.id}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${inc.type === 'Critical' ? 'bg-red-50 text-red-600 border-red-100' :
                                                    'bg-orange-50 text-orange-600 border-orange-100'
                                                }`}>
                                                {inc.type}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-slate-600">{inc.source}</td>
                                        <td className="p-4 text-sm text-slate-800 font-medium">{inc.message}</td>
                                        <td className="p-4 text-sm text-slate-500 flex items-center gap-1">
                                            <Clock size={14} /> {inc.time}
                                        </td>
                                        <td className="p-4">
                                            <span className="flex items-center gap-1.5 text-sm font-medium text-red-500">
                                                <AlertTriangle size={14} />
                                                {inc.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline">
                                                Investigate
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                            <CheckCircle size={48} className="text-green-500 mb-4 opacity-50" />
                            <p className="text-lg font-medium text-slate-600">All Systems Normal</p>
                            <p className="text-sm">No active incidents detected.</p>
                        </div>
                    )}
                </div>
            </DashboardCard>
        </div>
    );
};
