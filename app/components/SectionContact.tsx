"use client";

import { useRef } from 'react';
import { Mail, Instagram, Twitter } from 'lucide-react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

export function SectionContact() {
    const containerRef = useRef<HTMLDivElement>(null);
    const headlineRef = useRef<HTMLHeadingElement>(null);
    const emailRef = useRef<HTMLAnchorElement>(null);
    const extraRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);
    const footerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            defaults: { ease: "expo.out", duration: 1 }
        });

        // 1. Wejście tła
        tl.fromTo(bgRef.current,
            { opacity: 0, scale: 1.1 },
            { opacity: 0.3, scale: 1, duration: 2 }
        );

        // 2. "Pulsujące" wejście głównego hasła
        tl.fromTo(headlineRef.current,
            { opacity: 0, scale: 0.85, filter: "blur(10px)" },
            { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.2 },
            "-=1.5"
        );

        // 3. Wjazd linków (instagram i mail) z dołu - szybciej i bez "przeskoku"
        const links = extraRef.current?.children;
        if (links) {
            tl.fromTo(links,
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, stagger: 0.1, duration: 0.6 },
                "-=1.2"
            );
        }

        // 4. Ikony social media i stopka - kaskadowo (stagger)
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
            {/* Background Image */}
            <div ref={bgRef} className="absolute inset-0  z-0 opacity-30 select-none pointer-events-none">
                <Image
                    src="/contact.jpg"
                    alt="UGLY STOCK PHOTO - Kontakt - Sesje zdjęciowe dla zespołów Katowice"
                    fill
                    className="object-cover contrast-100"
                />
                <div className="absolute inset-0 bg-black/10 mix-blend-color-burn" />
            </div>

            <div className="relative z-10 flex-1 flex flex-col justify-center items-center w-full gap-4">
                <h2
                    ref={headlineRef}
                    className="text-5xl sm:text-6xl xl:text-8xl font-black uppercase text-center tracking-tighter leading-none wrap-break-word w-full mb-4"
                >
                    Let's<br />Make<br />Noise
                </h2>

                <div ref={extraRef} className="flex flex-col items-center gap-4">
                    <a
                        href="https://www.instagram.com/lowigus.a/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm sm:text-base xl:text-xl font-mono border-b-2 border-white pb-2 hover:bg-white hover:text-black transition-all px-4"
                    >
                        @instagram
                    </a>

                    <a
                        ref={emailRef}
                        href="mailto:lowigusarkadiusz@gmail.com"
                        className="text-sm sm:text-base xl:text-xl font-mono border-b-2 border-white pb-2 hover:bg-white hover:text-black transition-all px-4"
                    >
                        @mail
                    </a>
                </div>
            </div>

            <div
                ref={footerRef}
                className="flex flex-col sm:flex-row justify-between items-center sm:items-end border-t border-neutral-800 pt-6 sm:pt-8 gap-4 sm:gap-0 mt-4"
            >
                <div className="flex gap-6 sm:gap-8">
                    <a
                        href="https://www.instagram.com/lowigus.a/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-neutral-400 transition-colors"
                    >
                        <Instagram size={24} />
                    </a>
                    <a href="mailto:lowigusarkadiusz@gmail.com" className="hover:text-neutral-400 transition-colors">
                        <Mail size={24} />
                    </a>
                </div>

                <address className="text-center sm:text-right font-mono text-xs text-neutral-500 uppercase not-italic">
                    <p>© 2026 Ugly Stock Photo</p>
                    <p>Katowice, Poland</p>
                </address>
            </div>
        </div>
    );
}