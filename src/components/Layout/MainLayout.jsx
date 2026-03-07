
import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const MainLayout = ({ children, activeView, setActiveView, onNavigate }) => {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

    return (
        <div className="flex h-screen w-full bg-slate-50 text-slate-900 overflow-hidden relative selection:bg-cyan-500/30">
            {/* Background Ambient Glow */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-200/40 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/40 rounded-full blur-[120px]" />
            </div>

            <Sidebar
                activeView={activeView}
                onNavigate={onNavigate}
                isOpen={isMobileSidebarOpen}
                onClose={() => setIsMobileSidebarOpen(false)}
            />

            <div className="flex flex-col flex-1 relative z-10 w-0"> {/* w-0 to allow flex shrinking properly */}
                <Header
                    onNavigate={onNavigate}
                    onMenuClick={() => setIsMobileSidebarOpen(true)}
                />
                <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 relative">
                    <div className="max-w-[1600px] mx-auto h-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};
