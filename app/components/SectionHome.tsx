"use client";

import { useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

export function SectionHome() {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Tworzymy timeline dla lepszej kontroli sekwencji
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

        tl.fromTo(bgRef.current,
            { opacity: 0 },
            { opacity: 0.4, duration: 2 }
        )
            .fromTo(titleRef.current,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 1 },
                "-=1.5" // Startuje 1.5s przed końcem poprzedniej animacji
            )
            .fromTo(textRef.current,
                { x: -20, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.8 },
                "-=0.5"
            );
    }, { scope: containerRef });

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full flex flex-col justify-between p-6 xl:p-12 overflow-hidden bg-black text-white"
        >
            {/* Background Image with Overlay */}
            <div ref={bgRef} className="absolute inset-0 z-0 opacity-50 select-none pointer-events-none">
                <Image
                    src="/hero_photo.jpg"
                    alt="Ugly Stock Photo"
                    fill
                    priority
                    className="object-cover grayscale contrast-125 brightness-100"
                />
                <div className="absolute inset-0 bg-black/25 mix-blend-multiply" />
            </div>

            <div className="relative z-10 flex flex-col h-full justify-between pointer-events-none overflow-hidden no-scrollbar">
                <div ref={titleRef} className="uppercase tracking-tighter pt-4">
                    <h1
                        className="text-6xl sm:text-8xl leading-none tracking-tighter"
                        style={{
                            fontFamily: "'ToughHorror', sans-serif",
                            fontSize: 'clamp(3.75rem, 10vw, 160px)',
                            letterSpacing: 'clamp(0px, 1vw, 12px)',
                        }}
                    >
                        UGLY
                        <br />
                        STOCK
                        <br />
                        PHOTO
                    </h1>
                </div>

                <div ref={textRef} className="max-w-md pb-4 pointer-events-auto">
                    <p className="text-xs sm:text-sm xl:text-base font-mono uppercase tracking-widest border-l-2 border-white pl-4">
                        Raw. Unfiltered. Hardcore.
                        <br />
                        No technical shapes.
                        <br />
                        Just pure chaos.
                    </p>
                </div>
            </div>
        </div>
    );
}
