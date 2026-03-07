
import React from 'react';

export const DashboardCard = ({ title, children, className = "" }) => (
    <div className={`bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-6 shadow-xl flex flex-col ${className}`}>
        {title && <h3 className="text-slate-600 font-semibold mb-4 text-sm uppercase tracking-wider">{title}</h3>}
        <div className="flex-1 w-full min-h-0 relative">
            {children}
        </div>
    </div>
);
