"use client";

import { useEffect, useState } from 'react';
import Script from 'next/script';

export default function DeferredGA() {
    const [shouldLoad, setShouldLoad] = useState(false);

    useEffect(() => {
        const handleInteraction = () => {
            setShouldLoad(true);
            removeListeners();
        };

        const removeListeners = () => {
            window.removeEventListener('mousemove', handleInteraction);
            window.removeEventListener('scroll', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
            window.removeEventListener('touchstart', handleInteraction);
        };

        window.addEventListener('mousemove', handleInteraction, { once: true });
        window.addEventListener('scroll', handleInteraction, { once: true });
        window.addEventListener('keydown', handleInteraction, { once: true });
        window.addEventListener('touchstart', handleInteraction, { once: true });

        return () => removeListeners();
    }, []);

    if (!shouldLoad) return null;

    return (
        <>
            <Script
                strategy="afterInteractive"
                src="https://www.googletagmanager.com/gtag/js?id=G-365ZF0TCFD"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-365ZF0TCFD');
                `}
            </Script>
        </>
    );
}
