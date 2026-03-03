"use client";

import { useRef } from 'react';
import { Mail, Instagram, Twitter } from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

export function SectionContact() {
    const containerRef = useRef<HTMLDivElement>(null);
    const headlineRef = useRef<HTMLHeadingElement>(null);
    const emailRef = useRef<HTMLAnchorElement>(null);
    const footerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            defaults: { ease: "expo.out", duration: 1 }
        });

        // 1. "Pulsujące" wejście głównego hasła
        tl.fromTo(headlineRef.current,
            { opacity: 0, scale: 0.85, filter: "blur(10px)" },
            { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.2 }
        );

        // 2. Wjazd maila z dołu
        tl.fromTo(emailRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0 },
            "-=0.8"
        );

        // 3. Ikony social media i stopka - kaskadowo (stagger)
        const footerElements = footerRef.current?.children;
        if (footerElements) {
            tl.fromTo(footerElements,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, stagger: 0.2, duration: 0.8 },
                "-=0.5"
            );
        }
    }, { scope: containerRef });

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full flex flex-col justify-between p-6 xl:p-12 bg-black text-white overflow-hidden"
        >
            <div className="flex-1 flex flex-col justify-center items-center overflow-hidden no-scrollbar w-full">
                <h2
                    ref={headlineRef}
                    className="text-5xl sm:text-6xl xl:text-8xl font-black uppercase text-center tracking-tighter leading-none wrap-break-word w-full"
                >
                    Let's<br />Make<br />Noise
                </h2>

                <a
                    ref={emailRef}
                    href="mailto:vincent@uglystock.com"
                    className="mt-6 xl:mt-8 text-sm sm:text-base xl:text-xl font-mono border-b-2 border-white pb-2 hover:bg-white hover:text-black transition-all px-4 break-all"
                >
                    contact@uglystock.com
                </a>
            </div>

            <div
                ref={footerRef}
                className="flex flex-col sm:flex-row justify-between items-center sm:items-end border-t border-neutral-800 pt-6 sm:pt-8 gap-4 sm:gap-0 mt-4"
            >
                <div className="flex gap-6 sm:gap-8">
                    <a href="#" className="hover:text-neutral-400 transition-colors"><Instagram size={24} /></a>
                    <a href="#" className="hover:text-neutral-400 transition-colors"><Twitter size={24} /></a>
                    <a href="#" className="hover:text-neutral-400 transition-colors"><Mail size={24} /></a>
                </div>

                <div className="text-center sm:text-right font-mono text-xs text-neutral-500 uppercase">
                    <p>© 2026 Ugly Stock Photo</p>
                    <p>Katowice, Poland</p>
                </div>
            </div>
        </div>
    );
}