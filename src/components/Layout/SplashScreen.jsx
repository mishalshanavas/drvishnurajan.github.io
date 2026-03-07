import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Loader2 } from 'lucide-react';

export const SplashScreen = ({ onComplete }) => {
    const { user, login, loading } = useAuth();
    const [isExiting, setIsExiting] = useState(false);
    const [loginError, setLoginError] = useState(null);

    // Auto-proceed if already logged in
    // Auto-proceed if already logged in
    useEffect(() => {
        // Cleanup static loader immediately when React is ready
        const staticLoader = document.getElementById('static-loader');
        if (staticLoader) {
            staticLoader.style.opacity = '0';
            setTimeout(() => staticLoader.remove(), 500);
        }

        if (!loading && user) {
            // Short delay to show branding before entering
            const timer = setTimeout(() => {
                setIsExiting(true);
                setTimeout(onComplete, 500); // 500ms match transition duration
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [user, loading, onComplete]);

    const handleLogin = async () => {
        setLoginError(null);
        try {
            await login();
        } catch (error) {
            console.error(error);
            setLoginError("Login failed. Please try again.");
        }
    };

    return (
        <div className={`fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-white transition-opacity duration-500 ${isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className={`flex flex-col items-center gap-8 duration-700 ${isExiting ? 'scale-110' : 'animate-in fade-in zoom-in'}`}>
                <div className="text-center space-y-2">
                    <h1 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">
                        Gram Vista
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 font-medium uppercase tracking-widest">
                        Sahrdaya CPS Dashboard
                    </p>
                </div>

                {/* Image moved to bottom */}
                <div className="hidden"></div>

                {/* Login or Loading State */}
                <div className="h-16 flex items-center justify-center">
                    {loading ? (
                        <div className="flex flex-col items-center gap-2 text-slate-400">
                            <Loader2 size={24} className="animate-spin" />
                            <span className="text-xs font-semibold uppercase tracking-wide">Initializing...</span>
                        </div>
                    ) : !user ? (
                        <div className="flex flex-col items-center gap-3 animate-in slide-in-from-bottom-4 fade-in duration-500">
                            <button
                                onClick={handleLogin}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
                            >
                                <User size={20} />
                                Sign In with Google
                            </button>
                            {loginError && (
                                <p className="text-red-500 text-sm font-medium">{loginError}</p>
                            )}
                            <p className="text-xs text-slate-400">Restricted Access • Authorized Personnel Only</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-green-600 animate-in fade-in zoom-in">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                <User size={16} />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wide">Welcome, {user.displayName}</span>
                        </div>
                    )}
                </div>
            </div>



            {/* Bottom Infinite Scrolling Image Chain */}
            <div className="absolute bottom-0 w-full overflow-hidden z-0">
                <div className="flex w-max animate-scroll">
                    {/* First set of images - Continuous Chain */}
                    {[...Array(20)].map((_, i) => (
                        <img
                            key={`a-${i}`}
                            src={`${import.meta.env.BASE_URL}full.png`}
                            alt=""
                            className="h-10 md:h-14 w-auto object-contain opacity-100 shrink-0"
                        />
                    ))}
                    {/* Duplicate set for seamless loop */}
                    {[...Array(20)].map((_, i) => (
                        <img
                            key={`b-${i}`}
                            src={`${import.meta.env.BASE_URL}full.png`}
                            alt=""
                            className="h-10 md:h-14 w-auto object-contain opacity-100 shrink-0"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
