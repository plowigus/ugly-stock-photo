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
            { scale: 1.2, opacity: 0 },
            { scale: 1, opacity: 0.4, duration: 2 }
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
            className="relative w-full h-full flex flex-col justify-between p-6 md:p-12 overflow-hidden bg-black text-white"
        >
            {/* Background Image with Overlay */}
            <div ref={bgRef} className="absolute inset-0 z-0 opacity-40 select-none pointer-events-none">
                <Image
                    src="https://images.unsplash.com/photo-1616797147704-7df2e256d397?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXN0cmVzc2VkJTIwcG9ydHJhaXQlMjBibGFjayUyMGFuZCUyMHdoaXRlJTIwZWRneXxlbnwxfHx8fDE3NzI1NTU3MzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Distressed Portrait"
                    fill
                    priority
                    className="object-cover grayscale contrast-125 brightness-75"
                />
                <div className="absolute inset-0 bg-black/50 mix-blend-multiply" />
            </div>

            <div className="relative z-10 flex flex-col h-full justify-between pointer-events-none overflow-hidden no-scrollbar">
                <div ref={titleRef} className="uppercase tracking-tighter pt-4">
                    <h1 className="text-6xl sm:text-8xl md:text-9xl font-black leading-none tracking-tighter">
                        UGLY
                        <br />
                        STOCK
                        <br />
                        PHOTO
                    </h1>
                </div>

                <div ref={textRef} className="max-w-md pb-4 pointer-events-auto">
                    <p className="text-xs sm:text-sm md:text-base font-mono uppercase tracking-widest border-l-2 border-white pl-4">
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
