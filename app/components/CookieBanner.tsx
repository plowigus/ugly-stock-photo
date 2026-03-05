"use client";

import { useState, useEffect } from 'react';

export function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 w-full z-100 md:bottom-8 md:right-8 md:left-auto md:max-w-[400px] animate-in slide-in-from-bottom duration-500">
            <div className="bg-black border-t-2 md:border-2 border-white p-8 sm:p-10 flex flex-col gap-6 shadow-2xl">
                <div className="space-y-4">
                    <h3 className="font-black uppercase tracking-tighter text-2xl italic">Cookie Notice</h3>
                    <p className="font-mono text-xs sm:text-sm text-neutral-300 leading-relaxed uppercase">
                        We use cookies to understand how you interact with our grit. By staying here, you accept our honest tracking.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={handleAccept}
                        className="flex-1 py-4 border-2 border-white bg-white text-black font-black uppercase tracking-widest text-xs sm:text-sm hover:bg-black hover:text-white transition-all duration-300 cursor-pointer active:scale-95"
                    >
                        I AGREE
                    </button>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="flex-1 py-4 border-2 border-white bg-black text-white font-black uppercase tracking-widest text-xs sm:text-sm hover:bg-white hover:text-black transition-all duration-300 cursor-pointer active:scale-95 opacity-60 hover:opacity-100"
                    >
                        DISMISS
                    </button>
                </div>
            </div>
        </div>
    );
}
