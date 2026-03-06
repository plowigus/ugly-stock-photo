"use client";

import { useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

export function SectionManifesto() {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const textureRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            defaults: { ease: "power4.out", duration: 1 }
        });

        // 1. Delikatne przesunięcie tekstury w tle
        tl.fromTo(textureRef.current,
            { scale: 1.5, opacity: 0 },
            { scale: 1, opacity: 0.2, duration: 2 }
        );

        // 2. Tytuł wjeżdża z boku z efektem "overshoot"
        tl.fromTo(titleRef.current,
            { x: -100, opacity: 0 },
            { x: 0, opacity: 1, ease: "back.out(1.7)" },
            "-=1.5"
        );

        // 3. Paragrafy wchodzą kaskadowo (stagger)
        // Szukamy wszystkich bezpośrednich dzieci (p) w contentRef
        const paragraphs = contentRef.current?.querySelectorAll('p');
        if (paragraphs) {
            tl.fromTo(paragraphs,
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    stagger: 0.2, // odstęp 0.2s między każdym paragrafem
                    duration: 0.8
                },
                "-=0.5"
            );
        }
    }, { scope: containerRef });

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full flex flex-col p-6 xl:p-12 bg-black text-white overflow-hidden"
        >
            {/* Texture Background */}
            <div ref={textureRef} className="absolute inset-0 z-0 opacity-20 pointer-events-none select-none">
                <Image
                    src="/about-photo.jpg"
                    alt="UGLY STOCK PHOTO - Autentyczna fotografia koncertowa | HC | Katowice"
                    fill
                    className="object-cover"
                />
            </div>

            <div className="max-w-6xl mx-auto w-full h-full overflow-hidden no-scrollbar">
                <div className="py-8 flex flex-col h-full">
                    <div className="flex justify-between items-end mb-4 xl:mb-16">
                        <h2
                            ref={titleRef}
                            className="text-5xl sm:text-6xl xl:text-8xl font-black uppercase tracking-tighter"
                        >
                            ABOUT ME
                        </h2>
                    </div>

                    <div
                        ref={contentRef}
                        className="space-y-3 xl:space-y-4 font-mono text-xs xl:text-sm leading-tight md:max-w-xl lg:max-w-2xl xl:max-w-3xl"
                    >
                        <p className="uppercase tracking-wide">
                            I REJECT THE POLISHED LIES<br />
                            OF MODERN PHOTOGRAPHY.
                        </p>

                        <p className="uppercase tracking-wide">
                            NO SMILES IN SUITS.<br />
                            NO STAGED HANDSHAKES.<br />
                            NO PERFECT LIGHT.<br />
                            NO CORPORATE FANTASIES.
                        </p>

                        <p className="uppercase tracking-wide">
                            I DON’T SHOOT PERFECTION.<br />
                            I HUNT TRUTH.
                        </p>

                        <p className="uppercase tracking-wide block md:hidden">
                            THE GRIT.THE SWEAT.<br />
                            THE NOISE.THE CHAOS.<br />
                            THE MOMENTS THAT BLEED.
                        </p>
                        <p className="uppercase tracking-wide hidden md:block">
                            THE GRIT.<br />
                            THE SWEAT.<br />
                            THE NOISE.<br />
                            THE CHAOS.<br />
                            THE MOMENTS THAT BLEED.
                        </p>

                        <p className="uppercase tracking-wide">
                            LIVE GIGS AREN’T CLEAN.<br />
                            LIVE GIGS AREN’T PRETTY.
                        </p>

                        <p className="uppercase tracking-wide  text-white py-1 inline-block">
                            UGLY IS HONEST.<br />
                            UGLY IS REAL.
                        </p>

                        <p className="text-xs xl:text-sm pt-1 xl:pt-4 opacity-60">
                            — Arkadiusz Łowigus / Ugly Stock Photo
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}